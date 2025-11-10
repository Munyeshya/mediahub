// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../logic/auth';
import { Loader2 } from 'lucide-react';

/**
 * A wrapper for protected routes.
 * Ensures users are authenticated and authorized before accessing nested routes.
 *
 * @param {string} allowedRole - The role required to access this route (e.g. 'Admin', 'Client', 'Giver')
 */
export const ProtectedRoute = ({ allowedRole }) => {
  const { user, isAuthenticated } = useAuth();

  // 🕒 Show loader while auth state initializes (avoids flicker or premature redirect)
  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-amber-500">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Checking access...
      </div>
    );
  }

  // 🚫 Not authenticated at all → send to login
  if (!isAuthenticated) {
    console.warn('Access denied: not authenticated.');
    return <Navigate to="/login" replace />;
  }

  // 🚫 Wrong role → redirect to correct dashboard
  if (allowedRole && user?.role !== allowedRole) {
    console.warn(`Access denied. User role '${user?.role}' is not '${allowedRole}'`);
    const redirectPath = user?.role
      ? `/dashboard/${user.role.toLowerCase()}`
      : '/';
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Authorized → render nested route content
  return <Outlet />;
};
