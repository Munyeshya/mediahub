// src/pages/dashboard/ManageServices.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, RotateCw } from 'lucide-react'; 

// 💥 New: Imports for Dialog/Modal
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

// Assuming you add these functions to your db.js (see next step)
// import { fetchServices, addService, updateService, deleteService } from '../../logic/db'; 

// Mock DB functions for immediate testing
const mockFetchServices = async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return [
        { id: 1, name: "Videographer", description: "All forms of video production, editing, and cinematography.", active: true },
        { id: 2, name: "Photographer", description: "Studio and event photography, retouching, and drone stills.", active: true },
        { id: 3, name: "Music Producer", description: "Beat making, mixing, and mastering for all genres.", active: true },
        { id: 4, name: "Graphic Designer", description: "Logo design, branding, and digital asset creation.", active: false },
    ];
};

const mockUpdateService = async (service) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return service; 
};

const mockAddService = async (newService) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return { ...newService, id: Math.floor(Math.random() * 1000) + 100 }; 
};


export function ManageServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for the Add/Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null); // Null for Add, object for Edit
    const [serviceForm, setServiceForm] = useState({ name: '', description: '', active: true });

    // --- Data Fetching ---
    const loadServices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 💥 Replace with your actual fetchServices function from db.js
            const data = await mockFetchServices(); 
            setServices(data);
        } catch (err) {
            setError(err.message);
            toast.error(`Error loading services: ${err.message}`, { theme: "dark" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    // --- Handlers for CRUD ---
    const handleOpenModal = (service = null) => {
        setCurrentService(service);
        if (service) {
            setServiceForm({ name: service.name, description: service.description, active: service.active });
        } else {
            setServiceForm({ name: '', description: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        
        if (!serviceForm.name || !serviceForm.description) {
            toast.error("Name and description are required.", { theme: "dark" });
            return;
        }

        try {
            let result;
            if (currentService) {
                // 💥 EDIT
                // Replace with your actual updateService function
                result = await mockUpdateService({ ...currentService, ...serviceForm }); 
                
                setServices(services.map(s => s.id === result.id ? result : s));
                toast.success(`Service '${result.name}' updated successfully.`, { theme: "dark" });
            } else {
                // 💥 ADD
                // Replace with your actual addService function
                result = await mockAddService(serviceForm); 
                
                setServices([...services, result]);
                toast.success(`New service '${result.name}' added successfully.`, { theme: "dark" });
            }
            
            setIsModalOpen(false);
        } catch (err) {
            toast.error(`Failed to save service: ${err.message}`, { theme: "dark" });
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete the service '${name}'? This cannot be undone!`)) {
            return;
        }

        try {
            // 💥 Replace with your actual deleteService function
            await new Promise(resolve => setTimeout(resolve, 500)); // mockDeleteService(id); 
            
            setServices(services.filter(s => s.id !== id));
            toast.success(`Service '${name}' deleted successfully.`, { theme: "dark" });
        } catch (err) {
            toast.error(`Failed to delete service: ${err.message}`, { theme: "dark" });
        }
    };

    // --- Render Logic ---
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-40 text-amber-500">
                    <RotateCw className="w-8 h-8 animate-spin mr-3" />
                    <p className="text-xl">Loading Services...</p>
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

        return (
            <Table>
                <TableCaption className="text-gray-400">List of all creative service categories.</TableCaption>
                <TableHeader>
                    <TableRow className="border-gray-700 text-gray-300">
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Service Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service) => (
                        <TableRow key={service.id} className="border-gray-700 hover:bg-gray-800/50">
                            <TableCell className="font-medium text-gray-300">{service.id}</TableCell>
                            <TableCell className="text-white">{service.name}</TableCell>
                            <TableCell className="text-gray-400 max-w-xs truncate">{service.description}</TableCell>
                            <TableCell>
                                <span className={`px-3 py-1 text-xs rounded-full ${service.active ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {service.active ? 'Yes' : 'No'}
                                </span>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button 
                                    size="icon" 
                                    variant="outline"
                                    className="border-blue-500 text-blue-500 hover:bg-blue-900/20"
                                    onClick={() => handleOpenModal(service)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    variant="destructive"
                                    onClick={() => handleDelete(service.id, service.name)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Manage System Services</h2>
            
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl text-white">Service List ({services.length})</CardTitle>
                    <Button 
                        className="bg-amber-500 hover:bg-amber-600 text-gray-900"
                        onClick={() => handleOpenModal(null)}
                    >
                        <Plus className="h-5 w-5 mr-2" /> Add New Service
                    </Button>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>

            {/* ADD/EDIT SERVICE DIALOG/MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {currentService ? 'Edit Service' : 'Add New Service'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSaveService} className="grid gap-4 py-4">
                        {/* Name Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input 
                                id="name" 
                                value={serviceForm.name} 
                                onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                                className="col-span-3 bg-gray-700 border-gray-600 text-white" 
                                required
                            />
                        </div>
                        
                        {/* Description Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input 
                                id="description" 
                                value={serviceForm.description} 
                                onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                                className="col-span-3 bg-gray-700 border-gray-600 text-white" 
                                required
                            />
                        </div>

                        {/* Status Toggle (Simple Checkbox for Active) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="active" className="text-right">Active</Label>
                            <input
                                id="active"
                                type="checkbox"
                                checked={serviceForm.active}
                                onChange={(e) => setServiceForm({...serviceForm, active: e.target.checked})}
                                className="h-5 w-5 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                            />
                        </div>
                        
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-700">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-gray-900">
                                {currentService ? 'Save Changes' : 'Create Service'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}