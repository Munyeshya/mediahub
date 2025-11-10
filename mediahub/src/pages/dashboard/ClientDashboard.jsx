// src/pages/dashboard/ClientDashboard.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/logic/auth";

function ClientHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = user?.id
    ? `http://localhost:3001/api/client/${user.id}/dashboard`
    : null;

  useEffect(() => {
    if (!API_URL) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [API_URL]);

  if (!user) {
    return (
      <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <p>You need to log in to view your dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-amber-500 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-lg">Loading your dashboard data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-400 bg-red-900/10 border border-red-700 rounded-lg p-6">
        <p>⚠️ {error || "Failed to load data"}</p>
      </div>
    );
  }

  const { profile, recentBookings } = data;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">
        Welcome back, {profile.name.split(" ")[0]} 👋
      </h2>

      {/* --- Summary Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Completed", icon: CheckCircle, color: "text-green-400", value: profile.completed },
          { label: "Pending", icon: Clock, color: "text-amber-400", value: profile.pending },
          { label: "Total Bookings", icon: Calendar, color: "text-blue-400", value: profile.total_bookings },
          { label: "Total Spent", icon: DollarSign, color: "text-purple-400", value: `RWF ${Number(profile.total_spent).toLocaleString()}` },
        ].map(({ label, icon: Icon, color, value }) => (
          <Card key={label} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className={`flex items-center ${color}`}>
                <Icon className="w-5 h-5 mr-2" /> {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-white">{value}</CardContent>
          </Card>
        ))}
      </div>

      {/* --- Recent Bookings --- */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-gray-400">No recent bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-gray-300">
                <thead className="border-b border-gray-700 text-left">
                  <tr>
                    <th className="py-2">Service</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.booking_id} className="border-b border-gray-800 hover:bg-gray-700/50">
                      <td className="py-2">{b.service_name}</td>
                      <td className={`py-2 ${b.status === "Completed" ? "text-green-400" : "text-amber-400"}`}>
                        {b.status}
                      </td>
                      <td className="py-2">RWF {Number(b.total_price_RWF).toLocaleString()}</td>
                      <td className="py-2">{new Date(b.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ClientDashboardLayout({ title }) {
  const role = "Client";
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
}

export function ClientDashboard() {
  return (
    <Routes>
      <Route path="/" element={<ClientDashboardLayout title="Client Dashboard" />}>
        <Route index element={<ClientHome />} />
      </Route>
    </Routes>
  );
}
