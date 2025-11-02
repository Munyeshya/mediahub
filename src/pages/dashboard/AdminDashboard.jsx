// src/pages/dashboard/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ManageGivers } from './ManageGivers';

// Placeholder Component for the Main Overview
function AdminHome() {
    return (
        <>
            <h2 className="text-3xl font-bold text-white mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-gray-300">
                    Total Givers: 150
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-gray-300">
                    Pending Verifications: 12
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-gray-300">
                    Revenue (Month): RWF 5M
                </div>
            </div>
        </>
    );
}

// Main Layout Component for the Admin Dashboard
const AdminDashboardLayout = ({ title }) => {
    const role = "Admin"; // Hardcode for AdminDashboard
    
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
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};


export function AdminDashboard() {
    return (
        <Routes>
            <Route path="/" element={<AdminDashboardLayout title="Admin Dashboard" />}>
                
                {/* Default route: /dashboard/admin */}
                <Route index element={<AdminHome />} /> 
                <Route path="givers" element={<ManageGivers />} />
                
                {/* Upcoming Manage Services page */}
                {/* <Route path="services" element={<ManageServices />} /> */} 
                
            </Route>
        </Routes>
    );
}