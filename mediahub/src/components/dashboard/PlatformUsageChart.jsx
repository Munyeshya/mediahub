// src/pages/PlatformUsageChart.jsx
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchUsage } from '@/logic/usageClient'; // small helper (below) or call fetch directly

export default function PlatformUsageChart({ months = 12 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/usage?months=${months}`);
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        // json.usage is expected as array: [{month, revenue, bookings, newClients}, ...]
        if (mounted) setData(json.usage || []);
      } catch (err) {
        console.error('PlatformUsageChart load error', err);
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [months]);

  if (loading) return <div className="p-4 text-sm text-gray-400">Loading usage chart...</div>;
  if (!data || data.length === 0) return <div className="p-4 text-sm text-gray-400">No usage data available.</div>;

  // Optional: normalize month labels for small screens (e.g., 'May' instead of 'May 2025')
  const chartData = data.map(d => ({
    ...d,
    monthLabel: d.month.replace(/\s+\d{4}$/, '') // remove year for compactness
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
      <h3 className="text-white font-semibold mb-2">Platform usage growth</h3>
      <p className="text-sm text-gray-400 mb-4">Bookings, new clients and revenue over the last {months} months.</p>

      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
            <XAxis dataKey="monthLabel" tick={{ fill: '#cbd5e1' }} />
            <YAxis yAxisId="left" tick={{ fill: '#cbd5e1' }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v/1000)|0}k`} tick={{ fill: '#cbd5e1' }} />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'revenue') return [new Intl.NumberFormat().format(value), 'Revenue (RWF)'];
                return [value, name.charAt(0).toUpperCase() + name.slice(1)];
              }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ color: '#cbd5e1' }} />
            {/* Bookings as bars */}
            <Bar yAxisId="left" dataKey="bookings" name="Bookings" barSize={14} fill="#f59e0b" />
            {/* New clients as area */}
            <Area yAxisId="left" dataKey="newClients" name="New Clients" fill="#34d399" stroke="#10b981" fillOpacity={0.16} />
            {/* Revenue as line, plotted on right axis */}
            <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue (RWF)" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
