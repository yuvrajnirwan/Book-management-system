const form = document.querySelector(".bookSubmitForm") as HTMLFormElement; 
const table = document.querySelector(".libraryTable") as HTMLTableElement;
const bookName = document.querySelector("#bookName") as HTMLInputElement;
const authorName = document.querySelector("#authorName") as HTMLInputElement;
const isbnNumber = document.querySelector("#isbnNumber") as HTMLInputElement;
const publishDate = document.querySelector("#publishDate") as HTMLInputElement;
const genreInput = document.querySelector("#genreInput") as HTMLSelectElement;
const genreSelect = document.querySelector("#genreSelect") as HTMLSelectElement; 
const size = document.querySelector("#ebookSize") as HTMLInputElement;
const page = document.querySelector("#pageNo") as HTMLInputElement;
const price = document.querySelector("#price") as HTMLInputElement;
const saveEditBtn = document.querySelector("#saveEdit") as HTMLButtonElement;
const bookType = document.querySelector("#bookType") as HTMLSelectElement;
const pageLabel = document.querySelector("#pageLabel") as HTMLLabelElement;
const sizeLabel = document.querySelector("#sizeLabel") as HTMLLabelElement;

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    publishDate: string;
    genre: string;
    age: number;
    price: number; 
    discount: number;
    size?: string;
    page?: string;
}


class BaseBook {
    books: Book[] = []; 
    constructor() {
        bookType.addEventListener("change", this.toggleVisibility);
        this.toggleVisibility();
    }

    public toggleVisibility = (): void => {
        const selectedType = bookType.value;
        const isPrinted = selectedType === 'Printed Book';
        const isEbook = selectedType === 'Ebook';

        page.style.display = isPrinted ? 'block' : 'none';
        pageLabel.style.display = isPrinted ? 'block' : 'none';
        size.style.display = isEbook ? 'block' : 'none';
        sizeLabel.style.display = isEbook ? 'block' : 'none';
    }

    calculateBookAge(date: string): number {
        const currentYear = new Date().getFullYear();
        const pubYear = new Date(date).getFullYear();
        return isNaN(pubYear) ? 0 : currentYear - pubYear;
    }

    renderRow(data: Book) {
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

    attachButtons(row: HTMLTableRowElement, id: number): void {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => this.editBook(id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => this.deleteBook(id);

        row.querySelector(".edit")?.appendChild(editBtn);
        row.querySelector(".delete")?.appendChild(deleteBtn);
    }

    editBook(id: number) {
        if (confirm("Want to edit this book?")) {
            const rows = table.querySelectorAll<HTMLTableRowElement>("tr");
            rows.forEach(row => {
                const idCell = row.children[0];
                if (idCell && parseInt(idCell.textContent || "0") === id) {
                    [1, 2, 3, 4, 9].forEach(i => {
                        const cell = row.children[i] as HTMLElement;
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
            const rows = table.querySelectorAll<HTMLTableRowElement>("tr");
            rows.forEach(row => {
                const cells = row.children;
                if ((cells[1] as HTMLElement).isContentEditable) {
                    const id = parseInt(cells[0]!.textContent || "0");
                    const book = this.books.find(b => b.id === id);

                    if (!book) return;

                    const newDate = cells[4]!.textContent || "";
                    book.publishDate = newDate;
                    book.age = this.calculateBookAge(newDate);
                    (cells[5] as HTMLElement).textContent = `${book.age}`;

                    const discountText = (cells[9]!.textContent || "0").replace("%", "");
                    const discount = parseFloat(discountText) || 0;
                    const finalPrice = book.price - (book.price * (discount / 100));

                    (cells[9] as HTMLElement).textContent = discount + "%";
                    (cells[10] as HTMLElement).textContent = "₹" + finalPrice.toFixed(2);

                    book.discount = discount;
                    book.title = cells[1]!.textContent || "";
                    book.author = cells[2]!.textContent || "";

                    [1, 2, 3, 4, 9].forEach(i => {
                        const cell = cells[i] as HTMLElement;
                        cell.contentEditable = "false";
                    });
                }
            });
            alert("Changes Saved");
        }
    }

    filterBooks(): void {
        const filteredValue = genreSelect.value.toLowerCase();
        const rows = table.querySelectorAll<HTMLTableRowElement>("tr");
        rows.forEach((row, index) => {
            if (index === 0) return;
            const genreCell = row.children[6] as HTMLElement;
            if (genreCell) {
                const genreText = (genreCell.textContent || "").toLowerCase().trim();
                row.style.display = (filteredValue === "all" || genreText === filteredValue) ? "" : "none";
            }
        });
    }

    deleteBook(id: number) {
        if (!confirm("Delete this book?")) return;
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            if (parseInt(row.children[0]?.textContent || "0") === id) row.remove();
        });
        this.books = this.books.filter(b => b.id !== id);
    }
}

class EBook extends BaseBook {
    createBookObject(): Book {
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
    createBookObject(): Book {
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
    
    let newBook: Book;
    if (bookType.value === "Ebook") {
        newBook = ebookCreator.createBookObject();
    } else {
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