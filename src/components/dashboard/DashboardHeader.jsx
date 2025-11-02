// src/components/dashboard/DashboardHeader.jsx (A11y Compliant with SheetTitle)
import { Bell, Settings, User, Menu } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"; // 💥 Imported SheetTitle/Description
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardHeader({ title = "Dashboard", role = "Admin" }) {

    // Tailwind CSS Utility for Visually Hiding Content (Commonly used in Shadcn projects)
    const visuallyHidden = "sr-only"; 

    return (
        <header className="sticky top-0 z-20 w-full p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center shadow-lg">
            
            {/* 1. Mobile Menu / Title */}
            <div className="flex items-center space-x-4">
                {/* 💥 SHEET TRIGGER: Visible only on small screens */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
                            <Menu className="h-6 w-6" />
                            <span className={visuallyHidden}>Open Sidebar Menu</span> {/* A11y for the button */}
                        </Button>
                    </SheetTrigger>
                    
                    <SheetContent side="left" className="p-0 border-r-0 bg-gray-900 w-64">
                        
                        {/* 💥 A11y Fix: Add SheetTitle and SheetDescription, visually hidden */}
                        <SheetTitle className={visuallyHidden}>
                            {role} Dashboard Navigation
                        </SheetTitle>
                        <SheetDescription className={visuallyHidden}>
                            Use this sidebar to navigate between sections of the {role} dashboard.
                        </SheetDescription>
                        
                        {/* The sidebar content inside the mobile sheet */}
                        <DashboardSidebar role={role} isMobile={true} /> 
                    </SheetContent>
                </Sheet>
                
                {/* Title: Remains visible */}
                <h1 className="text-xl md:text-2xl font-bold text-amber-500">{title}</h1>
            </div>
            
            {/* 2. Right Side Icons (User Menu, Notifications, etc.) */}
            <div className="flex items-center space-x-2 md:space-x-4">
                
                {/* Notification Button */}
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className={visuallyHidden}>Notifications</span>
                </Button>
                
                {/* Settings Button */}
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-gray-400 hover:text-white">
                    <Settings className="h-5 w-5" />
                    <span className={visuallyHidden}>Settings</span>
                </Button>
                
                {/* User Info */}
                <div className="flex items-center space-x-1 md:space-x-2 text-gray-300">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block text-sm">User Name ({role})</span> 
                </div>
            </div>
        </header>
    );
}