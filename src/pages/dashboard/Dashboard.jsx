import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { FaTools } from 'react-icons/fa';

const Dashboard = () => {
    return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-gradient-to-br from-blue-50 via-white to-gray-50">
                <div className="bg-white shadow-lg rounded-full p-6 border border-gray-100 mb-6 transform transition-transform duration-500 hover:scale-110">
                    <FaTools className="text-5xl text-blue-600" />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Work in Progress 🚧
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    We're building something awesome. Stay tuned!
                </p>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
