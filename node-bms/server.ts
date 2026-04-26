import express, { type Request, type Response } from 'express';
import cors from 'cors';
import sequelize from './src/config/database.js';
// @ts-ignore
import corsOptions from './config/corsOptions.js';
import { Book, User, Role } from './src/models/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.url}`);
    next();
});

// Books Routes
app.get("/api/books", async (_req: Request, res: Response) => {
    try {
        const allBooks = await Book.findAll();
        res.status(200).json(allBooks);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/books', async (req: Request, res: Response) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json(newBook);
    } catch (err: any) {
        console.error("Database Insert Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.put('/api/books/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [updatedRows, [updatedBook]] = await Book.update(req.body, {
            where: { id },
            returning: true,
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(updatedBook);
    } catch (err: any) {
        console.error("Database Update Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.delete('/api/books/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCount = await Book.destroy({ where: { id } });

        if (deletedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Database Sync and Server Start
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Database synced successfully');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('❌ Failed to sync database:', err);
    });
