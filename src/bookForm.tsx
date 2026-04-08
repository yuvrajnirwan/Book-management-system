import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ChangeEvent, SubmitEvent, KeyboardEvent } from "react";

import type { Books } from "./types/Books.ts";
import type { RootState, AppDispatch } from "./app/store";
import { addBook, updateBook, deleteBook } from "./features/BookSlice";

function BookForm() {
    const dispatch = useDispatch<AppDispatch>();
    const books = useSelector((state: RootState) => state.library.books);

    const initialFormState: Books = {
        id: 0, bookName: "", author: "", isbn: 0, publishDate: "",
        age: 0, pageNo: 0, ebookSize: 0, genre: "", price: 0,
        discount: 5, bookType: ""
    };

    const [form, setForm] = useState<Books>(initialFormState);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // --- Filter State ---
    const [genreFilter, setGenreFilter] = useState("All");

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

    const handleSaveProcess = () => {
        if (!form.bookName || !form.author || !form.publishDate || !form.bookType || !form.genre) {
            alert("Please fill all required fields!");
            return;
        }
        const isEbook = form.bookType === "Ebook";
        const updatedBook: Books = {
            ...form,
            age: calculateAge(form.publishDate),
            discount: isEbook ? 10 : 5,
            pageNo: form.bookType === "Printed Book" ? form.pageNo : 0,
            ebookSize: form.bookType === "Ebook" ? form.ebookSize : 0
        };

        if (editIndex !== null) {
            dispatch(updateBook({ index: editIndex, book: updatedBook }));
            setEditIndex(null);
        } else {
            dispatch(addBook(updatedBook));
        }
        setForm(initialFormState);
    };

    // --- Filter Logic ---
    const filteredBooks = books.filter(book =>
        genreFilter === "All" || book.genre === genreFilter
    );

    return (
        <div className="formContainer">
            {/* 1. ENTRY FORM */}
            <form className="bookSubmitForm" onSubmit={(e: SubmitEvent) => { e.preventDefault(); handleSaveProcess(); }}>
                <h1>{editIndex !== null ? "Edit Book" : "Book Entry Form"}</h1>
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
                <input type="date" name="publishDate" className="inputBox" value={form.publishDate} onChange={handleChange} />
                <br /><br />

                <label>Book Type:</label>
                <select name="bookType" value={form.bookType} onChange={handleChange}>
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
                <select name="genre" value={form.genre} onChange={handleChange}>
                    <option value="" disabled hidden>Select a genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-fiction</option>
                    <option value="sci-fi">Sci-fi</option>
                </select>
                <br /><br />

                <label>Price(₹):</label>
                <input type="number" name="price" className="inputBox" value={form.price} onChange={handleChange} onKeyDown={blockInvalidChar} min="0" />
                <br /><br />

                <button type="submit" className="addToLibrary">{editIndex !== null ? "Update Book" : "Submit"}</button>
            </form>

            {/* 2. LIBRARY TABLE SECTION */}
            <div className="libraryContainer">
                <h2>Library</h2>
                <hr /><br />

                <table className="libraryTable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Date</th>
                        <th>Age</th>
                        {/* GENRE FILTER INSIDE THE CELL */}
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
                    {filteredBooks.map((book) => {
                        const originalIndex = books.findIndex(b => b === book);
                        return (
                            <tr key={originalIndex}>
                                <td>{originalIndex + 1}</td>
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
                                <td><button onClick={() => { setForm({ ...book }); setEditIndex(originalIndex); }}>Edit</button></td>
                                <td><button onClick={() => dispatch(deleteBook(originalIndex))}>Delete</button></td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {editIndex !== null && (
                    <button id="saveEdit" onClick={handleSaveProcess} style={{ marginTop: '10px' }}>Save edit</button>
                )}
            </div>
        </div>
    );
}

export default BookForm;