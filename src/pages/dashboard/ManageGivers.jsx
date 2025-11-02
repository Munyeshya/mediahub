// src/pages/dashboard/ManageGivers.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Ban, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Placeholder Data for Givers
const dummyGivers = [
    { id: 101, name: "Alice Murenzi", email: "alice@creative.com", service: "Videographer", status: "Pending", joined: "2024-09-15" },
    { id: 102, name: "Bob Rwanda Beats", email: "bob@beats.com", service: "Music Producer", status: "Active", joined: "2023-11-01" },
    { id: 103, name: "Clara Photos", email: "clara@photos.com", service: "Photographer", status: "Suspended", joined: "2024-01-20" },
    { id: 104, name: "David Designer", email: "david@design.com", service: "Graphic Designer", status: "Pending", joined: "2024-10-25" },
];

// Helper to determine badge style
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
    // In a real app, you would fetch givers here:
    // const [givers, setGivers] = useState([]);
    // useEffect(() => { fetchGivers().then(setGivers); }, []);
    
    const handleAction = (id, action) => {
        // Implement API call here to update giver status
        console.log(`Performing ${action} on Giver ID: ${id}`);
        // After successful API call, you would update the givers state.
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Manage Creative Accounts</h2>
            
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl text-white">Giver List ({dummyGivers.length})</CardTitle>
                    <div className="flex space-x-2">
                        <div className="relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input placeholder="Search Givers..." className="pl-10 bg-gray-700 border-gray-600 text-white" />
                        </div>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-gray-900">
                            View Pending (2)
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
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
                            {dummyGivers.map((giver) => (
                                <TableRow key={giver.id} className="border-gray-700 hover:bg-gray-800/50">
                                    <TableCell className="font-medium text-gray-300">{giver.id}</TableCell>
                                    <TableCell className="text-white">{giver.name}</TableCell>
                                    <TableCell className="text-gray-400">{giver.email}</TableCell>
                                    <TableCell className="text-gray-300">{giver.service}</TableCell>
                                    <TableCell>{getStatusBadge(giver.status)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {giver.status === 'Pending' && (
                                            <Button 
                                                size="icon" 
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleAction(giver.id, 'Approve')}
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {giver.status !== 'Suspended' && (
                                            <Button 
                                                size="icon" 
                                                variant="destructive"
                                                onClick={() => handleAction(giver.id, 'Suspend')}
                                            >
                                                <Ban className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}