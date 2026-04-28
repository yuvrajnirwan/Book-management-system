import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store'; // Ensure this path is correct
import BookForm from "./bookForm.tsx";
import './css/App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* The Provider "injects" the store into your app */}
        <Provider store={store}>
            <BookForm />
        </Provider>
    </React.StrictMode>
);