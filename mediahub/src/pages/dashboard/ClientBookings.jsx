import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye } from "lucide-react";
import { useAuth } from "@/logic/auth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ClientBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = user?.id
    ? `http://localhost:3001/api/client/${user.id}/bookings`
    : null;

  useEffect(() => {
    if (!API_URL) return;

    const loadBookings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch bookings.");
        const json = await res.json();
        setBookings(json);
        setFiltered(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [API_URL]);

  // Filter logic
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "All") setFiltered(bookings);
    else setFiltered(bookings.filter((b) => b.status === status));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-600 text-white">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500 text-gray-900">Pending</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-600 text-white">In Progress</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-600 text-white">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-amber-500">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/10 border border-red-700 rounded-lg p-6">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <p>No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl text-white">My Bookings</CardTitle>

          <div className="flex space-x-2">
            {["All", "Pending", "In Progress", "Completed", "Cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    statusFilter === status
                      ? "bg-amber-500 text-gray-900"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-gray-300">
            <thead className="border-b border-gray-700 text-left">
              <tr>
                <th className="py-2">Service</th>
                <th className="py-2">Creative</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-center">Amount</th>
                <th className="py-2 text-center">Start</th>
                <th className="py-2 text-center">End</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.booking_id}
                  className="border-b border-gray-800 hover:bg-gray-700/50"
                >
                  <td className="py-2">{b.service_name}</td>
                  <td className="py-2">{b.giver_email}</td>
                  <td className="py-2">{getStatusBadge(b.status)}</td>
                  <td className="py-2 text-center">
                    RWF {Number(b.total_price_RWF).toLocaleString()}
                  </td>
                  <td className="py-2 text-center">
                    {b.start_date
                      ? new Date(b.start_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 text-center">
                    {b.end_date
                      ? new Date(b.end_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 text-right">
                    <Link to={`/dashboard/client/bookings/${b.booking_id}`}>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-amber-500 text-amber-500 hover:bg-amber-900/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
