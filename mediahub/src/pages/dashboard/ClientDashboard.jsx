// src/pages/dashboard/ClientDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ClientBookings } from "./ClientBookings";
import { ClientHome } from "./ClientHome"; // if you moved it to a separate file
import { BookingDetails } from "./BookingDetails";

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
          <Routes>
            <Route index element={<ClientHome />} />
            <Route path="bookings" element={<ClientBookings />} />
            <Route path="bookings/:bookingId" element={<BookingDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function ClientDashboard() {
  return <ClientDashboardLayout title="Client Dashboard" />;
}
