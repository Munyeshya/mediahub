// src/pages/dashboard/ManageGivers.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// 💥 NEW: Import Link from react-router-dom
import { Link } from 'react-router-dom'; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
// 💥 REMOVED: Dialog imports
import { Eye, CheckCircle, Ban, Search, Info, RotateCw } from 'lucide-react'; 

// Import the database functions
import { fetchGivers, updateGiverStatus } from '../../logic/db'; 

// Helper to determine badge style (no change)
const getStatusBadge = (status) => {
    switch (status) {
        case 'Active':
            return <Badge className="bg-green-600 hover:bg-green-700 text-white">Active</Badge>;
        case 'Pending':
            return <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-900/10">Pending Verification</Badge>;
        case 'Suspended':
            return <Badge className="bg-red-600 hover:bg-red-700 text-white">Suspended</Badge>;
        default:
            return <Badge variant="secondary">Unknown</Badge>;
    }
};

export function ManageGivers() {
    const [givers, setGivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 💥 REMOVED: View Modal state (viewGiver, isViewModalOpen)

    // EFFECT: Fetch data on component mount (no change)
    useEffect(() => {
        const loadGivers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchGivers();
                setGivers(data);
            } catch (err) {
                setError(err.message);
                toast.error(`Error loading givers: ${err.message}`, { theme: "dark" });
            } finally {
                setIsLoading(false);
            }
        };

        loadGivers();
    }, []); 
    
    // Unified Action Handler (no change in logic, only updated to remove optimistic 'Updating...' state for simplicity)
    const handleAction = async (id, action) => {
        const newStatus = action === 'Approve' ? 'Active' : (action === 'Suspend' ? 'Suspended' : 'Active');
        const giverToUpdate = givers.find(g => g.id === id);

        if (!giverToUpdate) return;
        
        const originalStatus = giverToUpdate.status;

        try {
            // 1. Call the database function
            await updateGiverStatus(id, newStatus);

            // 2. Finalize local state update on success
            setGivers(prevGivers => 
                prevGivers.map(giver => 
                    giver.id === id ? { ...giver, status: newStatus } : giver
                )
            );

            // 3. Show Toast Notification
            const message = action === 'Approve' 
                ? `✅ Giver ${giverToUpdate.name} has been approved and is now Active.` 
                : `❌ Giver ${giverToUpdate.name} has been suspended.`;
            
            toast.success(message, {
                position: "bottom-right",
                theme: "dark",
                autoClose: 3000,
            });

        } catch (err) {
            // Revert state on failure
            setGivers(prevGivers => 
                prevGivers.map(giver => 
                    giver.id === id ? { ...giver, status: originalStatus } : giver
                )
            );
            toast.error(`Action failed for ${giverToUpdate.name}: ${err.message}`, { theme: "dark" });
        }
    };

    // 💥 REMOVED: handleView function

    // Rendering Logic for Loading/Error (no change)
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-40 text-amber-500">
                    <RotateCw className="w-8 h-8 animate-spin mr-3" />
                    <p className="text-xl">Loading Givers...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-8 text-red-500 bg-red-900/10 rounded-lg border border-red-700">
                    <h3 className="text-lg font-bold mb-2">Data Fetch Error</h3>
                    <p>{error}</p>
                </div>
            );
        }

        if (givers.length === 0) {
            return (
                <div className="text-center p-8 text-gray-400 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-bold">No Givers Found</h3>
                    <p>The system has no creative accounts to display.</p>
                </div>
            );
        }

        // --- Main Table Render ---
        return (
            <Table>
                <TableCaption className="text-gray-400">A list of all registered creative accounts.</TableCaption>
                <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-700/50 text-gray-300">
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {givers.map((giver) => (
                        <TableRow key={giver.id} className="border-gray-700 hover:bg-gray-800/50">
                            <TableCell className="font-medium text-gray-300">{giver.id}</TableCell>
                            <TableCell className="text-white">{giver.name}</TableCell>
                            <TableCell className="text-gray-400">{giver.email}</TableCell>
                            <TableCell className="text-gray-300">{giver.service}</TableCell>
                            <TableCell>{getStatusBadge(giver.status)}</TableCell>
                            <TableCell className="text-right space-x-2">
                                
                                {/* 💥 CRITICAL CHANGE: Use Link to navigate to the details page */}
                                <Link to={`/dashboard/admin/givers/${giver.id}`} >
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                
                                {/* APPROVE BUTTON */}
                                {giver.status === 'Pending' && (
                                    <Button 
                                        size="icon" 
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleAction(giver.id, 'Approve')}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                )}
                                
                                {/* SUSPEND/ACTIVATE TOGGLE */}
                                {giver.status !== 'Suspended' ? (
                                    // Suspend button for Active/Pending Givers
                                    <Button 
                                        size="icon" 
                                        variant="destructive"
                                        onClick={() => handleAction(giver.id, 'Suspend')}
                                    >
                                        <Ban className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    // Reactivate button for Suspended Givers
                                    <Button 
                                        size="icon" 
                                        className="bg-purple-600 hover:bg-purple-700"
                                        onClick={() => handleAction(giver.id, 'Approve')} 
                                    >
                                        <Info className="h-4 w-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Manage Creative Accounts</h2>
            
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl text-white">Giver List ({givers.length})</CardTitle>
                    <div className="flex space-x-2">
                        <div className="relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input placeholder="Search Givers..." className="pl-10 bg-gray-700 border-gray-600 text-white" />
                        </div>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-gray-900">
                            View Pending ({givers.filter(g => g.status === 'Pending').length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>

            {/* 💥 REMOVED: The Giver Details Dialog/Modal structure is deleted */}
            
        </div>
    );
}