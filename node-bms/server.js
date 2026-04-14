const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.url}`);
    next();
});


let books = [
    // {
    //     id: 1,
    //     bookName: "The Great Gatsby",
    //     author: "F. Scott Fitzgerald",
    //     publishDate: "1925-04-10",
    //     price: 10.99
    // },
    // {
    //     id: 2,
    //     bookName: "The Jungle Book",
    //     author: "J.K. Rowling",
    //     publishDate: "1980-04-10",
    //     price: 20.99
    // }
];


app.get("/", (req, res) => {
    res.send("Backend BMS");
});


app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});


app.post('/api/books', (req, res) => {
    const { id, ...bookData } = req.body;
    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        ...bookData
    };
    books.push(newBook);
    res.status(201).json(newBook);
});


app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index !== -1) {
        books[index] = { ...books[index], ...req.body, id };
        res.status(200).json(books[index]);
    } else {
        res.status(404).json({ message: "Cannot update: Book not found" });
    }
});


app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = books.length;
    books = books.filter(b => b.id !== id);

    if (books.length < initialLength) {
        res.status(200).json({ message: "Book deleted successfully" });
    } else {
        res.status(404).json({ message: "Cannot delete: Book not found" });
    }
});


app.use((err, req, res, _next) => {
    console.error(`[ERROR]: ${err.message}`);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
});

// --- START SERVER ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});