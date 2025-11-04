// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../logic/auth';

/**
 * A wrapper component for React Router v6 to protect routes.
 * It redirects unauthorized users to the login page.
 *
 * @param {string} allowedRole - The required role to access the nested routes (e.g., 'Admin', 'Client').
 */
export const ProtectedRoute = ({ allowedRole }) => {
    const { isAuthenticated, userRole } = useAuth();
    
    // 1. Check if the user is authenticated at all
    if (!isAuthenticated) {
        // Redirect to login, replacing the history entry
        return <Navigate to="/login" replace />; 
    }
    
    // 2. Check if the authenticated user has the required role
    if (allowedRole && userRole !== allowedRole) {
        // You could redirect to a 403 page or their default dashboard, 
        // but for now, we'll redirect to a generic login/home page as a fallback.
        console.warn(`Access denied. User role '${userRole}' is not '${allowedRole}'`);
        return <Navigate to="/" replace />; 
    }

    // 3. If authenticated and authorized, render the nested routes
    return <Outlet />; 
};