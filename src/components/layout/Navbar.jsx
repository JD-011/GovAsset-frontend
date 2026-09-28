import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRoleLabel } from '../../utils/formatters';
import NotificationBell from '../common/NotificationBell';
import { LogOut, Shield, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden transition"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-brand-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
                        <Shield className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-900 leading-none">
                            GovAsset <span className="text-brand-600 font-medium text-xs bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">System</span>
                        </h1>
                        <p className="text-[11px] text-slate-400 leading-tight">Physical Asset Inventory & Lifecycle</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {user && <NotificationBell />}

                {user && (
                    <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-bold text-slate-800 leading-tight">{user.name}</div>
                            <div className="text-[11px] font-medium text-brand-600 bg-brand-50 px-2 py-0.2 rounded-md inline-block">
                                {getRoleLabel(user.role)}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
