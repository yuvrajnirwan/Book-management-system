// DOM selectors
const form = document.querySelector(".bookSubmitForm");
const table = document.querySelector(".libraryTable");
const bookName = document.querySelector("#bookName");
const authorName = document.querySelector("#authorName");
const isbnNumber = document.querySelector("#isbnNumber");
const publishDate = document.querySelector("#publishDate");
const genre = document.querySelector("#genreInput");
const size = document.querySelector("#ebookSize");
const page = document.querySelector("#pageNo");
const price = document.querySelector("#price");
const discountInput = document.querySelector("#discount");
const saveEditBtn = document.querySelector("#saveEdit");

// =========================
// Parent Class
// =========================

class BaseBook {
    constructor(){
        this.books = [];
        this.table = table;
    }
    getCommonData(){
        return {
            title: bookName.value,
            author: authorName.value,
            isbn: isbnNumber.value,
            publishDate: publishDate.value,
            genre: genre.value,
            age: this.bookAge(publishDate.value),
            price: parseFloat(price.value) || 0,
            discount: 5
        };
    }

    bookAge(date){
        const currentYear = new Date().getFullYear();
        const pubYear = new Date(date).getFullYear();
        return currentYear - pubYear;
    }


    // =========================
    // API POST
    // =========================

    async sendToAPI(data){

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            }
        );

        const json = await response.json();
        return json;
    }

    // =========================
    // Render Table Row
    // =========================

    renderRow(data){

        const discountAmount = data.price * (data.discount / 100);
        const finalPrice = data.price - discountAmount;

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${data.id}</td>
        <td>${data.title}</td>
        <td>${data.author}</td>
        <td>${data.isbn}</td>
        <td>${data.publishDate}</td>
        <td>${data.age}</td>
        <td>${data.genre}</td>
        <td>${data.page || "N/A"}</td>
        <td>${data.size ? data.size + " MB" : "N/A"}</td>
        <td>${data.discount}%</td>
        <td>₹${finalPrice.toFixed(2)}</td>
        <td class="edit"></td>
        <td class="delete"></td>
        `;

        this.attachButtons(row,data.id);

        this.table.appendChild(row);
    }


    // =========================
    // Add Edit/Delete Buttons
    // =========================

    attachButtons(row,id){

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.onclick = () => this.editBook(id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = () => this.deleteBook(id);

        row.querySelector(".edit").appendChild(editBtn);
        row.querySelector(".delete").appendChild(deleteBtn);
    }


    // =========================
    // Edit Book
    // =========================

    editBook(id){
if(confirm("Want to edit this book?")){
        const rows = this.table.querySelectorAll("tr");

        rows.forEach(row=>{

            const idCell = row.children[0];

            if(idCell && parseInt(idCell.textContent) === id){

                const editable = [1,2,3,4,6,9];
                const locked = [0,5,7,8,10,11,12];

                editable.forEach(i=>{
                    if(row.children[i]){
                        row.children[i].contentEditable = "true";
                        row.children[i].style.background = "#fff9c4";
                    }
                });

                locked.forEach(i=>{
                    if(row.children[i]){
                        row.children[i].contentEditable = "false";
                    }
                });

            }

        });
    }
    }


    // =========================
    // Save Edited Data
    // =========================

    handleSaveEdit(){

if(confirm("Want to save new details?")){

const rows = this.table.querySelectorAll("tr");

rows.forEach(row=>{

if(row.children[1] && row.children[1].isContentEditable){

const id = parseInt(row.children[0].textContent);

const book = this.books.find(b => b.id === id);

if(!book) return;

const currDate = new Date();
const publishDateText = row.children[4].textContent;

const age = currDate.getFullYear() - new Date(publishDateText).getFullYear();
row.children[5].textContent = age;

const discountText = row.children[9].textContent;
const discount = parseFloat(discountText) || 0;

const basePrice = book.price;

const discountAmount = basePrice * (discount/100);
const finalPrice = basePrice - discountAmount;

row.children[9].textContent = discount + "%";
row.children[10].textContent = "₹" + finalPrice.toFixed(2);

book.discount = discount;
book.finalPrice = finalPrice;

}

});

alert("Changes Saved");

}
}


    // =========================
    // Delete Book
    // =========================

    deleteBook(id){

        if(!confirm("Delete this book?")) return;

        const rows = this.table.querySelectorAll("tr");

        rows.forEach(row=>{

            if(parseInt(row.children[0]?.textContent) === id){
                row.remove();
            }

        });

        this.books = this.books.filter(b => b.id !== id);

    }


    // =========================
    // Form Submit
    // =========================

    async handleSubmit(event){

        event.preventDefault();

        if(
            bookName.value === "" ||
            authorName.value === "" ||
            isbnNumber.value === "" ||
            publishDate.value === "" ||
            genre.value === "" ||
            price.value === ""
        ){
            alert("Please fill all required fields");
            return;
        }

        if(!confirm("Add book to library?")) return;

        const bookData = this.getCommonData();

        const apiData = await this.sendToAPI(bookData);

        apiData.id = this.books.length + 1;

        if(size.value){
            apiData.size = size.value;
        }

        if(page.value){
            apiData.page = page.value;
        }

        this.books.push(apiData);

        this.renderRow(apiData);

        alert("Book added to library");

        form.reset();

    }

}


// =========================
// Child Class: Ebook
// =========================

class EBook extends BaseBook{

    addBook(){

        const data = super.getCommonData();

        const ebook = {
            ...data,
            size:size.value,
            id:this.books.length + 1
        };

        this.books.push(ebook);

        this.renderRow(ebook);

    }

}


// =========================
// Child Class: PrintedBook
// =========================

class PrintedBook extends BaseBook{

    addBook(){

        const data = super.getCommonData();

        const printed = {
            ...data,
            page:page.value,
            id:this.books.length + 1
        };

        this.books.push(printed);

        this.renderRow(printed);

    }

}


// =========================
// Initialize Library
// =========================

const library = new BaseBook();

form.addEventListener("submit",(e)=>{

    library.handleSubmit(e);

});


saveEditBtn.addEventListener("click",()=>{

    library.handleSaveEdit();

});