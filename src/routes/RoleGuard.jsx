import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getDefaultDashboard = (role) => {
    switch (role) {
        case 'ADMIN':
            return '/admin/dashboard';
        case 'ASSET_MANAGER':
            return '/asset-manager/dashboard';
        case 'MAINTENANCE_STAFF':
            return '/maintenance/dashboard';
        case 'CITIZEN':
            return '/citizen/dashboard';
        default:
            return '/login';
    }
};

const RoleGuard = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect user to their own role dashboard if attempting to open forbidden URL
        const target = getDefaultDashboard(user.role);
        return <Navigate to={target} replace />;
    }

    return children;
};

export default RoleGuard;
