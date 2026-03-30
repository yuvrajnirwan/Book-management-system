import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Books } from "./Books.tsx";

function BookForm() {
    const initialFormState: Books = {
        id: 0,
        bookName: "",
        author: "",
        isbn: 0,
        publishDate: "",
        age: 0,
        pageNo: 0,
        ebookSize: 0,
        genre: "",
        price: 0,
        discount: 5,
        bookType: ""
    };

    const [form, setForm] = useState<Books>(initialFormState);
    const [books, setBooks] = useState<Books[]>([]);

    const [editIndex, setEditIndex] = useState<number | null>(null);

    const calculateAge = (date: string): number => {
        if (!date) return 0;
        const currYear = new Date().getFullYear();
        const publishYear = new Date(date).getFullYear();
        return currYear - publishYear;
    };

    const disPrice = (price: number, discount: number): string => {
        return (price - (price * (discount / 100))).toFixed(2);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: (name === 'price' || name === 'ISBN' || name === 'pageNo' || name === 'ebookSize')
                ? (value === '' ? 0 : Number(value))
                : value
        }));
    };

    const handleSaveProcess = () => {
        if (!form.bookName || !form.author || !form.publishDate || !form.bookType) {
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
            const updatedLibrary = books.map((b, i) => i === editIndex ? updatedBook : b);
            setBooks(updatedLibrary);
            setEditIndex(null);
        } else {
            setBooks([...books, updatedBook]);
        }
        setForm(initialFormState);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSaveProcess();
    };

    return (
        <div className="formContainer">
            <form className="bookSubmitForm" onSubmit={handleSubmit} id="bookForm">
                <h1>{editIndex !== null ? "Edit Book" : "Book Entry Form"}</h1>
                <hr /><br />

                <label htmlFor="bookName">Title:</label>
                <input type="text" name="bookName" id="bookName" className="inputBox" value={form.bookName} onChange={handleChange} />
                <br /><br />

                <label htmlFor="authorName">Author name:</label>
                <input type="text" name="author" id="authorName" className="inputBox" value={form.author} onChange={handleChange} />
                <br /><br />

                <label htmlFor="isbnNumber">ISBN No.:</label>
                <input type="number" name="isbn" id="isbnNumber" className="inputBox" value={form.isbn} onChange={handleChange} />
                <br /><br />

                <label htmlFor="publishDate">Publication Date:</label>
                <input type="date" name="publishDate" id="publishDate" className="inputBox" value={form.publishDate} onChange={handleChange} />
                <br /><br />

                <label htmlFor="bookType">Book Type:</label>
                <select name="bookType" id="bookType" value={form.bookType} onChange={handleChange}>
                    <option value="" disabled hidden>Select type</option>
                    <option value="Printed Book">Printed Book</option>
                    <option value="Ebook">Ebook</option>
                </select>
                <br /><br />

                {form.bookType === "Printed Book" && (
                    <>
                        <label htmlFor="pageNo" id="pageLabel">Hardcopy size(Pages):</label>
                        <input type="number" name="pageNo" id="pageNo" className="inputBox" value={form.pageNo} onChange={handleChange} />
                        <br /><br />
                    </>
                )}

                {form.bookType === "Ebook" && (
                    <>
                        <label htmlFor="ebookSize" id="sizeLabel">Ebook Size(MB):</label>
                        <input type="number" name="ebookSize" id="ebookSize" className="inputBox" value={form.ebookSize} onChange={handleChange} />
                        <br /><br />
                    </>
                )}

                <label htmlFor="genreInput">Genre:</label>
                <select name="genre" id="genreInput" value={form.genre} onChange={handleChange}>
                    <option value="" disabled hidden>Select a genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-fiction</option>
                    <option value="sci-fi">Sci-fi</option>
                </select>
                <br /><br />

                <label htmlFor="price">Price(₹):</label>
                <input type="number" name="price" id="price" className="inputBox" value={form.price} onChange={handleChange} />
                <br /><br />

                <button type="submit" className="addToLibrary">
                    {editIndex !== null ? "Update Book" : "Submit"}
                </button>
            </form>

            <div className="libraryContainer">
                <h2>Library</h2>
                <hr />
                <table className="libraryTable" id="libraryTable">
                    <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN no.</th>
                        <th>Publish date</th>
                        <th>Age(years)</th>
                        <th>Genre</th>
                        <th>Pages</th>
                        <th>Ebook Size(MB)</th>
                        <th>Price(₹)</th>
                        <th>Discount(%)</th>
                        <th>Discounted Price(₹)</th>
                        <th className="editRow">Edit</th>
                        <th className="deleteRow">Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((book, idx) => (
                        <tr key={idx} >

                            <td>{idx + 1}</td>
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
                            <td>
                                <button className="editRow" onClick={() => {
                                    setForm({ ...book });
                                    setEditIndex(idx);
                                }}>Edit</button>
                            </td>
                            <td>
                                <button className="deleteRow" onClick={() => setBooks(books.filter((_, i) => i !== idx))}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {editIndex !== null && (
                    <button id="saveEdit" onClick={handleSaveProcess}>Save edit</button>
                )}
            </div>
        </div>
    );
}

export default BookForm;