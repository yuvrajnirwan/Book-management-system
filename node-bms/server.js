import req from "express/lib/request";

const express =require('express');
const app=express();
const port=3000;
import Books from "src/types/Books.js"

app.use(express.json());

const {bookName, author, isbn, publishDate, age, pageNo, ebookSize, genre, price, discount, bookType}=req.body;
const newBook = {
    id: Books.length + 1,
    bookName,
    author,
    isbn,
    publishDate,
    bookType,
    genre,
    price,
    discount,
    age: new Date().getFullYear() - new Date(publishDate).getFullYear(),
    pageNo,
    ebookSize

};

app.get("/",(req,res)=>{
    res.send("Backend BMS");
});

app.get("/books",(req,res)=>{
res.status(200).json(books)
});



app.post('/api/books', (req, res) => {
    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        ...req.body
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
    Books = Books.filter(b => b.id !== id);

    if (books.length < initialLength) {
        res.status(200).json({ message: "Book deleted successfully" });
    } else {
        res.status(404).json({ message: "Cannot delete: Book not found" });
    }
});


app.use((err, req, res, next) => {
    console.error(`[ERROR]: ${err.message}`);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.url}`);
    next();
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});