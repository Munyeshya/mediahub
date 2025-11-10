import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCw, Edit, Save, Eye, EyeOff, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/logic/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function GiverServices() {
  const { user } = useAuth(); // giver_id
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Add Service Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [newService, setNewService] = useState({
    service_id: "",
    base_unit: "",
    price_RWF: "",
  });

  const API_URL = user?.id
    ? `http://localhost:3001/api/giver/${user.id}/services`
    : null;

  // --- Load giver's services ---
  useEffect(() => {
    if (!API_URL) return;

    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch services.");
        const json = await res.json();
        setServices(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [API_URL]);

  // --- Fetch service types for dropdown ---
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/service-types");
        if (!res.ok) throw new Error("Failed to load service types.");
        const json = await res.json();
        setServiceTypes(json);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTypes();
  }, []);

  // --- Save updated price ---
  const handleSave = async (serviceId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/giver/${user.id}/services/${serviceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price_RWF: updatedPrice }),
        }
      );

      if (!res.ok) throw new Error("Failed to update price.");
      toast.success("Service price updated successfully! 💰");

      setServices((prev) =>
        prev.map((s) =>
          s.service_id === serviceId ? { ...s, price_RWF: updatedPrice } : s
        )
      );

      setIsEditing(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // --- Toggle visibility ---
  const toggleVisibility = async (serviceId, currentState) => {
    try {
      const newState = currentState ? 0 : 1;
      const res = await fetch(
        `http://localhost:3001/api/giver/${user.id}/services/${serviceId}/visibility`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: newState }),
        }
      );

      if (!res.ok) throw new Error("Failed to update visibility.");
      toast.success(
        newState ? "Service is now active (visible)." : "Service is now hidden."
      );

      setServices((prev) =>
        prev.map((s) =>
          s.service_id === serviceId ? { ...s, is_active: newState } : s
        )
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // --- Add new service ---
  const handleAddService = async () => {
    if (!newService.service_id || !newService.price_RWF) {
      return toast.error("Please fill all fields.");
    }
    try {
      const res = await fetch(`http://localhost:3001/api/giver/${user.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      if (!res.ok) throw new Error("Failed to add new service.");
      toast.success("Service added successfully! 🎉");
      setShowAddModal(false);
      setNewService({ service_id: "", base_unit: "", price_RWF: "" });

      // reload services
      const updated = await fetch(API_URL).then((r) => r.json());
      setServices(updated);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // --- UI States ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 text-amber-500">
        <RotateCw className="w-8 h-8 animate-spin mr-3" />
        <p>Loading your services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/10 border border-red-700 rounded-lg p-6">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Services</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 text-gray-900 hover:bg-amber-400 font-semibold flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Add Service
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Services List</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {services.length === 0 ? (
            <p className="text-gray-400">You haven’t added any services yet.</p>
          ) : (
            <table className="min-w-full text-gray-300">
              <thead className="border-b border-gray-700 text-left">
                <tr>
                  <th className="py-2">Service Name</th>
                  <th className="py-2">Base Unit</th>
                  <th className="py-2 text-right">Price (RWF)</th>
                  <th className="py-2 text-center">Visibility</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr
                    key={s.service_id}
                    className="border-b border-gray-800 hover:bg-gray-700/50"
                  >
                    <td className="py-2">{s.service_name}</td>
                    <td className="py-2">{s.base_unit}</td>
                    <td className="py-2 text-right">
                      {isEditing === s.service_id ? (
                        <Input
                          type="number"
                          value={updatedPrice}
                          onChange={(e) => setUpdatedPrice(e.target.value)}
                          className="w-24 bg-gray-700 border-gray-600 text-white text-right"
                        />
                      ) : (
                        <span>{Number(s.price_RWF).toLocaleString()}</span>
                      )}
                    </td>
                    <td className="py-2 text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          toggleVisibility(s.service_id, s.is_active)
                        }
                      >
                        {s.is_active ? (
                          <Eye className="h-5 w-5 text-green-400" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        )}
                      </Button>
                    </td>
                    <td className="py-2 text-right">
                      {isEditing === s.service_id ? (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-gray-900"
                          onClick={() => handleSave(s.service_id)}
                        >
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-900/20"
                          onClick={() => {
                            setIsEditing(s.service_id);
                            setUpdatedPrice(s.price_RWF);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ADD SERVICE MODAL */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-500">
              Add New Service
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Label className="block text-gray-400 mb-1">Service Type</Label>
            <Select
              value={newService.service_id}
              onValueChange={(v) => setNewService({ ...newService, service_id: v })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {serviceTypes.map((type) => (
                  <SelectItem key={type.service_id} value={type.service_id.toString()}>
                    {type.service_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="block text-gray-400 mb-1">Base Unit</Label>
            <Input
              placeholder="e.g., per hour"
              value={newService.base_unit}
              onChange={(e) => setNewService({ ...newService, base_unit: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />

            <Label className="block text-gray-400 mb-1">Price (RWF)</Label>
            <Input
              type="number"
              placeholder="Enter price"
              value={newService.price_RWF}
              onChange={(e) => setNewService({ ...newService, price_RWF: e.target.value })}
              className="bg-gray-800 border-gray-700 text-white"
            />

            <Button
              onClick={handleAddService}
              className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold"
            >
              Add Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
