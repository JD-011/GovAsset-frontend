import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleGuard from './routes/RoleGuard';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import CitizenRegisterPage from './pages/auth/CitizenRegisterPage';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import AssetManagerDashboard from './pages/assetManager/AssetManagerDashboard';
import StaffDashboard from './pages/maintenance/StaffDashboard';
import CitizenDashboard from './pages/citizen/CitizenDashboard';

// Admin Modules
import UserManagementPage from './pages/admin/UserManagementPage';
import DepartmentManagementPage from './pages/admin/DepartmentManagementPage';

// Asset Modules
import AssetListPage from './pages/assetManager/AssetListPage';
import AssetFormPage from './pages/assetManager/AssetFormPage';
import AssetDetailPage from './pages/assetManager/AssetDetailPage';

// Complaint Modules
import ComplaintListPage from './pages/complaints/ComplaintListPage';
import ComplaintFormPage from './pages/complaints/ComplaintFormPage';
import ComplaintDetailPage from './pages/complaints/ComplaintDetailPage';

// Maintenance Modules
import MaintenanceTaskListPage from './pages/maintenance/MaintenanceTaskListPage';
import MaintenanceTaskDetailPage from './pages/maintenance/MaintenanceTaskDetailPage';

// Citizen & Common Modules
import CitizenMapViewPage from './pages/citizen/CitizenMapViewPage';
import NotificationsPage from './pages/common/NotificationsPage';
import NotFoundPage from './pages/common/NotFoundPage';

const RootRedirect = () => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case 'ADMIN':
            return <Navigate to="/admin/dashboard" replace />;
        case 'ASSET_MANAGER':
            return <Navigate to="/asset-manager/dashboard" replace />;
        case 'MAINTENANCE_STAFF':
            return <Navigate to="/maintenance/dashboard" replace />;
        case 'CITIZEN':
            return <Navigate to="/citizen/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<CitizenRegisterPage />} />

                    {/* Root Redirect */}
                    <Route path="/" element={<RootRedirect />} />

                    {/* Protected Application Routes */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Common Notifications */}
                        <Route path="/notifications" element={<NotificationsPage />} />

                        {/* Shared Detail Views */}
                        <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
                        <Route path="/assets/:id" element={<AssetDetailPage />} />

                        {/* ADMIN Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <RoleGuard allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <RoleGuard allowedRoles={['ADMIN']}>
                                    <UserManagementPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/admin/departments"
                            element={
                                <RoleGuard allowedRoles={['ADMIN']}>
                                    <DepartmentManagementPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/admin/assets"
                            element={
                                <RoleGuard allowedRoles={['ADMIN']}>
                                    <AssetListPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/admin/complaints"
                            element={
                                <RoleGuard allowedRoles={['ADMIN']}>
                                    <ComplaintListPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/admin/maintenance"
                            element={
                                <RoleGuard allowedRoles={['ADMIN']}>
                                    <MaintenanceTaskListPage />
                                </RoleGuard>
                            }
                        />

                        {/* ASSET_MANAGER Routes */}
                        <Route
                            path="/asset-manager/dashboard"
                            element={
                                <RoleGuard allowedRoles={['ASSET_MANAGER', 'ADMIN']}>
                                    <AssetManagerDashboard />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/asset-manager/assets"
                            element={
                                <RoleGuard allowedRoles={['ASSET_MANAGER', 'ADMIN']}>
                                    <AssetListPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/asset-manager/assets/new"
                            element={
                                <RoleGuard allowedRoles={['ASSET_MANAGER', 'ADMIN']}>
                                    <AssetFormPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/asset-manager/assets/edit/:id"
                            element={
                                <RoleGuard allowedRoles={['ASSET_MANAGER', 'ADMIN']}>
                                    <AssetFormPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/asset-manager/assets/:id"
                            element={
                                <RoleGuard allowedRoles={['ASSET_MANAGER', 'ADMIN']}>
                                    <AssetDetailPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/asset-manager/complaints"
                            element={
                                <RoleGuard allowedRoles={['ASSET_MANAGER', 'ADMIN']}>
                                    <ComplaintListPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/asset-manager/maintenance"
                            element={
                                <RoleGuard allowedRoles={['ASSET_MANAGER', 'ADMIN']}>
                                    <MaintenanceTaskListPage />
                                </RoleGuard>
                            }
                        />

                        {/* MAINTENANCE_STAFF Routes */}
                        <Route
                            path="/maintenance/dashboard"
                            element={
                                <RoleGuard allowedRoles={['MAINTENANCE_STAFF', 'ADMIN']}>
                                    <StaffDashboard />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/maintenance/tasks"
                            element={
                                <RoleGuard allowedRoles={['MAINTENANCE_STAFF', 'ADMIN']}>
                                    <MaintenanceTaskListPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/maintenance/tasks/:id"
                            element={
                                <RoleGuard allowedRoles={['MAINTENANCE_STAFF', 'ADMIN']}>
                                    <MaintenanceTaskDetailPage />
                                </RoleGuard>
                            }
                        />

                        {/* CITIZEN Routes */}
                        <Route
                            path="/citizen/dashboard"
                            element={
                                <RoleGuard allowedRoles={['CITIZEN']}>
                                    <CitizenDashboard />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/citizen/assets"
                            element={
                                <RoleGuard allowedRoles={['CITIZEN']}>
                                    <AssetListPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/citizen/assets/:id"
                            element={
                                <RoleGuard allowedRoles={['CITIZEN']}>
                                    <AssetDetailPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/citizen/map"
                            element={
                                <RoleGuard allowedRoles={['CITIZEN']}>
                                    <CitizenMapViewPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/citizen/complaints"
                            element={
                                <RoleGuard allowedRoles={['CITIZEN']}>
                                    <ComplaintListPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/citizen/complaints/new"
                            element={
                                <RoleGuard allowedRoles={['CITIZEN']}>
                                    <ComplaintFormPage />
                                </RoleGuard>
                            }
                        />
                        <Route
                            path="/citizen/complaints/:id"
                            element={
                                <RoleGuard allowedRoles={['CITIZEN']}>
                                    <ComplaintDetailPage />
                                </RoleGuard>
                            }
                        />
                    </Route>

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
