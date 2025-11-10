import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, RotateCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

/* -----------------------------------------------------------------
   💥 NEW: Real API calls to backend /api/admin/services endpoints
------------------------------------------------------------------- */

const API_BASE = "http://localhost:3001/api/admin";

async function fetchServices() {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    return await res.json();
}

async function addService(service) {
    const res = await fetch(`${API_BASE}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
    });
    if (!res.ok) throw new Error(`Add failed: ${res.status}`);
    return await res.json();
}

async function updateService(id, service) {
    const res = await fetch(`${API_BASE}/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
    });
    if (!res.ok) throw new Error(`Update failed: ${res.status}`);
    return await res.json();
}

async function deleteService(id) {
    const res = await fetch(`${API_BASE}/services/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
    return await res.json();
}

/* -----------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------- */

export function ManageServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [serviceForm, setServiceForm] = useState({ name: '', description: '', active: true });

    // --- Fetch services ---
    const loadServices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchServices();
            setServices(data);
        } catch (err) {
            setError(err.message);
            toast.error(`Error loading services: ${err.message}`, { theme: "dark" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadServices(); }, []);

    // --- Modal controls ---
    const handleOpenModal = (service = null) => {
        setCurrentService(service);
        setServiceForm(service ? { 
            name: service.name, 
            description: service.description, 
            active: !!service.active 
        } : { name: '', description: '', active: true });
        setIsModalOpen(true);
    };

    // --- Save (Add or Edit) ---
    const handleSaveService = async (e) => {
        e.preventDefault();
        if (!serviceForm.name || !serviceForm.description) {
            toast.error("Name and description are required.", { theme: "dark" });
            return;
        }
        try {
            let result;
            if (currentService) {
                result = await updateService(currentService.id, serviceForm);
                setServices(services.map(s => s.id === result.id ? result : s));
                toast.success(`Service '${result.name}' updated successfully.`, { theme: "dark" });
            } else {
                result = await addService(serviceForm);
                setServices([...services, result]);
                toast.success(`New service '${result.name}' added successfully.`, { theme: "dark" });
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(`Failed to save service: ${err.message}`, { theme: "dark" });
        }
    };

    // --- Delete handler ---
    const handleDelete = async (id, name) => {
        try {
            await deleteService(id);
            setServices(services.filter(s => s.id !== id));
            toast.success(`Service '${name}' deleted successfully.`, { theme: "dark" });
        } catch (err) {
            toast.error(`Failed to delete service: ${err.message}`, { theme: "dark" });
        }
    };

    // --- Render Table ---
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

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {currentService ? 'Edit Service' : 'Add New Service'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSaveService} className="grid gap-4 py-4">
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
