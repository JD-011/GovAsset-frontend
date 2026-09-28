import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            setLoading(true);
            const res = await authAPI.getMe();
            if (res.status === 'success' && res.data) {
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const login = async (credentials) => {
        const res = await authAPI.login(credentials);
        if (res.status === 'success' && res.data) {
            // Fetch full user details from /auth/me to include populated or complete fields if needed
            await fetchCurrentUser();
            return res.data;
        }
        throw new Error('Login failed');
    };

    const register = async (userData) => {
        const res = await authAPI.register(userData);
        if (res.status === 'success' && res.data) {
            await fetchCurrentUser();
            return res.data;
        }
        throw new Error('Registration failed');
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
        isAdmin: user?.role === 'ADMIN',
        isAssetManager: user?.role === 'ASSET_MANAGER',
        isMaintenanceStaff: user?.role === 'MAINTENANCE_STAFF',
        isCitizen: user?.role === 'CITIZEN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
