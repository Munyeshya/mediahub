// src/components/dashboard/DashboardMetricCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardMetricCard({ title, value, icon: Icon, description, color = 'text-amber-500' }) {
    // Helper function to format large numbers (RWF)
    const formatValue = (val) => {
        if (typeof val === 'number') {
            return val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : val.toLocaleString();
        }
        return val;
    };

    return (
        <Card className="bg-gray-800 border-gray-700 hover:border-amber-500 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white">
                    {title.includes('Revenue') ? `RWF ${formatValue(value)}` : formatValue(value)}
                </div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}