// src/components/dashboard/DashboardSidebar.jsx
import { Link } from 'react-router-dom';
import { MountainIcon, LayoutDashboard, Briefcase, Users, DollarSign, Settings } from 'lucide-react';

export function DashboardSidebar({ role = 'Client' }) {
    
    // Define links based on role (this will be customized later)
    const links = {
        Admin: [
            { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin' },
            { icon: Briefcase, label: 'Manage Services', path: '/dashboard/admin/services' },
            { icon: Users, label: 'Manage Givers', path: '/dashboard/admin/givers' },
            { icon: Settings, label: 'System Settings', path: '/dashboard/admin/settings' },
        ],
        Client: [
            { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/client' },
            { icon: Briefcase, label: 'My Bookings', path: '/dashboard/client/bookings' },
            { icon: Users, label: 'Saved Creatives', path: '/dashboard/client/favorites' },
            { icon: Settings, label: 'Account', path: '/dashboard/client/settings' },
        ],
        Giver: [
            { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/giver' },
            { icon: Briefcase, label: 'My Services', path: '/dashboard/giver/services' },
            { icon: DollarSign, label: 'Earnings', path: '/dashboard/giver/earnings' },
            { icon: Settings, label: 'Profile Settings', path: '/dashboard/giver/settings' },
        ],
    };

    const currentLinks = links[role] || links.Client;

    return (
        <aside className="w-64 flex-shrink-0 h-screen bg-gray-900 border-r border-gray-800 p-4 sticky top-0">
            <div className="mb-8 flex items-center justify-center space-x-2">
                <MountainIcon className="h-7 w-7 text-amber-500" />
                <span className="text-xl font-bold text-white">MediaHub</span>
            </div>
            
            <nav className="space-y-2">
                {currentLinks.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-amber-500 transition-colors duration-200"
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}