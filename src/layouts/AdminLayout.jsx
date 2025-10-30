// src/layouts/AdminLayout.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Users, Briefcase, Bell, ChevronDown, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { userHasPermission, PERMISSIONS } from '../utils/permissions'

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const profileRef = useRef(null)
    const notifRef = useRef(null)
    const location = useLocation()

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false)
            if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Define menu items with their permission requirements
    const allMenuItems = [
        { 
            id: 'dashboard', 
            icon: LayoutDashboard, 
            label: 'Dashboard', 
            to: '/dashboard',
            permission: null // Everyone can see dashboard
        },
        { 
            id: 'users', 
            icon: Users, 
            label: 'Manage Users', 
            to: '/manage-users',
            permission: null // Everyone can see users (you can change this if needed)
        },
        { 
            id: 'tenants', 
            icon: Briefcase, 
            label: 'Manage Tenants', 
            to: '/manage-tenants',
            permission: PERMISSIONS.TENANT_MANAGEMENT // Requires tenant.management
        }
    ]

    // Filter menu items based on permissions
    const menuItems = allMenuItems.filter(item => {
        if (!item.permission) return true; // No permission required
        return userHasPermission(user, item.permission);
    });

    const notifications = [
        { id: 1, text: 'New user registered', time: '5 min ago' },
        { id: 2, text: 'Tenant report submitted', time: '1 hour ago' },
        { id: 3, text: 'System update available', time: '2 hours ago' }
    ]

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <aside className={`bg-[#001B80] text-white flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'} shadow-lg`}>
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    {!isSidebarCollapsed && <img src="/lightlogo.png" alt="Claritel AI" className="h-12" />}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-all duration-200"
                    >
                        {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>
                <nav className="flex flex-col flex-1 gap-2 p-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.to
                        return (
                            <Link
                                key={item.id}
                                to={item.to}
                                className={`flex items-center gap-4 rounded-xl font-medium transition-all duration-300 ${isSidebarCollapsed ? 'justify-center p-4' : 'px-4 py-3'
                                    } ${isActive
                                        ? 'bg-blue-600 font-semibold shadow-md'
                                        : 'hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={22} strokeWidth={2.5} />
                                {!isSidebarCollapsed && <span>{item.label}</span>}
                                {isActive && !isSidebarCollapsed && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-white"></span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between h-18 bg-white border-b border-gray-200 px-8 shadow-sm">
                    {!isSidebarCollapsed && <img src="/darklogo.png" alt="Claritel AI" className="h-12" />}
                    <div className="flex items-center gap-4 ml-auto">
                        <div ref={notifRef} className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative w-11 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all duration-200"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>
                            {showNotifications && (
                                <div className="absolute top-14 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                                    <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">Notifications</div>
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                                        >
                                            <p className="text-sm text-gray-800 mb-1">{n.text}</p>
                                            <p className="text-xs text-gray-500">{n.time}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div ref={profileRef} className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 border border-gray-200 rounded-xl bg-white px-2 py-1 hover:bg-gray-50 transition-all duration-200"
                            >
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#001B80] to-blue-600 flex items-center justify-center text-white font-semibold">
                                    {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD'}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'Administrator'}</p>
                                    <p className="text-xs text-gray-500">
                                        {user?.role === 'platform_super_admin' ? 'Platform Admin' : 
                                         user?.role === 'super_admin' ? 'Super Admin' : 
                                         'Sub Admin'}
                                    </p>
                                </div>
                                <ChevronDown size={16} className="text-gray-400" />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute top-14 right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                                    <button className="w-full px-4 py-3 flex items-center gap-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 transition-all duration-200">
                                        <User size={18} />
                                        <span>Profile Settings</span>
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-auto bg-gray-50">{children}</main>
            </div>
        </div>
    )
}