// src/components/dashboard/DashboardCharts.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line,ComposedChart,Area  } from 'recharts';

const chartStyles = {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    color: '#D1D5DB' // text-gray-300
};

// -----------------------------------------------------------------
// 1. MONTHLY REVENUE LINE CHART
// -----------------------------------------------------------------
export function MonthlyRevenueChart({ data }) {
    const formatRWF = (tick) => `RWF ${ (tick / 1000000).toFixed(1) }M`;
    
    return (
        <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
                <CardTitle className="text-xl text-white">Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} style={chartStyles} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" tickFormatter={formatRWF} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} formatter={(value) => [`RWF ${value.toLocaleString()}`, 'Revenue']} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// -----------------------------------------------------------------
// 2. GIVER STATUS PIE CHART
// -----------------------------------------------------------------
export function GiverStatusPieChart({ data }) {
    const total = data.reduce((sum, entry) => sum + entry.count, 0);
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
        
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
                <CardTitle className="text-xl text-white">Giver Verification Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart style={chartStyles}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="count"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} formatter={(value, name, props) => [`${value} Givers`, props.payload.status]} />
                        <Legend align="right" verticalAlign="middle" layout="vertical" wrapperStyle={{ paddingLeft: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// -----------------------------------------------------------------
// 3. SERVICE USAGE BAR CHART
// -----------------------------------------------------------------
export function ServiceUsageBarChart({ data }) {
    return (
        <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
                <CardTitle className="text-xl text-white">Top 5 Services by Bookings</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} style={chartStyles} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="service" stroke="#9CA3AF" interval={0} angle={-15} textAnchor="end" height={45} />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} formatter={(value) => [`${value} Bookings`, 'Total']} />
                        <Bar dataKey="bookings" fill="#4B5563" activeBar={{ fill: "#FBBF24" }} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// -----------------------------------------------------------------
// 4. PLATFORM USAGE GROWTH CHART (Revenue + Bookings + Clients)
// -----------------------------------------------------------------
export function PlatformUsageChart({ data }) {
    const formatRWF = (tick) => `RWF ${(tick / 1000000).toFixed(1)}M`;

    return (
        <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
                <CardTitle className="text-xl text-white">Platform Usage Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis
                            yAxisId="left"
                            stroke="#9CA3AF"
                            label={{
                                value: 'Bookings / Clients',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#9CA3AF',
                            }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#9CA3AF"
                            tickFormatter={formatRWF}
                            label={{
                                value: 'Revenue (RWF)',
                                angle: 90,
                                position: 'insideRight',
                                fill: '#9CA3AF',
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #4B5563',
                            }}
                            formatter={(value, name) => {
                                if (name === 'revenue')
                                    return [`RWF ${value.toLocaleString()}`, 'Revenue'];
                                return [value, name === 'bookings' ? 'Bookings' : 'New Clients'];
                            }}
                        />
                        <Legend />
                        {/* Bookings as bars */}
                        <Bar
                            yAxisId="left"
                            dataKey="bookings"
                            name="Bookings"
                            fill="#FBBF24"
                            barSize={16}
                        />
                        {/* New clients as area */}
                        <Area
                            yAxisId="left"
                            dataKey="newClients"
                            name="New Clients"
                            type="monotone"
                            stroke="#34D399"
                            fill="#34D399"
                            fillOpacity={0.25}
                        />
                        {/* Revenue as line */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue (RWF)"
                            stroke="#60A5FA"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
