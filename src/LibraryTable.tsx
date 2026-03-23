

function LibraryTable(){
    return (<div className="libraryContainer">
        <h2>Library</h2>
        <hr/>
        <table className="libraryTable" id="libraryTable">
            <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN no.</th>
                <th>Publish date</th>
                <th>Age(years)</th>
                <th>Genre <select name="genre" id="genreSelect">
                    <option value="all" selected>All</option>
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
        </table>
        <button id="saveEdit">Save Changes</button>
    </div>);
}

export default LibraryTable;