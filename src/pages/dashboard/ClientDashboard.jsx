// src/pages/dashboard/ClientDashboard.jsx
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

// Placeholder Component for the Main Overview
function ClientHome() {
    return (
        <>
            <h2 className="text-3xl font-bold text-white mb-6">Welcome Back!</h2>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-gray-300">
                View your recent bookings and messages.
            </div>
        </>
    );
}

// Main Layout Component for the Client Dashboard
const ClientDashboardLayout = ({ title }) => {
    const role = "Client"; // Hardcode for ClientDashboard
    
    return (
        <div className="flex min-h-screen bg-gray-950">
            {/* DESKTOP SIDEBAR: Visible only on md screens and larger */}
            <aside className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0">
                <DashboardSidebar role={role} />
            </aside>
            
            <div className="flex-1 flex flex-col">
                {/* Pass the role to the Header so it can render the mobile sidebar */}
                <DashboardHeader title={title} role={role} /> 
                <main className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <Outlet /> {/* Renders the nested route component (e.g., ClientHome) */}
                </main>
            </div>
        </div>
    );
};


export function ClientDashboard() {
    return (
        <Routes>
            <Route path="/" element={<ClientDashboardLayout title="Client Dashboard" />}>
                
                {/* Default route: /dashboard/client */}
                <Route index element={<ClientHome />} /> 
                
                {/* Other Client routes will go here: */}
                {/* <Route path="bookings" element={<MyBookings />} /> */} 
                
            </Route>
        </Routes>
    );
}