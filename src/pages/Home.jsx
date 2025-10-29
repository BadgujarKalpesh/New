import React from 'react';
import { Navigate } from 'react-router-dom';
import Auth from './authentication/Auth';

function Home() {
    const isAuthenticated = sessionStorage.getItem("accessToken");

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Auth />
    );
}

export default Home;