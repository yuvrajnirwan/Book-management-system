const form = document.querySelector(".bookSubmitForm");
const bookName = document.querySelector("#bookName");
const authorName = document.querySelector("#authorName");
const isbnNumber = document.querySelector("#isbnNumber");
const publishDate = document.querySelector("#publishDate");
const genre = document.querySelector("#genreInput");
const deleteBtn = document.querySelector("#deleteBtn");
const editBtn = document.querySelector("#editBtn");
const table = document.querySelector(".libraryTable");
const books = [];
const currDate=new Date();
function handleSubmit(event) {
   
    event.preventDefault();

    if (bookName.value == "" || authorName.value == "" || isbnNumber.value == "" || publishDate.value == "" || genre.value == "") {
        alert("Please fill all the fields");
    } else {
          
        const bookAge= currDate.getFullYear()-new Date(publishDate.value).getFullYear();
        const newBook = {
            id: books.length + 1, 
            title: bookName.value,
            author: authorName.value,
            isbn: isbnNumber.value,
            publishDate: publishDate.value,
            age:bookAge,
            genre: genre.value
        };

        books.push(newBook);
        console.log("Book Added:", newBook);
        console.log("All books:", books);
         const newRow= document.createElement("tr");
         newRow.innerHTML=`<td>${newBook.id}</td><td>${newBook.title}</td><td>${newBook.author}</td><td>${newBook.isbn}</td><td>${newBook.publishDate}</td><td>${newBook.age}</td><td>${newBook.genre}</td>`;
table.appendChild(newRow);
 alert("Book added successfully!");
 form.reset();
    }
}

function editBook(){
    if (books.length === 0) {
        alert("No books to edit!");
    }
    else{
       const findId = prompt("Enter the book ID to edit Book title:");
        for(let i=0;i<books.length;i++){
            if(findId==books[i].id){
                alert("Book found! " + books[i].title);
                const newName=prompt("Enter the new name of the book:");
                books[i].title=newName;
                alert("Book name updated successfully!");
                
            }
        }
    }
}
function deleteBook(){
    if (books.length ==0) {
        alert("No books to delete!");
    }
    else{
    books.pop();
    alert("Last book deleted successfully!");
    console.log("All books:", books);
    }
}
form.addEventListener("submit", handleSubmit);
deleteBtn.addEventListener("click", deleteBook);
editBtn.addEventListener("click", editBook);