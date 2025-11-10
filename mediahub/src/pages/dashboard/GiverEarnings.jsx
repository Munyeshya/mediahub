import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { RotateCw, DollarSign, TrendingUp } from "lucide-react";
import { useAuth } from "@/logic/auth";
import { toast } from "react-toastify";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function GiverEarnings() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, avg: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadEarnings = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/giver/${user.id}/earnings`);
        if (!res.ok) throw new Error("Failed to fetch earnings data.");
        const json = await res.json();

        // Compute totals and average
        const total = json.reduce((sum, m) => sum + Number(m.total_earnings), 0);
        const avg = json.length ? total / json.length : 0;

        setData(json);
        setSummary({ total, avg });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEarnings();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-amber-500">
        <RotateCw className="h-6 w-6 animate-spin mr-3" />
        <p>Loading earnings data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <p>No earnings data found yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
        <DollarSign className="h-7 w-7 text-amber-500" />
        <span>My Earnings</span>
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-green-400">
              <DollarSign className="h-5 w-5 mr-2" /> Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              RWF {summary.total.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-400">
              <TrendingUp className="h-5 w-5 mr-2" /> Average per Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">
              RWF {summary.avg.toFixed(0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Monthly Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  border: "1px solid #555",
                  color: "#fff",
                }}
                formatter={(value) => [`RWF ${Number(value).toLocaleString()}`, "Earnings"]}
              />
              <Line
                type="monotone"
                dataKey="total_earnings"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#fbbf24", strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
