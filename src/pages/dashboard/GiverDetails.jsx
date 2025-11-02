// src/pages/dashboard/GiverDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RotateCw, ArrowLeft, User, Mail, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// You will need to add a fetchGiverDetails function to your db.js
// For now, we'll mock it here:
const mockFetchGiverDetails = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    if (id == 999) throw new Error("Giver not found.");
    
    return {
        id: id,
        name: `Creative User ${id}`,
        email: `user_${id}@creativehub.com`,
        service: id % 2 === 0 ? "Photographer" : "Videographer",
        status: id % 3 === 0 ? "Suspended" : (id % 5 === 0 ? "Pending" : "Active"),
        joined: "2024-01-20",
        bio: "Experienced creative specializing in high-end corporate video production and drone cinematography. Based in Kigali.",
        portfolioLink: `https://portfolio.com/${id}`,
        documents: ['ID Scan.pdf', 'Service Contract.docx'],
        reviews: 45,
        rating: 4.8,
    };
};

// Helper to determine badge style (reused from ManageGivers)
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

export function GiverDetails() {
    const { giverId } = useParams(); // Get the dynamic ID from the URL
    const navigate = useNavigate();
    const [giver, setGiver] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 💥 In your real app, replace this mock call with the function from db.js
                const data = await mockFetchGiverDetails(giverId); 
                setGiver(data);
            } catch (err) {
                setError(err.message);
                toast.error(`Error loading details: ${err.message}`, { theme: "dark" });
            } finally {
                setIsLoading(false);
            }
        };

        loadDetails();
    }, [giverId]);

    const renderDetails = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-60 text-amber-500">
                    <RotateCw className="w-8 h-8 animate-spin mr-3" />
                    <p className="text-xl">Loading Giver Profile...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-8 text-red-500 bg-red-900/10 rounded-lg border border-red-700">
                    <h3 className="text-lg font-bold mb-2">Error</h3>
                    <p>{error}</p>
                </div>
            );
        }

        if (!giver) {
            return <p className="text-gray-400">No data found for this Giver.</p>;
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Primary Profile Card */}
                <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                    <CardHeader className="border-b border-gray-700 pb-4">
                        <CardTitle className="text-white flex items-center space-x-2">
                            <User className="w-6 h-6 text-amber-500" />
                            <span>{giver.name}</span>
                            {getStatusBadge(giver.status)}
                        </CardTitle>
                        <p className="text-gray-400 text-sm flex items-center space-x-1">
                            <Mail className="w-4 h-4" /> <span>{giver.email}</span>
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 text-gray-300">
                        <h4 className="text-xl font-semibold text-amber-500">Biography</h4>
                        <p className="border-l-4 border-gray-600 pl-4 italic text-gray-400">
                            {giver.bio}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4 mt-4">
                            <div><p className="font-semibold text-white">Service Type:</p> <p>{giver.service}</p></div>
                            <div><p className="font-semibold text-white">Member Since:</p> <p>{giver.joined}</p></div>
                            <div><p className="font-semibold text-white">Rating / Reviews:</p> <p className='text-amber-500'>{giver.rating} ({giver.reviews})</p></div>
                            <div><p className="font-semibold text-white">Portfolio Link:</p> 
                                <a href={giver.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors truncate block max-w-[200px]">{giver.portfolioLink.replace('https://', '')}</a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Documents & Actions Card */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center space-x-2">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <span>Verification & Files</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-300">Uploaded Documents:</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                                {giver.documents.map((doc, index) => (
                                    <li key={index} className="text-sm">
                                        <a href="#" className="text-blue-400 hover:text-blue-300">{doc}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-700 space-y-3">
                            <h4 className="font-semibold text-white">Administrative Actions:</h4>
                            <Button className="w-full bg-red-600 hover:bg-red-700">Suspend/Ban Account</Button>
                            <Button variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-900/10">Approve Verification</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Button 
                variant="ghost" 
                onClick={() => navigate(-1)} // Go back to the Givers List
                className="text-amber-500 hover:bg-gray-800"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Giver List
            </Button>
            
            <h2 className="text-3xl font-bold text-white">Giver Profile: {giverId}</h2>
            
            {renderDetails()}
        </div>
    );
}