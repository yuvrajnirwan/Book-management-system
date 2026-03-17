const form = document.querySelector(".bookSubmitForm");
const table = document.querySelector(".libraryTable");
const bookName = document.querySelector("#bookName");
const authorName = document.querySelector("#authorName");
const isbnNumber = document.querySelector("#isbnNumber");
const publishDate = document.querySelector("#publishDate");
const genreInput = document.querySelector("#genreInput");
const genreSelect = document.querySelector("#genreSelect");
const size = document.querySelector("#ebookSize");
const page = document.querySelector("#pageNo");
const price = document.querySelector("#price");
const saveEditBtn = document.querySelector("#saveEdit");
const bookType = document.querySelector("#bookType");
const pageLabel = document.querySelector("#pageLabel");
const sizeLabel = document.querySelector("#sizeLabel");
class BaseBook {
    constructor() {
        this.books = [];
        this.toggleVisibility = () => {
            const selectedType = bookType.value;
            const isPrinted = selectedType === 'Printed Book';
            const isEbook = selectedType === 'Ebook';
            page.style.display = isPrinted ? 'block' : 'none';
            pageLabel.style.display = isPrinted ? 'block' : 'none';
            size.style.display = isEbook ? 'block' : 'none';
            sizeLabel.style.display = isEbook ? 'block' : 'none';
        };
        bookType.addEventListener("change", this.toggleVisibility);
        this.toggleVisibility();
    }
    calculateBookAge(date) {
        const currentYear = new Date().getFullYear();
        const pubYear = new Date(date).getFullYear();
        return isNaN(pubYear) ? 0 : currentYear - pubYear;
    }
    renderRow(data) {
        const finalPrice = data.price - (data.price * (data.discount / 100));
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
        this.attachButtons(row, data.id);
        table.appendChild(row);
    }
    attachButtons(row, id) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => this.editBook(id);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => this.deleteBook(id);
        row.querySelector(".edit")?.appendChild(editBtn);
        row.querySelector(".delete")?.appendChild(deleteBtn);
    }
    editBook(id) {
        if (confirm("Want to edit this book?")) {
            const rows = table.querySelectorAll("tr");
            rows.forEach(row => {
                const idCell = row.children[0];
                if (idCell && parseInt(idCell.textContent || "0") === id) {
                    [1, 2, 3, 4, 9].forEach(i => {
                        const cell = row.children[i];
                        if (cell) {
                            cell.contentEditable = "true";
                            cell.style.background = "#fff9c4";
                        }
                    });
                }
            });
        }
    }
    handleSaveEdit() {
        if (confirm("Want to save new details?")) {
            const rows = table.querySelectorAll("tr");
            rows.forEach(row => {
                const cells = row.children;
                if (cells[1].isContentEditable) {
                    const id = parseInt(cells[0].textContent || "0");
                    const book = this.books.find(b => b.id === id);
                    if (!book)
                        return;
                    const newDate = cells[4].textContent || "";
                    book.publishDate = newDate;
                    book.age = this.calculateBookAge(newDate);
                    cells[5].textContent = `${book.age}`;
                    const discountText = (cells[9].textContent || "0").replace("%", "");
                    const discount = parseFloat(discountText) || 0;
                    const finalPrice = book.price - (book.price * (discount / 100));
                    cells[9].textContent = discount + "%";
                    cells[10].textContent = "₹" + finalPrice.toFixed(2);
                    book.discount = discount;
                    book.title = cells[1].textContent || "";
                    book.author = cells[2].textContent || "";
                    [1, 2, 3, 4, 9].forEach(i => {
                        const cell = cells[i];
                        cell.contentEditable = "false";
                    });
                }
            });
            alert("Changes Saved");
        }
    }
    filterBooks() {
        const filteredValue = genreSelect.value.toLowerCase();
        const rows = table.querySelectorAll("tr");
        rows.forEach((row, index) => {
            if (index === 0)
                return;
            const genreCell = row.children[6];
            if (genreCell) {
                const genreText = (genreCell.textContent || "").toLowerCase().trim();
                row.style.display = (filteredValue === "all" || genreText === filteredValue) ? "" : "none";
            }
        });
    }
    deleteBook(id) {
        if (!confirm("Delete this book?"))
            return;
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            if (parseInt(row.children[0]?.textContent || "0") === id)
                row.remove();
        });
        this.books = this.books.filter(b => b.id !== id);
    }
}
class EBook extends BaseBook {
    createBookObject() {
        return {
            id: 0,
            title: bookName.value,
            author: authorName.value,
            isbn: isbnNumber.value,
            publishDate: publishDate.value,
            genre: genreInput.value,
            age: this.calculateBookAge(publishDate.value),
            price: parseFloat(price.value) || 0,
            discount: 10,
            size: size.value
        };
    }
}
class PrintedBook extends BaseBook {
    createBookObject() {
        return {
            id: 0,
            title: bookName.value,
            author: authorName.value,
            isbn: isbnNumber.value,
            publishDate: publishDate.value,
            genre: genreInput.value,
            age: this.calculateBookAge(publishDate.value),
            price: parseFloat(price.value) || 0,
            discount: 5,
            page: page.value
        };
    }
}
const library = new BaseBook();
const ebookCreator = new EBook();
const printedCreator = new PrintedBook();
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let newBook;
    if (bookType.value === "Ebook") {
        newBook = ebookCreator.createBookObject();
    }
    else {
        newBook = printedCreator.createBookObject();
    }
    newBook.id = library.books.length + 1;
    library.books.push(newBook);
    library.renderRow(newBook);
    form.reset();
    library.toggleVisibility();
    alert("Book added successfully!");
});
saveEditBtn.addEventListener("click", () => {
    library.handleSaveEdit();
});
genreSelect.addEventListener("change", () => {
    library.filterBooks();
});
export {};
//# sourceMappingURL=script.js.map