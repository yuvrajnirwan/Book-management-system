const form = document.querySelector(".bookSubmitForm");
const bookName = document.querySelector("#bookName");
const authorName = document.querySelector("#authorName");
const isbnNumber = document.querySelector("#isbnNumber");
const publishDate = document.querySelector("#publishDate");
const genre = document.querySelector("#genreInput");
const table = document.querySelector(".libraryTable");
const books = [];
const currDate=new Date();

function handleSubmit(event) {
    event.preventDefault();

    if (bookName.value === "" || authorName.value === "" || isbnNumber.value === "" || publishDate.value === "" || genre.value === "") {
        alert("Please fill all the fields");
        return;
    }

    const bookAge = currDate.getFullYear() - new Date(publishDate.value).getFullYear();
    const newBook = {
        id: books.length + 1,
        title: bookName.value,
        author: authorName.value,
        isbn: isbnNumber.value,
        publishDate: publishDate.value,
        age: bookAge,
        genre: genre.value
    };
    const newRow = document.createElement("tr");
    newRow.innerHTML =
        `<td>${newBook.id}</td>` +
        `<td>${newBook.title}</td>` +
        `<td>${newBook.author}</td>` +
        `<td>${newBook.isbn}</td>` +
        `<td>${newBook.publishDate}</td>` +
        `<td>${newBook.age}</td>` +
        `<td>${newBook.genre}</td>` +
        `<td class="edit"></td><td class="delete"></td>`;

    const rowEditBtn = document.createElement("button");
    rowEditBtn.textContent = "Edit";
    rowEditBtn.addEventListener("click", () => editBook(newBook.id));

    const rowDeleteBtn = document.createElement("button");
    rowDeleteBtn.textContent = "Delete";
    rowDeleteBtn.addEventListener("click", () => deleteBook(newBook.id));

    newRow.querySelector("td.edit").appendChild(rowEditBtn);
    newRow.querySelector("td.delete").appendChild(rowDeleteBtn);

    books.push(newBook);
    table.appendChild(newRow);

    console.log("Book Added:", newBook);
    console.log("All books:", books);

    alert("Book added successfully!");
    form.reset();
}

function editBook(id) {
     const rows = table.querySelectorAll("tr");
     for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].children[0];
        if (parseInt(cell.textContent, 10) === id) {
            rows[i].setAttribute("contenteditable", "true");
            rows[i].children[0].setAttribute("contenteditable","false");
            rows[i].children[5].setAttribute("contenteditable","false");
            break;
        }
    }
}

function deleteBook(id) {
    if (id == null) {
        if (books.length === 0) {
            alert("No books to delete!");
            return;
        }
        books.pop();
        const lastDataRow = table.querySelector("tr:last-child");
        if (lastDataRow) lastDataRow.remove();
        alert("Last book deleted successfully!");
        console.log("All books:", books);
        return;
    }

    const index = books.findIndex(b => b.id === id);
    if (index === -1) {
        alert("Book not found.");
        return;
    }
    books.splice(index, 1);
    const rows = table.querySelectorAll("tr");
    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].children[0];
        if (parseInt(cell.textContent, 10) === id) {
            rows[i].remove();
            break;
        }
    }
    alert("Book deleted successfully!");
    console.log("All books:", books);
}

form.addEventListener("submit", handleSubmit);
deleteBtn.addEventListener("click", () => deleteBook());
editBtn.addEventListener("click", () => editBook());