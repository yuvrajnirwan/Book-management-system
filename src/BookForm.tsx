
import {useState} from "react";
import type {ChangeEvent} from "react";
import React from "react";
import type {Books} from "./Books.tsx";

function BookForm(){
   const [form,setForm]=useState({
       id: 0,
       bookName:"",
       author:"",
       isbn:0,
       publishDate:"",
       age: 0,
       pageNo:0,
       ebookSize:0,
       genre:"",
       price:0,
       discount: 5,
       bookType:""
   });

   const calculateAge = (date:string) => {
       const currYear = new Date().getFullYear();
       const publishYear = new Date(date).getFullYear();
       return currYear - publishYear;
   }

   const disPrice=(price:number,discount:number) => {
       return price - (price * (discount/100));
   }
    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

       setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        // console.log(form);


    };
    const [books, setBooks] = useState<Books[]>([]);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.bookName || !form.author || !form.publishDate || !form.genre || !form.price || !form.isbn || !form.pageNo || !form.ebookSize || !form.bookType || !form.genre) {
            alert("Please fill in all required fields!");
            return;
        }

        if(form.bookType==="Ebook") {
            const newBook: Books = {
                ...form,
                age: calculateAge(form.publishDate),
                price: disPrice(Number(form.price), Number(form.discount),),
                discount:10
            };
            setBooks([...books, newBook]);
            console.log(newBook);

            setForm({
                bookType: "",
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
                discount: 0
            });
        }
    }

    return (
        <div className="formContainer">
            <form className="bookSubmitForm" onSubmit={handleSubmit} id="bookForm">
                <h1>Book Entry Form</h1>
                <hr/>
                <br/>
                <label htmlFor="bookName">Title:</label>
                <input type="text" name="bookName" id="bookName" className="inputBox" placeholder="Enter book name" value={form.bookName} onChange={handleChange} />
                <br/>
                <br/>
                <label htmlFor="authorName">Author name:</label>
                <input type="text" name="author" id="authorName" className="inputBox"
                       placeholder="Enter author of the book" value={form.author} onChange={handleChange} />
                <br/>
                <br/>
                <label htmlFor="isbnNumber">ISBN No.:</label>
                <input type="number" min="0" name="isbn" id="isbnNumber" className="inputBox"
                       placeholder="Enter book's ISBN no." value={form.isbn} onChange={handleChange} />
                <br/>
                <br/>
                <label htmlFor="publishDate">Publication Date:</label>
                <input type="date" name="publishDate" id="publishDate" className="inputBox" value={form.publishDate} onChange={handleChange} />
                <br/>
                <br/>
                <label htmlFor="bookType">Book Type:</label>
                <select name="bookType" id="bookType"  value={form.bookType} onChange={handleChange} >
                    <option value="" disabled hidden>Select book type</option>
                    <option value="Printed Book">Printed Book</option>
                    <option value="Ebook">Ebook</option>
                </select>
                <br/>

                <label htmlFor="pageNo" id="pageLabel">Hardcopy size(Pages):</label>
                <input type="number" min="0" name="pageNo" id="pageNo" className="inputBox" value={form.pageNo} onChange={handleChange} />
                <br/>
                <br/>
                <label htmlFor="ebookSize" id="sizeLabel">Ebook Size(MB):</label>
                <input type="number" min="0" name="ebookSize" id="ebookSize" className="inputBox" value={form.ebookSize} onChange={handleChange} />
                <br/>
                <br/>
                <label htmlFor="genreInput">Genre:</label>
                <select name="genre" id="genreInput" value={form.genre} onChange={handleChange} >
                    <option value="" disabled hidden>Select a genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-fiction</option>
                    <option value="sci-fi">Sci-fi</option>
                    <option value="comedy">Comedy</option>
                    <option value="thriller">Thriller</option>
                    <option value="action">Action</option>
                    <option value="horror">Horror</option>
                    <option value="mystery">Mystery</option>
                </select>
                <br/>
                <label htmlFor="price">Price(₹):</label>
                <input type="number" min="0" name="price" id="price" className="inputBox" value={form.price} onChange={handleChange} />
                <br/>
                <br/>
                <button type="submit" className="addToLibrary">Submit</button>
            </form>
    <div className="libraryContainer">
        <h2>Library</h2>
        <hr/>
        <table className="libraryTable" id="libraryTable">
            <tbody>
            <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN no.</th>
                <th>Publish date</th>
                <th>Age(years)</th>
                <th>Genre <select name="genre" id="genreSelect">
                    <option defaultValue="all">All</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-fiction</option>
                    <option value="sci-fi">Sci-fi</option>
                    <option value="comedy">Comedy</option>
                    <option value="thriller">Thriller</option>
                    <option value="action">Action</option>
                    <option value="horror">Horror</option>
                    <option value="mystery">Mystery</option>
                </select></th>
                <th>Pages</th>
                <th>Ebook Size(MB)</th>
                <th>Discount(%)</th>
                <th>Discounted Price(₹)</th>
                <th className="editRow">Edit</th>
                <th className="deleteRow">Delete</th>
            </tr>
            </tbody>
        </table>
        <button id="saveEdit">Save Changes</button>
    </div>
    </div>
    )
}

export default BookForm;