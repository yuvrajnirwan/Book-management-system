import { useState, type ChangeEvent, type FormEvent } from 'react';
import './css/Register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. Type the input change event
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 2. Type the form submit event
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.email.split('@')[0],
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Registration failed.');
            }

            setSuccess(true);
            setFormData({ email: '', password: '', confirmPassword: '' });

            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (err) {
            // 3. Safely handle the 'unknown' error type
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create an Account</h2>
                <p className="subtitle">Sign up to manage your books</p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">Registration successful! Redirecting to login...</div>}

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
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}