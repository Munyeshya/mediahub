// src/pages/dashboard/GiverDashboard.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Briefcase, DollarSign, Star } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/logic/auth";
import { Button } from "@/components/ui/button";
import { GiverServices } from "./GiverServices";
import { GiverEarnings } from "./GiverEarnings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Calendar, User, FileText } from "lucide-react";



// ✅ ---- Giver Home Page ----
function GiverHome() {
    const { user } = useAuth(); // user = { id, role, email }
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Handle Booking Status Update ---
    const handleBookingStatus = async (bookingId, newStatus) => {
        setLoadingAction(true);
        try {
            const res = await fetch(
                `http://localhost:3001/api/bookings/${bookingId}/status`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!res.ok) throw new Error("Failed to update booking status");
            const data = await res.json();
            toast.success(data.message);

            // 🔄 Update UI instantly
            setData((prev) => ({
                ...prev,
                recentBookings: prev.recentBookings.map((b) =>
                    b.booking_id === bookingId ? { ...b, status: newStatus } : b
                ),
            }));

            // Close modal
            setSelectedBooking(null);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingAction(false);
        }
    };


    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const API_URL = user?.id
        ? `http://localhost:3001/api/giver/${user.id}/dashboard`
        : null;

    useEffect(() => {
        if (!API_URL) return;

        const fetchDashboard = async () => {
            try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error("Failed to load dashboard data.");
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, [API_URL]);

    // --- Loading ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40 text-amber-500">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    // --- Error ---
    if (error) {
        return (
            <div className="text-center text-red-400 bg-red-900/10 border border-red-700 rounded-lg p-6">
                <p>⚠️ {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p>No data found for this account.</p>
            </div>
        );
    }

    const { profile, stats, recentBookings } = data;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
                Welcome back, {profile?.name?.split(" ")[0]} 👋
            </h2>

            {/* --- SUMMARY CARDS --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-amber-400">
                            <Briefcase className="w-5 h-5 mr-2" /> Active Services
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-white">
                        {stats.active_services}
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-green-400">
                            <Users className="w-5 h-5 mr-2" /> Total Clients
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-white">
                        {stats.total_clients}
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-blue-400">
                            <DollarSign className="w-5 h-5 mr-2" /> Total Earnings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-green-400">
                        RWF {Number(stats.total_earnings).toLocaleString()}
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center text-yellow-400">
                            <Star className="w-5 h-5 mr-2" /> Average Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold text-yellow-400">
                        {Number(profile.avg_rating || 0).toFixed(1)} ★
                    </CardContent>
                </Card>
            </div>

            {/* --- RECENT BOOKINGS --- */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-xl text-white">
                        Recent Bookings
                    </CardTitle>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-500 text-amber-500 hover:bg-amber-900/20"
                    >
                        Refresh
                    </Button>
                </CardHeader>

                <CardContent>
                    {recentBookings.length === 0 ? (
                        <p className="text-gray-400">No recent bookings yet.</p>
                    ) : (
                        <table className="min-w-full text-gray-300">
                            <thead className="border-b border-gray-700 text-left">
                                <tr>
                                    <th className="py-2">Client</th>
                                    <th className="py-2">Service</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((b) => (
                                    <tr
                                        key={b.booking_id}
                                        className="border-b border-gray-800 hover:bg-gray-700/50"
                                    >
                                        <td className="py-2">{b.client_name}</td>
                                        <td className="py-2">{b.service_name}</td>
                                        <td
                                            className={`py-2 ${b.status === "Completed"
                                                ? "text-green-400"
                                                : "text-amber-400"
                                                }`}
                                        >
                                            {b.status}
                                        </td>
                                        <td className="py-2 text-right">
                                            <span className="block mb-1 text-sm text-gray-300">
                                                RWF {Number(b.total_price_RWF).toLocaleString()}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-amber-500 text-amber-500 hover:bg-amber-900/20"
                                                onClick={() => setSelectedBooking(b)}
                                            >
                                                View Details
                                            </Button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    )}
                </CardContent>
                {selectedBooking && (
                    <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
                        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-amber-500">
                                    Booking Details
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3 mt-4">
                                <p><strong>Client:</strong> {selectedBooking.client_name}</p>
                                <p><strong>Service:</strong> {selectedBooking.service_name}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className="text-amber-400">{selectedBooking.status}</span>
                                </p>
                                <p>
                                    <strong>Total:</strong> RWF{" "}
                                    {Number(selectedBooking.total_price_RWF).toLocaleString()}
                                </p>
                                <p className="flex items-center space-x-2 text-gray-300">
                                    <Calendar className="h-4 w-4 text-amber-500" />
                                    <span>
                                        {new Date(selectedBooking.start_date).toLocaleDateString()} →{" "}
                                        {new Date(selectedBooking.end_date).toLocaleDateString()}
                                    </span>
                                </p>

                                {selectedBooking.notes && (
                                    <div className="border-t border-gray-700 pt-2">
                                        <p className="text-gray-400 text-sm italic">
                                            “{selectedBooking.notes}”
                                        </p>
                                    </div>
                                )}

                                {/* ✅ Action Buttons */}
                                {selectedBooking.status === "Pending" && (
                                    <div className="flex space-x-3 mt-4">
                                        <Button
                                            disabled={loadingAction}
                                            className="flex-1 bg-green-500 hover:bg-green-400 text-gray-900"
                                            onClick={() =>
                                                handleBookingStatus(selectedBooking.booking_id, "Accepted")
                                            }
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            disabled={loadingAction}
                                            variant="outline"
                                            className="flex-1 border-red-500 text-red-400 hover:bg-red-900/20"
                                            onClick={() =>
                                                handleBookingStatus(selectedBooking.booking_id, "Rejected")
                                            }
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}

                                {selectedBooking.status === "Accepted" && (
                                    <Button
                                        disabled={loadingAction}
                                        className="w-full bg-blue-500 hover:bg-blue-400 text-white mt-4"
                                        onClick={() =>
                                            handleBookingStatus(selectedBooking.booking_id, "Completed")
                                        }
                                    >
                                        Mark Completed
                                    </Button>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

            </Card>
        </div>
    );
}

// ✅ ---- Layout ----
const GiverDashboardLayout = ({ title }) => {
    const role = "Giver";
    return (
        <div className="flex min-h-screen bg-gray-950">
            <aside className="hidden md:block w-64 flex-shrink-0 h-screen sticky top-0">
                <DashboardSidebar role={role} />
            </aside>
            <div className="flex-1 flex flex-col">
                <DashboardHeader title={title} role={role} />
                <main className="p-4 md:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// ✅ ---- Main Giver Dashboard ----
export function GiverDashboard() {
    return (
        <Routes>
            <Route
                path="/"
                element={<GiverDashboardLayout title="Creative Dashboard" />}
            >
                <Route index element={<GiverHome />} />
                <Route path="services" element={<GiverServices />} />
                <Route path="earnings" element={<GiverEarnings />} />
            </Route>
        </Routes>
    );
}
