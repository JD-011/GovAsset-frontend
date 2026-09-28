import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink, Inbox } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationAPI.getMyNotifications();
            if (res.status === 'success') {
                setNotifications(res.data);
            }
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleMarkRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await notificationAPI.markRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const handleItemClick = async (notif) => {
        if (!notif.isRead) {
            await handleMarkRead(notif._id);
        }
        setIsOpen(false);

        // Route dynamically based on entityType and user role
        const { entityType, entityId } = notif;
        if (entityType === 'Complaint') {
            navigate(`/complaints/${entityId}`);
        } else if (entityType === 'Asset') {
            navigate(`/assets/${entityId}`);
        } else if (entityType === 'MaintenanceTask') {
            navigate(`/maintenance/tasks/${entityId}`);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                            {unreadCount > 0 && (
                                <span className="bg-brand-100 text-brand-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1 transition"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {loading && notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400">Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-medium text-slate-500">No notifications found.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => handleItemClick(notif)}
                                    className={`p-4 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${!notif.isRead ? 'bg-brand-50/40' : ''
                                        }`}
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notif.isRead ? 'bg-brand-600' : 'bg-transparent'
                                            }`}
                                    />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">
                                            {notif.title}
                                        </p>
                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-1">
                                            {notif.message}
                                        </p>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDateTime(notif.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
