import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Bell, CheckCheck, Clock, Inbox, ShieldAlert } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationAPI.getMyNotifications();
            if (res.status === 'success') {
                setNotifications(res.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkRead = async (id) => {
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

    const handleNavigate = (notif) => {
        handleMarkRead(notif._id);
        const { entityType, entityId } = notif;
        if (entityType === 'Complaint') navigate(`/complaints/${entityId}`);
        if (entityType === 'Asset') navigate(`/assets/${entityId}`);
        if (entityType === 'MaintenanceTask') navigate(`/maintenance/tasks/${entityId}`);
    };

    if (loading) return <LoadingSpinner text="Loading your notifications..." />;

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="w-6 h-6 text-brand-600" />
                        Notification Hub
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">System threshold alerts, complaint status updates & maintenance assignments</p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs rounded-xl border border-brand-200 transition flex items-center gap-1.5"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            <ErrorMessage message={error} onClose={() => setError('')} />

            {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                    <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <h3 className="font-bold text-slate-700 text-base mb-1">No notifications</h3>
                    <p className="text-xs text-slate-500">You are all caught up! System notifications will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                    {notifications.map((notif) => (
                        <div
                            key={notif._id}
                            onClick={() => handleNavigate(notif)}
                            className={`p-5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-4 ${!notif.isRead ? 'bg-brand-50/30' : ''
                                }`}
                        >
                            <div
                                className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${!notif.isRead ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-slate-300'
                                    }`}
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDateTime(notif.createdAt)}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                                <span className="inline-block text-[10px] font-semibold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                                    {notif.entityType} Alert
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
