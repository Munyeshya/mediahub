// src/pages/dashboard/ManageGivers.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
// 💥 NEW: Select component for filters
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, CheckCircle, Ban, Search, Info, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

import { fetchGivers, updateGiverStatus } from '../../logic/db';

// --- CONFIGURATION CONSTANTS ---
const ITEMS_PER_PAGE = 5; // Number of rows to show per page
const STATUS_OPTIONS = ['All', 'Active', 'Pending', 'Suspended'];
const SERVICE_OPTIONS = ['All', 'Photographer', 'Videographer', 'Music Producer', 'Graphic Designer', '3D Modeler'];
// -----------------------------

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
    // Core Data States
    const [givers, setGivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 💥 Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [serviceFilter, setServiceFilter] = useState('All');

    // 💥 Pagination States
    const [currentPage, setCurrentPage] = useState(1);

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

    // 💥 Memoized Logic for Filtering and Pagination
    const filteredAndPaginatedGivers = useMemo(() => {
        let filteredGivers = givers;

        // 1. Apply Status Filter
        if (statusFilter !== 'All') {
            filteredGivers = filteredGivers.filter(g => g.status === statusFilter);
        }

        // 2. Apply Service Filter
        if (serviceFilter !== 'All') {
            filteredGivers = filteredGivers.filter(g => g.service === serviceFilter);
        }

        // 3. Apply Search Term (Name or Email)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filteredGivers = filteredGivers.filter(
                g => g.name.toLowerCase().includes(lowerCaseSearch) ||
                    g.email.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // --- PAGINATION CALCULATION ---
        const totalItems = filteredGivers.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        // Ensure the current page is valid after filtering
        const safeCurrentPage = Math.min(currentPage, totalPages > 0 ? totalPages : 1);

        const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        const paginatedGivers = filteredGivers.slice(startIndex, endIndex);

        return {
            paginatedGivers,
            totalItems,
            totalPages,
            safeCurrentPage // Return the safe, adjusted page number
        };
    }, [givers, statusFilter, serviceFilter, searchTerm, currentPage]);

    const { paginatedGivers, totalItems, totalPages, safeCurrentPage } = filteredAndPaginatedGivers;

    // Handler to change page (used by buttons and filter change)
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset page to 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, serviceFilter]);


    const handleAction = async (id, action) => {
        const newStatus = action === 'Approve' ? 'Active' : (action === 'Suspend' ? 'Suspended' : 'Active');
        const giverToUpdate = givers.find(g => g.id === id);

        if (!giverToUpdate) return;
        const originalStatus = giverToUpdate.status;

        try {
            // Call the database function
            await updateGiverStatus(id, newStatus);

            // Finalize local state update on success
            setGivers(prevGivers =>
                prevGivers.map(giver =>
                    giver.id === id ? { ...giver, status: newStatus } : giver
                )
            );

            // Show Toast Notification
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

        if (totalItems === 0) {
            return (
                <div className="text-center p-8 text-gray-400 bg-gray-700/50 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-bold">No Givers Found</h3>
                    <p>No creative accounts matched your current filters.</p>
                </div>
            );
        }

        // --- Main Table Render ---
        return (
            <Table>
                <TableCaption className="text-gray-400">Showing {paginatedGivers.length} of {totalItems} filtered creatives.</TableCaption>
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
                    {paginatedGivers.map((giver) => (
                        <TableRow key={`${giver.id}-${giver.service}`} className="border-gray-700 hover:bg-gray-800/50">
                            <TableCell className="font-medium text-gray-300">{giver.id}</TableCell>
                            <TableCell className="text-white">{giver.name}</TableCell>
                            <TableCell className="text-gray-400">{giver.email}</TableCell>
                            <TableCell className="text-gray-300">{giver.services || '—'}</TableCell>
                            <TableCell>{getStatusBadge(giver.status)}</TableCell>
                            <TableCell className="text-right space-x-2">

                                {/* VIEW BUTTON - Link to Details Page */}
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
                <CardHeader className="flex flex-col space-y-4">
                    <CardTitle className="text-xl text-white">Giver List</CardTitle>

                    {/* 💥 FILTER BAR */}
                    <div className="flex flex-col sm:flex-row gap-4">

                        {/* Search Input */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-700 border-gray-600 text-white w-full"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                {STATUS_OPTIONS.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Service Filter */}
                        <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Filter by Service" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                {SERVICE_OPTIONS.map(service => (
                                    <SelectItem key={service} value={service}>{service}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {renderContent()}

                    {/* 💥 PAGINATION CONTROLS */}
                    {totalItems > 0 && totalPages > 1 && (
                        <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-4">
                            <p className="text-sm text-gray-400">
                                Page {safeCurrentPage} of {totalPages}
                            </p>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                                    disabled={safeCurrentPage === 1}
                                    className="text-amber-500 border-amber-500 hover:bg-amber-900/20"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                                    disabled={safeCurrentPage === totalPages}
                                    className="text-amber-500 border-amber-500 hover:bg-amber-900/20"
                                >
                                    Next <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}