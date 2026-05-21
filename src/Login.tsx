import { useState, type ChangeEvent, type FormEvent } from 'react';
// 1. Imported CredentialResponse to replace 'any'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import './css/Login.css';

interface User {
    id: string;
    name: string;
    email: string;
}

interface LoginProps {
    onLoginSuccess: (token: string, userInfo: User) => void;
    onNavigateToRegister: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToRegister }: LoginProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Login failed.');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setSuccess(true);
            setFormData({ email: '', password: '' });

            if (onLoginSuccess) {
                onLoginSuccess(data.token, data.user);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Fixed 'any' error by typing parameter as CredentialResponse
    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setError('');
        setLoading(true);

        try {
            // Ensure the credential payload string exists before hitting your backend API
            if (!credentialResponse.credential) {
                throw new Error('Google did not return a valid authentication token token.');
            }

            const response = await fetch('http://127.0.0.1:3000/users/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: credentialResponse.credential,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Google Single Sign-On failed.');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setSuccess(true);
            if (onLoginSuccess) {
                onLoginSuccess(data.token, data.user);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Google authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <p className="subtitle">Sign in to your account</p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">Login successful!</div>}

                {/* 3. Removed 'disabled' prop to satisfy TS2322 */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Authentication encountered an error.')}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: '#aaa', fontSize: '0.8rem', marginBottom: '20px' }}>
                    <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                    <span style={{ padding: '0 10px' }}>or securely sign in with email</span>
                    <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={onNavigateToRegister}
                        disabled={loading}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            textDecoration: 'underline',
                            fontWeight: '500',
                            padding: 0
                        }}
                    >
                        Sign up here
                    </button>
                </div>
            </div>
        </div>
    );
}