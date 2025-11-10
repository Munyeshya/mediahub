// src/logic/auth.jsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logout as dbLogout } from "./db";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Load user info from localStorage on refresh
  const savedUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const [user, setUser] = useState(savedUser);
  const navigate = useNavigate();

  // ✅ LOGIN — set user object {id, email, role}
  const login = (userData) => {
  // Save to React state
  setUser(userData);

  // Save full user to localStorage
  localStorage.setItem("user", JSON.stringify(userData));

  // 🔥 ALSO store separate identifiers for quick access elsewhere
  if (userData?.id) localStorage.setItem("userId", userData.id);
  if (userData?.role) localStorage.setItem("userRole", userData.role);
  if (userData?.email) localStorage.setItem("userEmail", userData.email);
};

  // ✅ LOGOUT — clear storage and redirect
  const logout = () => {
    dbLogout();
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Derived values
  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => useContext(AuthContext);
