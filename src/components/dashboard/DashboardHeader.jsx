// src/components/dashboard/DashboardHeader.jsx
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader({ title = "Dashboard" }) {
    return (
        <header className="sticky top-0 z-10 w-full p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center shadow-lg">
            <h1 className="text-2xl font-bold text-amber-500">{title}</h1>
            
            <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                    <Settings className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2 text-gray-300">
                    <User className="h-5 w-5" />
                    <span>User Name (Role)</span>
                </div>
            </div>
        </header>
    );
}