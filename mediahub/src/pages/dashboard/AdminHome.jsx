// src/pages/dashboard/AdminHome.jsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardOverviewData } from '@/logic/db'; // Import the new data function
import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard';
import { MonthlyRevenueChart, GiverStatusPieChart, ServiceUsageBarChart,PlatformUsageChart } from '@/components/dashboard/DashboardCharts';
import { Loader2, DollarSign, Users, Calendar, BarChart, X, CheckCircle } from 'lucide-react';

const formatterRWF = new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 });
<PlatformUsageChart data={usageData} />

export function AdminHome() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const overviewData = await fetchDashboardOverviewData();
                setData(overviewData);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch dashboard data. Check database connection.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-screen pt-10 text-white">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-4" />
                <p className="text-lg">Loading Admin Dashboard Data...</p>
                <p className="text-sm text-gray-500">Aggregating complex metrics from the database...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-900/20 border border-red-700 text-red-400 rounded-lg mx-auto mt-10">
                <X className="h-6 w-6 inline mr-2" />
                <h3 className="font-bold">Data Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    const { keyMetrics, monthlyRevenueData, giverStatusData, serviceUsageData } = data;

    return (
        <div className="space-y-8 p-4 md:p-8">
            <h1 className="text-4xl font-extrabold text-white border-b-2 border-amber-500/50 pb-2">
                Platform Overview 🌟
            </h1>
            
            <p className="text-gray-400">
                A data-driven snapshot of MediaHub's financial performance, community growth, and service popularity.
            </p>

            {/* 1. KEY METRICS GRID */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardMetricCard 
                    title="Total Revenue (Completed)" 
                    value={keyMetrics.totalRevenue} 
                    icon={DollarSign} 
                    description={`Over ${keyMetrics.totalBookings} total bookings`}
                    color="text-green-400"
                />
                <DashboardMetricCard 
                    title="Total Bookings" 
                    value={keyMetrics.totalBookings} 
                    icon={BarChart} 
                    description="Total transactions initiated"
                    color="text-blue-400"
                />
                <DashboardMetricCard 
                    title="Active Givers" 
                    value={keyMetrics.activeGivers} 
                    icon={CheckCircle} 
                    description="Verified and active creative profiles"
                    color="text-amber-500"
                />
                <DashboardMetricCard 
                    title="New Clients (30 Days)" 
                    value={keyMetrics.newClientsLast30Days} 
                    icon={Users} 
                    description="New user accounts created"
                    color="text-purple-400"
                />
            </div>

            {/* 2. CHARTS GRID */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Large Revenue Chart (2/3 width) */}
                <div className="lg:col-span-2">
                    <MonthlyRevenueChart data={monthlyRevenueData} />
                </div>
                
                {/* Giver Status Pie Chart (1/3 width) */}
                <div className="lg:col-span-1">
                    <GiverStatusPieChart data={giverStatusData} />
                </div>
            </div>

            {/* 3. ADDITIONAL CHARTS */}
            <div className="grid gap-6 lg:grid-cols-1">
                <ServiceUsageBarChart data={serviceUsageData} />
            </div>
        </div>
    );
}