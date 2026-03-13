// DOM Selectors with correct types
const form = document.querySelector(".bookSubmitForm") as HTMLFormElement; // Changed to Form
const table = document.querySelector(".libraryTable") as HTMLTableElement;
const bookName = document.querySelector("#bookName") as HTMLInputElement;
const authorName = document.querySelector("#authorName") as HTMLInputElement;
const isbnNumber = document.querySelector("#isbnNumber") as HTMLInputElement;
const publishDate = document.querySelector("#publishDate") as HTMLInputElement;
const genre = document.querySelector("#genreInput") as HTMLInputElement;
const size = document.querySelector("#ebookSize") as HTMLInputElement;
const page = document.querySelector("#pageNo") as HTMLInputElement;
const price = document.querySelector("#price") as HTMLInputElement;
const saveEditBtn = document.querySelector("#saveEdit") as HTMLButtonElement;

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
    finalPrice?: number;
}

class BaseBook {
    books: Book[] = [];
    public table = table;

    calculateBookAge(date: string): number {
        const currYear = new Date().getFullYear();
        const publishYear = new Date(date).getFullYear(); // Fixed: Use the 'date' parameter
        return currYear - publishYear;
    }

    async sendToApi(data: Book): Promise<Book> {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await response.json() as Book;
    }

    renderRow(data: Book) {
        const discountAmount = data.price * (data.discount / 100);
        const finalPrice = data.price - discountAmount;
        const row: HTMLTableRowElement = document.createElement("tr");

        // Fixed: Removed double $$ and ensured .toFixed() safety
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
        this.table.appendChild(row);
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

    deleteBook(id: number) {
        if (confirm("Want to delete this book?")) {
            const rows = this.table.querySelectorAll<HTMLTableRowElement>("tr");
            rows.forEach((row) => {
                const firstCell = row.children[0];
                if (firstCell && parseInt(firstCell.textContent || "0") === id) {
                    row.remove();
                }
            });
            this.books = this.books.filter(b => b.id !== id);
        }
    }

    editBook(id: number) {
        if (confirm("Want to edit this book?")) {
            const rows = this.table.querySelectorAll<HTMLTableRowElement>("tr");
            rows.forEach((row) => {
                const idCell = row.children[0];
                if (idCell && parseInt(idCell.textContent || "0") === id) {
                    const editableIndices = [1, 2, 3, 4, 9];
                    editableIndices.forEach(i => {
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
            const rows = this.table.querySelectorAll<HTMLTableRowElement>("tr");
            rows.forEach((row) => {
                const titleCell = row.children[1] as HTMLElement;
                if (titleCell && titleCell.isContentEditable) {
                    const id = parseInt(row.children[0]!.textContent || "0");
                    const book = this.books.find(b => b.id === id);
                    if (!book) return;

                    const publishDateText = row.children[4]!.textContent || "";
                    const age = this.calculateBookAge(publishDateText);
                    row.children[5]!.textContent = `${age}`;

                    const discount = parseFloat(row.children[9]!.textContent || "0");
                    const finalPrice = book.price - (book.price * (discount / 100));

                    row.children[9]!.textContent = discount + "%";
                    row.children[10]!.textContent = "₹" + finalPrice.toFixed(2);

                    book.discount = discount;
                }
            });
            alert("Changes Saved");
        }
    }

    async handleSubmit(event: SubmitEvent): Promise<void> {
        event.preventDefault();

        if (!bookName.value || !authorName.value || !isbnNumber.value || !price.value) {
            alert("Please fill all required fields");
            return;
        }

        if (!confirm("Add book to library?")) return;

        const bookData: Book = {
            id: this.books.length + 1,
            title: bookName.value,
            author: authorName.value,
            isbn: isbnNumber.value,
            publishDate: publishDate.value,
            genre: genre.value,
            age: this.calculateBookAge(publishDate.value),
            price: parseFloat(price.value) || 0,
            discount: 5
        };

        const apiData = await this.sendToApi(bookData);
        apiData.id = this.books.length + 1; // Sync ID after API "success"

        if (size.value) apiData.size = size.value;
        if (page.value) apiData.page = page.value;

        this.books.push(apiData);
        this.renderRow(apiData);
        form.reset();
        alert("Book added to library");
    }
}

// Child Classes
class EBook extends BaseBook {
    addBook(): void {
        const data: Book = {
            id: this.books.length + 1,
            title: bookName.value,
            author: authorName.value,
            isbn: isbnNumber.value,
            publishDate: publishDate.value,
            genre: genre.value,
            age: this.calculateBookAge(publishDate.value),
            price: parseFloat(price.value) || 0,
            discount: 10,
            size: size.value
        };
        this.books.push(data);
        this.renderRow(data);
        alert("E-Book added locally!");
    }
}

class PrintedBook extends BaseBook {
    addBook(): void {
        const data: Book = {
            id: this.books.length + 1,
            title: bookName.value,
            author: authorName.value,
            isbn: isbnNumber.value,
            publishDate: publishDate.value,
            genre: genre.value,
            age: this.calculateBookAge(publishDate.value),
            price: parseFloat(price.value) || 0,
            discount: 5,
            page: page.value
        };
        this.books.push(data);
        this.renderRow(data);
        alert("Printed Book added locally!");
    }
}

// Global Initialization
const library = new BaseBook();
const ebookHandler = new EBook();
const printedHandler = new PrintedBook();

form.addEventListener("submit", (e: SubmitEvent) => {
    // Decision logic for which class to use
    if (size.value !== "") {
        e.preventDefault();
        ebookHandler.addBook();
        form.reset();
    } else if (page.value !== "") {
        e.preventDefault();
        printedHandler.addBook();
        form.reset();
    } else {
        library.handleSubmit(e);
    }
});

saveEditBtn.addEventListener("click", () => {
    library.handleSaveEdit();
});