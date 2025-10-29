import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import colors from '../../utils/colors';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //     setLoading(true);
    //     try {
    //         const response = await api.post('/auth/login/', { email, password });
    //         if (response.data?.token) {
    //             sessionStorage.setItem('authToken', response.data.token);
    //             navigate('/dashboard');
    //         } else {
    //             setError('Invalid credentials. Please try again.');
    //         }
    //     } catch (err) {
    //         setError(err.response?.data?.detail || 'Login failed. Please try again.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = () => {
        sessionStorage.setItem('authToken', "0000000")
        navigate('/dashboard')
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4"
            style={{ backgroundColor: colors.background }}
        >
            <div
                className="rounded-2xl shadow-2xl p-8 w-full max-w-md border"
                style={{ backgroundColor: colors.white, borderColor: colors.border }}
            >
                <div className="flex flex-col items-center mb-6">
                    <img src="/darklogo.png" alt="Claritel Logo" className="h-16 mb-2" />
                    <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to continue to Claritel Webphone</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                    />
                    <InputField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />

                    {error && (
                        <p className="text-sm text-center" style={{ color: colors.error }}>
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        label="Login"
                        loading={loading}
                        disabled={loading}
                    />
                </form>

                <div className="text-center text-sm mt-6" style={{ color: colors.textLight }}>
                    © {new Date().getFullYear()} Claritel AI. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default Auth;
