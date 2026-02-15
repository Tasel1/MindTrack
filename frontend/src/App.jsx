import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import './App.css'; // Импортируем стили

// Import pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import EntriesPage from './pages/Entries';
import CreateEntryPage from './pages/CreateEntry';
import EditEntryPage from './pages/EditEntry';
import ViewEntryPage from './pages/ViewEntry';
import StatisticsPage from './pages/Statistics';
import ProfilePage from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes - Students */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student', 'psychologist']}>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/entries" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <EntriesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/entries/create" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CreateEntryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/entries/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <EditEntryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/entries/view/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ViewEntryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['student', 'psychologist']}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Psychologists */}
          <Route 
            path="/statistics" 
            element={
              <ProtectedRoute allowedRoles={['psychologist']}>
                <StatisticsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;