// src/pages/dashboard/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ManageGivers } from './ManageGivers';
import { GiverDetails } from './GiverDetails';
import { ManageServices } from './ManageServices';
import { SystemSettings } from './SystemSettings';
import { AdminHome } from './AdminHome'; // KEEP THIS IMPORT

// --- REMOVE THE DUPLICATE FUNCTION ADMINHOME HERE ---
/* function AdminHome() { ... } 
The placeholder function was removed to resolve the conflict.
*/

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
                <Route path="givers/:giverId" element={<GiverDetails />} />
                
                {/* Upcoming Manage Services page */}
                <Route path="services" element={<ManageServices />} />
                <Route path="settings" element={<SystemSettings />} />
                
            </Route>
        </Routes>
    );
}