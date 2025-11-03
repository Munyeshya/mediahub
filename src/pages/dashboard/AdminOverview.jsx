// src/pages/dashboard/AdminOverview.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, CheckCircle, Clock, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAdminDashboardData } from '@/logic/db'; // We will create this function
import { Loader2 } from 'lucide-react';

// --- MOCK DATA FOR CHARTS ---
// Data for the Revenue Line Chart
const MOCK_REVENUE_DATA = [
    { month: 'Jul', revenue: 4500000 },
    { month: 'Aug', revenue: 5200000 },
    { month: 'Sep', revenue: 6100000 },
    { month: 'Oct', revenue: 5800000 },
    { month: 'Nov', revenue: 7500000 }, // Current month
];

// Data for the Service Breakdown Donut Chart
const MOCK_SERVICE_BREAKDOWN = [
    { name: 'Photography', value: 350, fill: '#F59E0B' }, // Amber
    { name: 'Videography', value: 250, fill: '#10B981' }, // Emerald
    { name: 'Graphics', value: 150, fill: '#3B82F6' },    // Blue
    { name: 'Web Dev', value: 100, fill: '#F97316' },     // Orange
    { name: 'Audio', value: 50, fill: '#EF4444' },       // Red
];

// --- PLACEHOLDER CHART COMPONENTS ---
// NOTE: Replace these with actual Recharts components once installed
const RevenueLineChart = () => (
    <div className="flex justify-center items-center h-48 bg-gray-900 rounded-lg border border-gray-700 p-4">
        <BarChart3 className="h-10 w-10 text-amber-500/50 mr-3" />
        <span className="text-gray-500">Revenue Line Chart Placeholder (Use Recharts)</span>
    </div>
);

const ServiceDonutChart = () => (
    <div className="flex justify-center items-center h-full bg-gray-900 rounded-lg border border-gray-700 p-4">
        <PieChart className="h-10 w-10 text-amber-500/50 mr-3" />
        <span className="text-gray-500">Service Donut Chart Placeholder (Use Recharts)</span>
    </div>
);
// --- END PLACEHOLDER CHART COMPONENTS ---


// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon: Icon, description, colorClass }) => (
    <Card className="bg-gray-800 border-gray-700 transition-shadow duration-300 hover:shadow-lg hover:shadow-amber-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${colorClass}`} />
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold text-white">{value}</div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </CardContent>
    </Card>
);

export function AdminOverview() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch dashboard data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await getAdminDashboardData(); // Call mock DB function
                setData(fetchedData);
            } catch (error) {
                toast.error("Failed to load dashboard data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                <span className="ml-3 text-white text-lg">Loading Admin Overview Data...</span>
            </div>
        );
    }

    // Default values if data fetch fails (shouldn't happen with the mock function)
    const { 
        totalGivers, activeClients, pendingGivers, monthlyRevenue, totalBookings, commissionRate 
    } = data || {};

    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-white mb-6">Platform Overview</h2>

            {/* 1. KEY METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Monthly Revenue"
                    value={`RWF ${monthlyRevenue.toLocaleString('en-US')}`}
                    icon={DollarSign}
                    description="Total platform earnings this month."
                    colorClass="text-green-500"
                />
                <StatCard
                    title="Total Givers"
                    value={totalGivers.toLocaleString('en-US')}
                    icon={Users}
                    description={`Active creatives currently on the platform.`}
                    colorClass="text-amber-500"
                />
                <StatCard
                    title="Pending Givers"
                    value={pendingGivers}
                    icon={Clock}
                    description="Givers awaiting profile verification."
                    colorClass="text-red-500"
                />
                <StatCard
                    title="Total Bookings"
                    value={totalBookings}
                    icon={CheckCircle}
                    description="Total completed and in-progress jobs."
                    colorClass="text-blue-500"
                />
            </div>
            
            {/* 2. CHARTS SECTION (2/3 and 1/3 layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Monthly Revenue Chart (2/3 width) */}
                <Card className="lg:col-span-2 bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-amber-500" /> Revenue Growth (Last 6 Months)
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Based on a {commissionRate * 100}% platform commission rate.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RevenueLineChart data={MOCK_REVENUE_DATA} />
                    </CardContent>
                </Card>

                {/* Service Breakdown Donut Chart (1/3 width) */}
                <Card className="lg:col-span-1 bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white">
                            Top Service Categories
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Bookings volume by primary category.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 pt-6">
                        <ServiceDonutChart data={MOCK_SERVICE_BREAKDOWN} />
                        {/* Legend for the Donut Chart could go here */}
                    </CardContent>
                </Card>
            </div>
            
            {/* 3. PENDING TASKS/RECENT ACTIVITY */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-red-500" /> Critical Pending Actions
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Items requiring immediate administrator review or approval.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-red-500/50">
                        <p className="text-white">
                            <span className="font-semibold text-red-400">{pendingGivers} Giver Profiles</span> awaiting verification.
                        </p>
                        <a href="/dashboard/admin/givers" className="text-amber-500 hover:text-amber-400 font-medium text-sm">Review Now &rarr;</a>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                        <p className="text-white">
                            <span className="font-semibold text-white">{data.cancelledBookings} Bookings</span> were cancelled this week.
                        </p>
                        <span className="text-gray-400 text-sm">Investigate</span>
                    </div>
                    {/* Add a few more mock pending tasks */}
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                        <p className="text-white">
                            <span className="font-semibold text-white">{data.newReviews} New Reviews</span> were posted in the last 24 hours.
                        </p>
                        <span className="text-gray-400 text-sm">Check Latest</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}