
import {useState} from "react";
import LibraryTable from "./LibraryTable.tsx";
function BookForm(){
    const [showTable, setShowTable] = useState(false);
    return (
        <div className="formContainer">
            <form className="bookSubmitForm" id="bookForm">
                <h1>Book Entry Form</h1>
                <hr/>
                <br/>
                <label htmlFor="bookName">Title:</label>
                <input type="text" name="Bname" id="bookName" className="inputBox" placeholder="Enter book name"/>
                <br/>
                <br/>
                <label htmlFor="authorName">Author name:</label>
                <input type="text" name="Author" id="authorName" className="inputBox"
                       placeholder="Enter author of the book"/>
                <br/>
                <br/>
                <label htmlFor="isbnNumber">ISBN No.:</label>
                <input type="number" name="ISBN" id="isbnNumber" className="inputBox"
                       placeholder="Enter book's ISBN no."/>
                <br/>
                <br/>
                <label htmlFor="publishDate">Publication Date:</label>
                <input type="date" name="PDate" id="publishDate" className="inputBox"/>
                <br/>
                <br/>
                <label htmlFor="bookType">Book Type:</label>
                <select name="type" id="bookType">
                    <option value="" disabled selected hidden>Select book type</option>
                    <option value="Printed Book">Printed Book</option>
                    <option value="Ebook">Ebook</option>
                </select>
                <br/>

                <label htmlFor="pageNo" id="pageLabel">Hardcopy size(Pages):</label>
                <input type="number" name="pageNo" id="pageNo" className="inputBox"/>
                <br/>
                <br/>
                <label htmlFor="ebookSize" id="sizeLabel">Ebook Size(MB):</label>
                <input type="number" name="ebookSize" id="ebookSize" className="inputBox"/>
                <br/>
                <br/>
                <label htmlFor="genreInput">Genre:</label>
                <select name="genre" id="genreInput">
                    <option value="" disabled selected hidden>Select a genre</option>
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
                <input type="number" name="price" id="price" className="inputBox"/>
                <br/>
                <br/>
                <input type="submit" className="addToLibrary"/>
            </form>
            <button className="tableButton" onClick={() => setShowTable(!showTable)}>{showTable ? "Hide" : "Show"} table</button>
            {showTable && <LibraryTable />}
        </div>
    )
}

export default BookForm;