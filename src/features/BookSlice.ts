import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Books } from "../types/Books"; 


interface LibraryState {
    books: Books[];
}

const initialState: LibraryState = {
    books: [],
};

const bookSlice = createSlice({
    name: "library",
    initialState,
    reducers: {
      
        setAllBooks: (state, action: PayloadAction<Books[]>) => {
            state.books = action.payload;
        },

        
        addBook: (state, action: PayloadAction<Books>) => {
            state.books.push(action.payload);
        },

        updateBook: (state, action: PayloadAction<Books>) => {
            const index = state.books.findIndex(book => book.id === action.payload.id);
            if (index !== -1) {
                state.books[index] = action.payload;
            }
        },

        deleteBook: (state, action: PayloadAction<number>) => {
            state.books = state.books.filter(book => book.id !== action.payload);
        },
    },
});
export const { setAllBooks, addBook, updateBook, deleteBook, } = bookSlice.actions;

export default bookSlice.reducer;