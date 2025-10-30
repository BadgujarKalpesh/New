// src/pages/authentication/TwoFactorSetup.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import colors from '../../utils/colors';
import Button from '../../components/Button';

function TwoFactorSetup() {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const accessToken = sessionStorage.getItem('accessToken');

    useEffect(() => {
        generateQRCode();
    }, []);

    const generateQRCode = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/2fa/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errorMessage || 'Failed to generate QR code');
            }

            setQrCodeUrl(data.data.qrCodeUrl);
            setSecret(data.data.secret);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifySetup = async (e) => {
        e.preventDefault();
        setError('');
        setVerifying(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/2fa/verify-setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errorMessage || '2FA verification failed');
            }

            // Update user object to reflect MFA is now enabled
            const user = JSON.parse(sessionStorage.getItem('user'));
            user.mfaEnabled = true;
            updateUser(user);

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4"
            style={{ backgroundColor: colors.background }}
        >
            <div
                className="rounded-2xl shadow-2xl p-12 w-full max-w-md border h-170"
                style={{ backgroundColor: colors.white, borderColor: colors.border }}
            >
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Setup Two-Factor Authentication</h1>
                </div>

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Generating QR code...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Step 1: Scan QR Code</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code:
                            </p>
                            <div className="flex justify-center mb-3 bg-white p-3 rounded-lg border border-gray-200">
                                {qrCodeUrl && (
                                    <img 
                                        src={qrCodeUrl} 
                                        alt="2FA QR Code" 
                                        className="w-38 h-38"
                                    />
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleVerifySetup} className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Step 2: Verify Setup</h3>
                                <p className="text-xs text-gray-500 mb-3">
                                    Enter the 6-digit code from your authenticator app:
                                </p>
                                <label 
                                    htmlFor="token" 
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Verification Code
                                </label>
                                <input
                                    id="token"
                                    name="token"
                                    type="text"
                                    required
                                    value={token}
                                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-3 py-2 text-center text-lg tracking-wider border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    maxLength="6"
                                    placeholder="000000"
                                />
                            </div>
                            <Button
                                type="submit"
                                label={verifying ? 'Verifying...' : 'Complete Setup'}
                                loading={verifying}
                                disabled={token.length !== 6}
                            />
                        </form>
                    </>
                )}

                <div className="text-center text-sm mt-6" style={{ color: colors.textLight }}>
                    © {new Date().getFullYear()} Claritel AI. All rights reserved.
                </div>
            </div>
        </div>
    );
}

export default TwoFactorSetup;