// src/logic/auth.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as dbLogout } from './db'; // Import the new db.js logout

const AuthContext = createContext(null);

/**
 * AuthProvider: Manages the user's authentication state.
 * It provides the current user role and the login/logout functions to the app.
 */
export const AuthProvider = ({ children }) => {
    // Check local storage for initial state on load
    const initialRole = localStorage.getItem('userRole');
    const [userRole, setUserRole] = useState(initialRole);
    const navigate = useNavigate();

    // 1. Unified Login function (Updates role and state)
    const login = (role) => {
        setUserRole(role);
        localStorage.setItem('userRole', role); // Persist state
        // navigate to dashboard is handled in Login.jsx on success
    };

    // 2. Unified Logout function
    const logout = () => {
        dbLogout(); // Clear data in db/localStorage
        setUserRole(null); // Clear state
        navigate('/login', { replace: true }); // Redirect to login after logout
    };

    // 3. Helper to check if a user is logged in
    const isAuthenticated = useMemo(() => !!userRole, [userRole]);

    // 4. Value provided by the context
    const value = useMemo(() => ({
        userRole,
        isAuthenticated,
        login,
        logout,
    }), [userRole, isAuthenticated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the authentication context.
 */
export const useAuth = () => {
    return useContext(AuthContext);
};