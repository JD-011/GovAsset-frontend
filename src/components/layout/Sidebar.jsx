import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Building2,
    AlertCircle,
    Wrench,
    Users,
    Building,
    Bell,
    MapPin,
    FilePlus,
    Shield,
    X,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const getNavLinks = () => {
        if (!user) return [];

        switch (user.role) {
            case 'ADMIN':
                return [
                    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/admin/users', label: 'User Management', icon: Users },
                    { to: '/admin/departments', label: 'Departments', icon: Building },
                    { to: '/admin/assets', label: 'Asset Inventory', icon: Building2 },
                    { to: '/admin/complaints', label: 'Complaints', icon: AlertCircle },
                    { to: '/admin/maintenance', label: 'Maintenance Tasks', icon: Wrench },
                    { to: '/notifications', label: 'Notifications', icon: Bell },
                ];
            case 'ASSET_MANAGER':
                return [
                    { to: '/asset-manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/asset-manager/assets', label: 'My Managed Assets', icon: Building2 },
                    { to: '/asset-manager/complaints', label: 'Asset Complaints', icon: AlertCircle },
                    { to: '/asset-manager/maintenance', label: 'Maintenance Work', icon: Wrench },
                    { to: '/notifications', label: 'Notifications', icon: Bell },
                ];
            case 'MAINTENANCE_STAFF':
                return [
                    { to: '/maintenance/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/maintenance/tasks', label: 'Assigned Tasks', icon: Wrench },
                    { to: '/notifications', label: 'Notifications', icon: Bell },
                ];
            case 'CITIZEN':
                return [
                    { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { to: '/citizen/assets', label: 'Browse Assets', icon: Building2 },
                    { to: '/citizen/map', label: 'Interactive Map', icon: MapPin },
                    { to: '/citizen/complaints', label: 'My Complaints', icon: AlertCircle },
                    { to: '/citizen/complaints/new', label: 'Raise Complaint', icon: FilePlus },
                    { to: '/notifications', label: 'Notifications', icon: Bell },
                ];
            default:
                return [];
        }
    };

    const navLinks = getNavLinks();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
                />
            )}

            <aside
                className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <Shield className="w-6 h-6 text-brand-500" />
                        <span>GovAsset</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-white lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-1">
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Main Menu
                    </div>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${isActive
                                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                                        : 'hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span>{link.label}</span>
                            </NavLink>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
                    Gov Asset Management MVP
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
