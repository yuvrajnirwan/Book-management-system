import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ChangeEvent, SubmitEvent, KeyboardEvent } from "react";

import type { Books } from "./types/Books.ts";
import type { RootState, AppDispatch } from "./app/store";

import { setAllBooks, addBook, updateBook, deleteBook } from "./features/BookSlice";

function BookForm() {
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.library.books);

    const initialFormState: Books = {
        id: 0,
        bookName: "",
        author: "",
        isbn: 0,
        publishDate: "",
        bookType: "",
        pageNo: 0,
        ebookSize: 0,
        genre: "",
        price: 0,
        discount: 0,
        age: 0
    };

    const [form, setForm] = useState<Books>(initialFormState);

    const [editId, setEditId] = useState<number | null>(null);
    const [genreFilter, setGenreFilter] = useState("All");


    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:3000/books');
                if (response.ok) {
                    const data = await response.json();
                    dispatch(setAllBooks(data));
                } else {
                    console.error("Failed to fetch books from server");
                }
            } catch (error) {
                console.error("Network error while fetching books:", error);
            }
        };

        fetchBooks();
    }, [dispatch]);

    const calculateAge = (date: string): number => {
        if (!date) return 0;
        return new Date().getFullYear() - new Date(date).getFullYear();
    };

    const disPrice = (price: number, discount: number): string => {
        return (price - (price * (discount / 100))).toFixed(2);
    };

    const blockInvalidChar = (e: KeyboardEvent) =>
        ['e', 'E', '-', '+'].includes(e.key) && e.preventDefault();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev: Books) => ({
            ...prev,
            [name]: (name === 'price' || name === 'isbn' || name === 'pageNo' || name === 'ebookSize')
                ? (value === '' ? 0 : Math.max(0, Number(value)))
                : value
        }));
    };


    const handleSaveProcess = async () => {
        if (!form.bookName || !form.author || !form.publishDate || !form.bookType || !form.genre) {
            alert("Please fill all required fields!");
            return;
        }

        const isEbook = form.bookType === "Ebook";
        const currentDiscount = isEbook ? 10 : 5;

        // Calculate finalPrice here so the backend receives it
        const calculatedFinalPrice = disPrice(form.price, currentDiscount);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = form;

        const updatedBook = {
            ...rest,
            finalPrice: calculatedFinalPrice, // <--- ADD THIS LINE
            age: calculateAge(form.publishDate),
            discount: currentDiscount,
            pageNo: form.bookType === "Printed Book" ? form.pageNo : 0,
            ebookSize: form.bookType === "Ebook" ? form.ebookSize : 0
        };



        try {
            if (editId !== null) {

                const response = await fetch(`http://localhost:3000/books/${editId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedBook)
                });

                if (response.ok) {
                    const savedBook = await response.json();
                    dispatch(updateBook(savedBook));
                    setEditId(null);
                } else {
                    alert("Failed to update book on server.");
                }
            } else {

                const response = await fetch('http://localhost:3000/books', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedBook)
                });

                if (response.ok) {
                    const newDbBook = await response.json();
                    dispatch(addBook(newDbBook));
                } else {
                    alert("Failed to save book to server.");
                }
            }
            setForm(initialFormState);
        } catch (error) {
            console.error("Network error saving book:", error);
            alert("Could not connect to the server.");
        }
    };


    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/books/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                dispatch(deleteBook(id));
            } else {
                alert("Failed to delete book from server.");
            }
        } catch (error) {
            console.error("Network error deleting book:", error);
            alert("Could not connect to the server.");
        }
    };

    const filteredBooks = books.filter(book =>
        genreFilter === "All" || book.genre === genreFilter
    );

    return (
        <div className="formContainer">

            <form className="bookSubmitForm" onSubmit={(e: SubmitEvent) => { e.preventDefault(); handleSaveProcess(); }}>
                <h1>{editId !== null ? "Edit Book" : "Book Entry Form"}</h1>
                <hr /><br />

                <label>Title:</label>
                <input type="text" name="bookName" className="inputBox" value={form.bookName} onChange={handleChange} />
                <br /><br />

                <label>Author:</label>
                <input type="text" name="author" className="inputBox" value={form.author} onChange={handleChange} />
                <br /><br />

                <label>ISBN No.:</label>
                <input type="number" name="isbn" className="inputBox" value={form.isbn} onChange={handleChange} onKeyDown={blockInvalidChar} min="0" />
                <br /><br />

                <label>Publication Date:</label>
                <input type="date"  name="publishDate" className="inputBox" value={form.publishDate} onChange={handleChange} />
                <br /><br />

                <label>Book Type:</label>
                <select className="inputBox" name="bookType" value={form.bookType} onChange={handleChange}>
                    <option value="" disabled hidden>Select type</option>
                    <option value="Printed Book">Printed Book</option>
                    <option value="Ebook">Ebook</option>
                </select>
                <br /><br />

                {form.bookType === "Printed Book" && (
                    <><label>Pages:</label><input type="number" name="pageNo" className="inputBox" value={form.pageNo} onChange={handleChange} onKeyDown={blockInvalidChar} min="0" /><br /><br /></>
                )}

                {form.bookType === "Ebook" && (
                    <><label>Size (MB):</label><input type="number" name="ebookSize" className="inputBox" value={form.ebookSize} onChange={handleChange} onKeyDown={blockInvalidChar} min="0" /><br /><br /></>
                )}

                <label>Genre:</label>
                <select name="genre" className="inputBox" value={form.genre} onChange={handleChange}>
                    <option value="" disabled hidden>Select a genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-fiction</option>
                    <option value="sci-fi">Sci-fi</option>
                </select>
                <br /><br />

                <label>Price(₹):</label>
                <input type="number" name="price" className="inputBox" value={form.price} onChange={handleChange} onKeyDown={blockInvalidChar} min="0" />
                <br /><br />

                <button type="submit" className="addToLibrary">{editId !== null ? "Update Book" : "Submit"}</button>
            </form>

            <div className="libraryContainer">
                <h2>Library</h2>
                <hr /><br />

                <table className="libraryTable">
                    <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Date</th>
                        <th>Age</th>

                        <th>
                            <select
                                value={genreFilter}
                                onChange={(e) => setGenreFilter(e.target.value)}
                                style={{ fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer' }}
                            >
                                <option value="All">Genre (All)</option>
                                <option value="fiction">Fiction</option>
                                <option value="non-fiction">Non-fiction</option>
                                <option value="sci-fi">Sci-fi</option>
                            </select>
                        </th>
                        <th>Pages</th>
                        <th>MB</th>
                        <th>Price</th>
                        <th>Disc%</th>
                        <th>Final Price</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBooks.map((book, index) => {
                        return (
                        <tr key={book.id}>
                            <td>{index + 1}</td>
                            <td>{book.bookName}</td>
                            <td>{book.author}</td>
                            <td>{book.isbn}</td>
                            <td>{book.publishDate}</td>
                            <td>{book.age}</td>
                            <td>{book.genre}</td>
                            <td>{book.bookType === "Printed Book" ? book.pageNo : "-"}</td>
                            <td>{book.bookType === "Ebook" ? book.ebookSize : "-"}</td>
                            <td>₹{book.price}</td>
                            <td>{book.discount}%</td>
                            <td>₹{disPrice(book.price, book.discount)}</td>

                            {/* Updated to use book.id */}
                            <td><button onClick={() => { setForm({ ...book }); setEditId(book.id); }}>Edit</button></td>

                            {/* Updated to call the API delete function */}
                            <td><button onClick={() => handleDelete(book.id)}>Delete</button></td>
                        </tr>
                    );
                    })}
                    </tbody>
                </table>
                {editId !== null && (
                    <button id="saveEdit" onClick={handleSaveProcess} style={{ marginTop: '10px' }}>Save edit</button>
                )}
            </div>
        </div>
    );
}

export default BookForm;