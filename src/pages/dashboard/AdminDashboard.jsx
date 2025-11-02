// src/pages/dashboard/AdminDashboard.jsx
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-950">
            <DashboardSidebar role="Admin" />
            <div className="flex-1 flex flex-col">
                <DashboardHeader title="Admin Dashboard" />
                <main className="p-8 flex-1">
                    <h2 className="text-3xl font-bold text-white mb-6">System Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Admin specific content goes here */}
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
                </main>
            </div>
        </div>
    );
}