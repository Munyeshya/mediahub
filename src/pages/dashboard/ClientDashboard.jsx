// src/pages/dashboard/ClientDashboard.jsx
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export function ClientDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-950">
            <DashboardSidebar role="Client" />
            <div className="flex-1 flex flex-col">
                <DashboardHeader title="Client Dashboard" />
                <main className="p-8 flex-1">
                    <h2 className="text-3xl font-bold text-white mb-6">Welcome Back!</h2>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-gray-300">
                        View your recent bookings and messages.
                    </div>
                </main>
            </div>
        </div>
    );
}