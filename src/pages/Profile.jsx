// src/pages/Profile.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Phone, Mail, Globe, Briefcase, DollarSign, Upload, Trash2, Zap } from "lucide-react";

// Mock Data
const SERVICE_CATEGORIES = ['Photography', 'Videography', 'Audio Production', 'Graphics & Design', 'Web Development'];
const CITY_OPTIONS = ['Kigali', 'Musanze', 'Rubavu', 'Huye', 'Rusizi'];

// --- Utility Components for the Form ---

// Placeholder for a file upload component
const FileUploadSection = ({ title, description, accept }) => (
    <div className="border-2 border-dashed border-gray-600 p-6 rounded-lg text-center hover:border-amber-500 transition-colors cursor-pointer bg-gray-700/50">
        <Upload className="h-8 w-8 text-amber-500 mx-auto mb-2" />
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        <Input type="file" accept={accept} className="sr-only" />
        <Button size="sm" variant="outline" className="mt-4 text-amber-500 border-amber-500 hover:bg-amber-900/20">
            Browse Files
        </Button>
    </div>
);

// --- Main Profile Creation Form Component ---

export function Profile() {
    // State management for form data would typically go here
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile form submitted!");
        // Logic for data validation and API submission...
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="mx-auto max-w-5xl px-8 py-12 md:py-16">
                
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                    Create Your <span className="text-amber-500">Creative Profile</span>
                </h1>
                <p className="text-xl text-gray-400 mb-10">
                    Showcase your talent and manage bookings through MediaHub Rwanda.
                </p>

                <form onSubmit={handleSubmit} className="space-y-12">
                    
                    {/* --- SECTION 1: Personal & Brand Identity --- */}
                    <Card className="bg-gray-800 border-t-4 border-amber-500 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-white flex items-center">
                                <Zap className="h-6 w-6 mr-3 text-amber-500" /> 1. Identity & Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            {/* Company/Name */}
                            <div>
                                <Label htmlFor="brandName" className="text-white mb-2 block">Brand or Legal Name</Label>
                                <Input id="brandName" placeholder="E.g., Alpha Visuals or Jane Doe" className="bg-gray-900 border-gray-600 text-white" required />
                            </div>

                            {/* Bio/Description */}
                            <div>
                                <Label htmlFor="bio" className="text-white mb-2 block">Short Professional Bio (Max 300 words)</Label>
                                <Textarea id="bio" rows={4} placeholder="Describe your experience, style, and what you specialize in." className="bg-gray-900 border-gray-600 text-white" required />
                            </div>

                            {/* Contact Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="phone" className="text-white mb-2 flex items-center"><Phone className="h-4 w-4 mr-1 text-gray-400" /> Phone</Label>
                                    <Input id="phone" type="tel" placeholder="+2507XXXXXXXX" className="bg-gray-900 border-gray-600 text-white" required />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-white mb-2 flex items-center"><Mail className="h-4 w-4 mr-1 text-gray-400" /> Email</Label>
                                    <Input id="email" type="email" placeholder="contact@example.com" className="bg-gray-900 border-gray-600 text-white" required />
                                </div>
                                <div>
                                    <Label htmlFor="website" className="text-white mb-2 flex items-center"><Globe className="h-4 w-4 mr-1 text-gray-400" /> Website/Social Link</Label>
                                    <Input id="website" type="url" placeholder="https://instagram.com/yourbrand" className="bg-gray-900 border-gray-600 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- SECTION 2: Service & Pricing Details --- */}
                    <Card className="bg-gray-800 border-t-4 border-amber-500 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-white flex items-center">
                                <Briefcase className="h-6 w-6 mr-3 text-amber-500" /> 2. Services & Fees
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            {/* Service Category */}
                            <div>
                                <Label htmlFor="category" className="text-white mb-2 block">Primary Service Category</Label>
                                <Select required>
                                    <SelectTrigger id="category" className="bg-gray-900 border-gray-600 text-white">
                                        <SelectValue placeholder="Select your main focus..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        {SERVICE_CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat.toLowerCase().replace(/ /g, '-')}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Service Location */}
                            <div>
                                <Label className="text-white mb-2 block">Primary Operating City</Label>
                                <RadioGroup defaultValue="kigali" className="flex flex-wrap gap-4">
                                    {CITY_OPTIONS.map(city => (
                                        <div key={city} className="flex items-center space-x-2">
                                            <RadioGroupItem value={city.toLowerCase()} id={city.toLowerCase()} className="text-amber-500 border-gray-500" />
                                            <Label htmlFor={city.toLowerCase()} className="text-gray-300">{city}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Standard Hourly Rate */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="rate" className="text-white mb-2 flex items-center"><DollarSign className="h-4 w-4 mr-1 text-gray-400" /> Standard Hourly Rate (RWF)</Label>
                                    <Input id="rate" type="number" placeholder="E.g., 25000" min="5000" className="bg-gray-900 border-gray-600 text-white" required />
                                </div>
                                
                                {/* Minimum Project Fee */}
                                <div>
                                    <Label htmlFor="minFee" className="text-white mb-2 flex items-center"><DollarSign className="h-4 w-4 mr-1 text-gray-400" /> Minimum Project Fee (RWF)</Label>
                                    <Input id="minFee" type="number" placeholder="E.g., 50000" min="0" className="bg-gray-900 border-gray-600 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* --- SECTION 3: Portfolio & Media Upload --- */}
                    <Card className="bg-gray-800 border-t-4 border-amber-500 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-white flex items-center">
                                <Camera className="h-6 w-6 mr-3 text-amber-500" /> 3. Portfolio & Verification Assets
                            </CardTitle>
                            <p className="text-sm text-gray-400">These assets will be reviewed by the MediaHub team for verification.</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            {/* Logo Upload */}
                            <FileUploadSection
                                title="Upload Brand Logo"
                                description="Required for your public profile. (PNG or JPG, max 2MB)"
                                accept="image/*"
                            />

                            {/* Sample Work Upload */}
                            <div className="space-y-4">
                                <Label className="text-white mb-2 block font-semibold">Sample Work (Up to 5 files/links)</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Link Input Example */}
                                    <div className="col-span-1 md:col-span-3">
                                        <Input placeholder="Portfolio Link 1 (e.g., Behance, YouTube URL)" className="bg-gray-900 border-gray-600 text-white" />
                                    </div>
                                    
                                    {/* File Upload Example */}
                                    <FileUploadSection
                                        title="Project Sample 1"
                                        description="Best example of your work (Video/Photo/PDF, max 50MB)"
                                        accept="image/*,video/*,application/pdf"
                                    />
                                    {/* Add more file/link inputs here */}
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start space-x-2 pt-4 border-t border-gray-700">
                                <Checkbox id="terms" className="translate-y-1 text-amber-500 border-amber-500 data-[state=checked]:bg-amber-500" />
                                <Label htmlFor="terms" className="text-sm text-gray-300 leading-snug">
                                    I confirm that all uploaded assets are my original work, and I agree to the <span className="text-amber-400 hover:underline cursor-pointer">MediaHub Creator Terms & Conditions</span>.
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Submission Button --- */}
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-amber-500 text-gray-900 hover:bg-amber-400 text-lg py-6 px-10 font-bold transition-all duration-300">
                            Submit Profile for Review
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );
}