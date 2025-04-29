// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSignup from './pages/AdminSignup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem('adminToken'));

  return (
    <Routes>
      <Route path="/signup" element={<AdminSignup />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/dashboard-admin"
        element={
          isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard-admin' : '/login'} replace />}
      />
    </Routes>
  );
};

export default App;