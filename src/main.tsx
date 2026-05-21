import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from './app/store'; // Ensure this path is correct
import App from './App.tsx'
import './css/App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* The Provider "injects" the store into your app */}
        <Provider store={store}>
            <GoogleOAuthProvider clientId="131708177915-ee678lb8n9hcefsfgtqc6rg8co9ev9bq.apps.googleusercontent.com">
                <App />
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
);