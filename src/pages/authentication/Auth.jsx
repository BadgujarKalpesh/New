// src/pages/authentication/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import colors from '../../utils/colors';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    
    const [show2FA, setShow2FA] = useState(false);
    const [tempToken, setTempToken] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errorMessage || 'Login failed');
            }

            if (data.data.mfaRequired) {
                setTempToken(data.data.tempToken);
                setShow2FA(true);
            } else {
                // Use the login function from AuthContext
                login(data.data.user, data.data.accessToken);

                if (!data.data.user.mfaEnabled) {
                    navigate('/setup-2fa');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerify2FA = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/2fa/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tempToken}`,
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errorMessage || '2FA verification failed');
            }

            // Use the login function from AuthContext
            login(data.data.user, data.data.accessToken);
            navigate('/dashboard');

        } catch (err) {
            setError(err.message);
        }
    };

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
                    <p className="text-gray-500 text-sm mt-1">{show2FA ? 'Verify 2FA' : 'Admin Login'}</p>
                </div>
                

                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}

                {!show2FA ? (
                    <form onSubmit={handleLogin} className="space-y-5" >
                        <div>
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <InputField
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <InputField
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            label="Login"
                        />
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleVerify2FA}>
                        <p className="text-sm text-center text-gray-600">
                            Enter the 6-digit code from your authenticator app.
                        </p>
                        <div>
                            <label 
                                htmlFor="token" 
                                className="block text-sm font-medium text-gray-700"
                            >
                                2FA Token
                            </label>
                            <input
                                id="token"
                                name="token"
                                type="text"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full px-3 py-2 mt-1 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                maxLength="6"
                            />
                        </div>
                        <Button
                            type="submit"
                            label="Verify"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        />
                    </form>
                )}
            <div className="text-center text-sm mt-6" style={{ color: colors.textLight }}>
                    © {new Date().getFullYear()} Claritel AI. All rights reserved.
            </div>
            </div>
        </div>
    );
}

export default Auth;