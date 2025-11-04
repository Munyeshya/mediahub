// src/pages/dashboard/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSystemSettings, updateSystemSettings } from '@/logic/db'; // Will create these functions

// Mock initial data structure
const initialSettings = {
    commissionRate: 0.15, // 15%
    minPayoutRWF: 50000,
    emailVerificationRequired: true,
    platformStatus: 'Operational', // e.g., 'Maintenance'
};

export function SystemSettings() {
    const [settings, setSettings] = useState(initialSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSystemSettings();
                setSettings(data);
            } catch (error) {
                toast.error("Failed to load system settings.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Validate basic data before saving
            if (settings.commissionRate < 0 || settings.minPayoutRWF < 0) {
                 throw new Error("Values must be non-negative.");
            }

            // Simulate API call to save settings
            await updateSystemSettings(settings);
            
            toast.success("System settings updated successfully!");

        } catch (error) {
            console.error("Save Error:", error);
            toast.error(`Failed to save settings: ${error.message || 'Server error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-white">
                <Loader2 className="h-8 w-8 animate-spin mr-3 text-amber-500" />
                Loading System Configuration...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">System Settings</h2>
            <p className="text-gray-400">Manage global platform configurations, financial parameters, and operational status.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. FINANCIAL SETTINGS */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-amber-500">Financial Configuration</CardTitle>
                        <CardDescription className="text-gray-400">Set platform commission and payment thresholds.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Commission Rate */}
                            <div className="space-y-2">
                                <Label htmlFor="commission" className="text-white">Platform Commission Rate (%)</Label>
                                <Input
                                    id="commission"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={settings.commissionRate * 100} // Display as percentage
                                    onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value) / 100)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            {/* Minimum Payout */}
                            <div className="space-y-2">
                                <Label htmlFor="payout" className="text-white">Minimum Payout (RWF)</Label>
                                <Input
                                    id="payout"
                                    type="number"
                                    step="1000"
                                    min="0"
                                    value={settings.minPayoutRWF}
                                    onChange={(e) => handleChange('minPayoutRWF', parseInt(e.target.value))}
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. ACCOUNT AND OPERATIONAL SETTINGS */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-amber-500">Account & Status</CardTitle>
                        <CardDescription className="text-gray-400">Control core platform rules and operational status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Email Verification Toggle */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="verification" className="text-white font-medium">Require Email Verification for Givers</Label>
                            <Switch
                                id="verification"
                                checked={settings.emailVerificationRequired}
                                onCheckedChange={(checked) => handleChange('emailVerificationRequired', checked)}
                                className="data-[state=checked]:bg-amber-500"
                            />
                        </div>
                        
                        {/* Platform Status Field */}
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-white">Platform Status Message</Label>
                            <Input
                                id="status"
                                type="text"
                                value={settings.platformStatus}
                                onChange={(e) => handleChange('platformStatus', e.target.value)}
                                placeholder="e.g., Operational, Scheduled Maintenance 20:00 - 22:00"
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                            <p className="text-sm text-gray-500">This message can be displayed to all users on the public site.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSaving || isLoading} className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-6 px-8">
                        {isSaving ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <Save className="h-5 w-5 mr-2" />
                        )}
                        {isSaving ? 'Saving Changes...' : 'Save All Settings'}
                    </Button>
                </div>
            </form>
        </div>
    );
}