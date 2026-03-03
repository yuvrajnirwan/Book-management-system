const form = document.querySelector(".bookSubmitForm");
const bookName = document.querySelector("#bookName");
const authorName = document.querySelector("#authorName");
const isbnNumber = document.querySelector("#isbnNumber");
const publishDate = document.querySelector("#publishDate");
const genre = document.querySelector("#genreInput");
const table = document.querySelector(".libraryTable");
const saveEdit = document.querySelector("#saveEdit");
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

    const fetchPromise = () => {
        return new Promise((resolve, reject) => {
            fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Yuvraj Chauhan',
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => {
        console.log("API Response:", json);
        const apiTitle = json.title;
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                books.push(newBook);
                table.appendChild(newRow);
                console.log("Book Added:", newBook);
                console.log("All books:", books);
                form.reset();
                filterBooks();
                resolve("Book saved");
                
                alert("Book saved successfully!");
            }, 3000);
            alert("Hey!! "+apiTitle+" your book is being saved, please wait for 3 seconds...");
        });
    })
    .then((result) => {
        resolve(result);
    })
    .catch((error) => {
        reject(error);
    });
        });
    };

    fetchPromise();
}

function editBook(id) {
     const rows = table.querySelectorAll("tr");
     for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].children[0];
        if (parseInt(cell.textContent, 10) === id) {
            rows[i].setAttribute("contenteditable", "true");
            rows[i].children[0].setAttribute("contenteditable","false");
            rows[i].children[5].setAttribute("contenteditable","false");
             rows[i].children[7].setAttribute("contenteditable","false");
            rows[i].children[8].setAttribute("contenteditable","false");
            break;
        }
    }
}

function deleteBook(id) {
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
    filterBooks();
}

function handleSaveEdit(){
    const rows = table.querySelectorAll("tr");
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].getAttribute("contenteditable") === "true") {
            const id = parseInt(rows[i].children[0].textContent, 10);
            const title = rows[i].children[1].textContent;
            const author = rows[i].children[2].textContent;
            const isbn = rows[i].children[3].textContent;
            const publishDateText = rows[i].children[4].textContent;
            const age = currDate.getFullYear() - new Date(publishDateText).getFullYear();
            const genreText = rows[i].children[6].textContent;

            rows[i].children[5].textContent = age;

            const updatedBook = { id, title, author, isbn, publishDate: publishDateText, age, genre: genreText };
            alert("Details updated successfully!");
            console.log("Updated Book:", updatedBook);

            const index = books.findIndex(book => book.id === id);
            if (index !== -1) {
                books[index] = updatedBook;
                console.log("All books:", books);
            }

            rows[i].setAttribute("contenteditable", "false");
        }
    }
}
function filterBooks(){
    const rows = table.querySelectorAll("tr");
    const filtered = document.querySelector("#genreSelect").value.toLowerCase();
    for(let i = 1; i < rows.length; i++){
        const genreCell = rows[i].children[6].textContent.toLowerCase();
        if(filtered === "all" || genreCell === filtered){
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

form.addEventListener("submit", handleSubmit);
saveEdit.addEventListener("click", () => handleSaveEdit());

const genreSelect = document.querySelector("#genreSelect");
if (genreSelect) {
    genreSelect.addEventListener("change", filterBooks);
}
filterBooks();