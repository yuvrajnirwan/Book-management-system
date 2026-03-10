//DOM selector
const form = document.querySelector(".bookSubmitForm");
const bookName = document.querySelector("#bookName");
const authorName = document.querySelector("#authorName");
const isbnNumber = document.querySelector("#isbnNumber");
const publishDate = document.querySelector("#publishDate");
const genreInput = document.querySelector("#genreInput");
const pageNo = document.querySelector("#pageNo");
const ebookSize = document.querySelector("#ebookSize");
const price = document.querySelector("#price");
const table = document.querySelector(".libraryTable");
const saveEdit = document.querySelector("#saveEdit");

// The Base Class
class BaseBook {
    constructor() {
        this.books = [];
    }

    // method to calculate age
    calculateAge(dateString) {
        const currentYear = new Date().getFullYear();
        const pubYear = new Date(dateString).getFullYear();
        return currentYear - pubYear;
    }

    //adding table row
    renderRow(data) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${data.id}</td>
            <td>${data.title}</td>
            <td>${data.author}</td>
            <td>${data.isbn}</td>
            <td>${data.publishDate}</td>
            <td>${data.age}</td>
            <td>${data.genre}</td>
            <td>${data.pageNo || "N/A"}</td>
            <td>${data.ebookSize ? data.ebookSize + " MB" : "N/A"}</td>
            <td>${data.discount || "0%"}</td>
            <td>₹${data.price}</td>
            <td class="edit"></td>
            <td class="delete"></td>
        `;

        this.attachActions(newRow, data.id);
        table.appendChild(newRow);
    }

    attachActions(row, id) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => alert("Edit ID: " + id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => row.remove();

        row.querySelector(".edit").appendChild(editBtn);
        row.querySelector(".delete").appendChild(deleteBtn);
    }
}

// 3. Child Class: PrintedCopy
class PrintedCopy extends BaseBook {
    getPages() {
        return pageNo.value || 0;
    }
}

// 4. Child Class: Ebook
class Ebook extends BaseBook {
    getSize() {
        return ebookSize.value || 0;
    }
}


const printedHandler = new PrintedCopy();
const ebookHandler = new Ebook();

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    
    const commonData = {
        title: bookName.value,
        author: authorName.value,
        isbn: isbnNumber.value,
        publishDate: publishDate.value,
        age: printedHandler.calculateAge(publishDate.value),
        genre: genreInput.value,
        price: price.value
    };

    const finalBookData = {
        ...commonData,
        pageNo: printedHandler.getPages(),
        ebookSize: ebookHandler.getSize()
    };

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(finalBookData),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        
        const json = await response.json();
        
        json.id = printedHandler.books.length + 1;

        printedHandler.books.push(json);
        printedHandler.renderRow(json);
        form.reset();
        
    } catch (err) {
        console.error("API Error:", err);
    }
});