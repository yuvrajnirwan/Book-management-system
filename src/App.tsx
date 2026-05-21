import { useState, useEffect } from 'react'
import BookForm from './bookForm'
import Register from './Register'
import Login from './Login'

interface User {
    id: string
    name: string
    email: string
}

function App() {
    // 1. Fixed: Check localStorage immediately during initialization so the page doesn't reset on refresh
    const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'books'>(() => {
        const savedToken = localStorage.getItem('token');
        return savedToken ? 'books' : 'login';
    });

    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        // 2. Hydrate/validate state on component mount if user info is present
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setCurrentPage('books');
            } catch (error) {
                console.error('Session restoration failed:', error);
                // eslint-disable-next-line react-hooks/immutability
                handleLogout(); // Safely wipe corrupted data
            }
        }

        // Clean session storage for development as requested
        sessionStorage.clear();
    }, [])

    const handleLoginSuccess = (_newToken: string, userInfo: User) => {
        setUser(userInfo)
        setCurrentPage('books')
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setCurrentPage('login')
    }

    return (
        <>
            {currentPage === 'login' && (
                <div>
                    <Login
                        onLoginSuccess={handleLoginSuccess}
                        onNavigateToRegister={() => setCurrentPage('register')}
                    />
                </div>
            )}

            {currentPage === 'register' && (
                <div>
                    <Register />
                    <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                        Already have an account?{' '}
                        <button
                            onClick={() => setCurrentPage('login')}
                            style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            )}

            {currentPage === 'books' && (
                <div>
                    <div style={{ padding: '10px', textAlign: 'right' }}>
                        <span style={{ marginRight: '20px' }}>Welcome, {user?.name || 'User'}!</span>
                        <button
                            onClick={handleLogout}
                            style={{ padding: '8px 16px', background: '#764ba2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </div>
                    <BookForm />
                </div>
            )}
        </>
    )
}

export default App