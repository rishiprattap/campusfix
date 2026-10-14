import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { NewComplaintPage } from './pages/student/NewComplaintPage';
import { ComplaintListPage } from './pages/student/ComplaintListPage';
import { ComplaintDetailPage } from './pages/student/ComplaintDetailPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminComplaintDetailPage } from './pages/admin/AdminComplaintDetailPage';
import { UserDirectoryPage } from './pages/admin/UserDirectoryPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PolicyPage } from './pages/PolicyPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComplaintProvider>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/terms" element={<PolicyPage />} />
              <Route path="/privacy" element={<PolicyPage />} />
              <Route path="/safety" element={<PolicyPage />} />

              {/* Student Portal (Protected) */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin', 'staff']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/complaints/new"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin', 'staff']}>
                    <NewComplaintPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/complaints"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin', 'staff']}>
                    <ComplaintListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/complaints/:id"
                element={
                  <ProtectedRoute allowedRoles={['student', 'admin', 'staff']}>
                    <ComplaintDetailPage />
                  </ProtectedRoute>
                }
              />

              {/* Administrator Portal (Protected - Admin role required) */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminComplaintsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminComplaintDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserDirectoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* Profile & Settings (Authenticated users) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ComplaintProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
