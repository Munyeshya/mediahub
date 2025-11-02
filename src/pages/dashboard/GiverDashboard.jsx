// src/pages/dashboard/GiverDashboard.jsx
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

// Placeholder Component for the Main Overview
function GiverHome() {
    return (
        <>
            <h2 className="text-3xl font-bold text-white mb-6">Manage Your Profile & Services</h2>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-gray-300">
                Update your rates and check client inquiries.
            </div>
        </>
    );
}

// Main Layout Component for the Giver Dashboard
const GiverDashboardLayout = ({ title }) => {
    const role = "Giver"; // Hardcode for GiverDashboard
    
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
                    <Outlet /> {/* Renders the nested route component (e.g., GiverHome) */}
                </main>
            </div>
        </div>
    );
};

export function GiverDashboard() {
    return (
        <Routes>
            <Route path="/" element={<GiverDashboardLayout title="Creative Dashboard" />}>
                
                {/* Default route: /dashboard/giver */}
                <Route index element={<GiverHome />} /> 
                
                {/* Other Giver routes will go here: */}
                {/* <Route path="services" element={<MyServices />} /> */} 
                
            </Route>
        </Routes>
    );
}