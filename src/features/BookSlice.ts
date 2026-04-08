import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Books } from '../types/Books';

interface BooksState {
    books: Books[];
}

const initialState: BooksState = {
    books: [],
};

export const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        // Adds a new book to the array
        addBook: (state, action: PayloadAction<Books>) => {
            state.books.push(action.payload);
        },
        // Finds a book by index and replaces it
        updateBook: (state, action: PayloadAction<{ index: number; book: Books }>) => {
            if (state.books[action.payload.index]) {
                state.books[action.payload.index] = action.payload.book;
            }
        },
        // Removes a book by its index
        deleteBook: (state, action: PayloadAction<number>) => {
            state.books = state.books.filter((_, i) => i !== action.payload);
        },
    },
});

// Export the actions so we can use them in the Form
export const { addBook, updateBook, deleteBook } = booksSlice.actions;

// Export the reducer for the store
export default booksSlice.reducer;