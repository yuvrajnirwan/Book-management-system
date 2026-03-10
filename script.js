const form = document.querySelector(".bookSubmitForm");
const bookName = document.querySelector("#bookName");
const authorName = document.querySelector("#authorName");
const isbnNumber = document.querySelector("#isbnNumber");
const publishDate = document.querySelector("#publishDate");
const genre = document.querySelector("#genreInput");
const table = document.querySelector(".libraryTable");
const saveEdit = document.querySelector("#saveEdit");
const size=document.querySelector("#ebookSize");
const page=document.querySelector("#pageNo")
const price=document.querySelector("#price")
const books = [];


class Library {
   constructor(){
    this.books=[];
    this.table=document.querySelector(".libraryTable");
    this.form=document.querySelector(".bookSubmitForm");
   }

   bookAge(publishDate){
    const currentYear = new Date().getFullYear();
        const pubYear = new Date(publishDate).getFullYear();
        return currentYear-pubYear;
   }
   async handleSubmit(event){
    event.preventDefault();
    if (bookName.value === "" || authorName.value === "" || isbnNumber.value === "" || publishDate.value === "" || genre.value === "" || size==="" || page==="")  {
        alert("Please fill all the fields");
        return;
    }
 
    try{
    const response= await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
     id: this.books.length + 1,
        title: bookName.value,
        author: authorName.value,
        isbn: isbnNumber.value,
        publishDate: publishDate.value,
        age: this.bookAge(publishDate.value),
        genre: genre.value,
        price:price.value,
        size:size.value,
        page:page.value,
        discount:5
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
});
  
const json=await response.json();
console.log("API response: ",json);
const discountAmount = price.value * (json.discount / 100);
const finalPrice = price.value - discountAmount;
                const newRow = document.createElement("tr");
                    newRow.innerHTML =
                        `<td>${json.id}</td>` +
                        `<td>${json.title}</td>` +
                        `<td>${json.author}</td>` +
                        `<td>${json.isbn}</td>` +
                        `<td>${json.publishDate}</td>` +
                        `<td>${json.age}</td>` +
                        `<td>${json.genre}</td>` +
                        `<td>${json.page}</td>` +
                        `<td>${json.size}</td>` +
                        `<td>${json.discount}%</td>` +
                        `<td>₹${finalPrice}</td>` +
                        `<td class="edit"></td><td class="delete"></td>`;
  
  const confirmed=confirm("Do you want to save this book?");
  if(confirmed){
                    setTimeout(()=>{
                    const rowEditBtn = document.createElement("button");
                    rowEditBtn.textContent = "Edit";
                    rowEditBtn.addEventListener("click", () => this.editBook(json.id));

                    const rowDeleteBtn = document.createElement("button");
                    rowDeleteBtn.textContent = "Delete";
                    rowDeleteBtn.addEventListener("click", () => this.deleteBook(json.id));

                    newRow.querySelector("td.edit").appendChild(rowEditBtn);
                    newRow.querySelector("td.delete").appendChild(rowDeleteBtn);

                    this.books.push(json);
                    this.table.appendChild(newRow);
                    console.log("Book Added:", json);
                    console.log("All books:", books);
                    this.form.reset();
                    if (typeof this.filterBooks === "function") {
                    this.filterBooks();
                }
                    
                    alert("Book saved successfully!");
                    }, 2000);
    }
    } catch(error){
        console.error("Error:", error);
        alert("Error saving book. Please try again.")
    }
   }

   editBook(id) {
       alert("Press Save changes button after editing details")
       const rows = this.table.querySelectorAll("tr");
       for (let i = 1; i < rows.length; i++) {
           const cell = rows[i].children[0];
           if (parseInt(cell.textContent, 10) === id) {
               rows[i].setAttribute("contenteditable", "true");
               rows[i].children[0].setAttribute("contenteditable","false");
               rows[i].children[5].setAttribute("contenteditable","false");
                rows[i].children[6].setAttribute("contenteditable","false");
               rows[i].children[7].setAttribute("contenteditable","false");
               rows[i].children[8].setAttribute("contenteditable","false");
                rows[i].children[10].setAttribute("contenteditable","false");
                rows[i].children[11].setAttribute("contenteditable","false");
                rows[i].children[12].setAttribute("contenteditable","false");
               break;
           }
       }
   }

   deleteBook(id) {
    const deleteConfirmed = confirm("Are you sure you want to delete this book?");
    if(deleteConfirmed){
       const index = this.books.findIndex(b => b.id === id);
       if (index === -1) {
           alert("Book not found.");
           return;
       }
       this.books.splice(index, 1);
       const rows = this.table.querySelectorAll("tr");
       for (let i = 1; i < rows.length; i++) {
           const cell = rows[i].children[0];
           if (parseInt(cell.textContent, 10) === id) {
               rows[i].remove();
               break;
           }
       }
       alert("Book deleted successfully!");
       console.log("All books:", this.books);
       this.filterBooks();
   }}

 handleSaveEdit() {
    const saveConfirmed = confirm("Are you sure you want to save the changes?");
    if (!saveConfirmed) return;

    const currDate = new Date();
    const rows = this.table.querySelectorAll("tr");

    for (let i = 1; i < rows.length; i++) {
        if (rows[i].getAttribute("contenteditable") === "true") {
            const rawDiscount = rows[i].children[9].textContent; 
            const rawPrice = rows[i].children[10].textContent;
            const discountValue = parseFloat(rawDiscount.replace(/[^\d.]/g, '')) || 0;
            const basePrice = parseFloat(rawPrice.replace(/[^\d.]/g, '')) || 0;
            const newDiscAmount = basePrice * (discountValue / 100);
            const newFinalPrice = basePrice - newDiscAmount;
            const publishDateText = rows[i].children[4].textContent;
            const age = currDate.getFullYear() - new Date(publishDateText).getFullYear();
            
            rows[i].children[5].textContent = age;
            rows[i].children[9].textContent = `${discountValue}%`;
            rows[i].children[10].textContent = `₹${newFinalPrice.toFixed(2)}`;

           
            const id = parseInt(rows[i].children[0].textContent, 10);
            const index = this.books.findIndex(book => book.id === id);
            if (index !== -1) {
                this.books[index].title = rows[i].children[1].textContent;
                this.books[index].author = rows[i].children[2].textContent;
                this.books[index].discount = discountValue;
                this.books[index].finalPrice = newFinalPrice;
            }

            rows[i].setAttribute("contenteditable", "false");
            alert("Details updated successfully!");
        }
    }
}

   filterBooks() {
       const rows = this.table.querySelectorAll("tr");
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
}

const library = new Library();
form.addEventListener("submit", (event) => library.handleSubmit(event));
saveEdit.addEventListener("click", () => library.handleSaveEdit());

const genreSelect = document.querySelector("#genreSelect");
if (genreSelect) {
    genreSelect.addEventListener("change", () => library.filterBooks());
}