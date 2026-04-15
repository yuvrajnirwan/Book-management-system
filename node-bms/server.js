const express = require('express');
const cors = require('cors');
const pool = require('./db'); // 1. Import your database connection
const corsOptions = require('./config/corsOptions');
const app = express();
const port = 3000;

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.url}`);
    next();
});


app.get("/api/books", async (req, res) => {
    try {

        const allBooks = await pool.query("SELECT * FROM books");

        res.status(200).json(allBooks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const { bookName, author, isbn, publishDate, bookType, pageNo, ebookSize, genre, price, discount, age } = req.body;

        const newBook = await pool.query(
            `INSERT INTO books ("bookName", author, isbn, "publishDate", age,"bookType", "pageNo", "ebookSize", genre, price, discount) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [bookName, author, isbn, publishDate, age, bookType, pageNo, ebookSize, genre, price, discount]
        );

        res.status(201).json(newBook.rows[0]);
    } catch (err) {
        console.error("Database Insert Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { bookName, author, isbn, publishDate, bookType, pageNo, ebookSize, genre, price, discount, age } = req.body;

        const updateBook = await pool.query(
            `UPDATE books 
             SET "bookName" = $1, author = $2, isbn = $3, "publishDate" = $4, "bookType" = $5, "pageNo" = $6, "ebookSize" = $7, genre = $8, price = $9, discount = $10, age = $11 
             WHERE id = $12 RETURNING *`,
            [bookName, author, isbn, publishDate, bookType, pageNo, ebookSize, genre, price, discount, age, id]
        );

        if (updateBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(updateBook.rows[0]);
    } catch (err) {
        console.error("Database Update Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});


app.delete('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteBook = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);

        if (deleteBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});