import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/BookSlice';

export const store = configureStore({
    reducer: {
        // 'library' is the key we will use in useSelector
        library: booksReducer,
    },
});

// These types help TypeScript understand your Redux state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;