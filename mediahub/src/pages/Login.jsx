// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; 
import { Mail, Lock, LogIn, Chrome, MountainIcon, Users, Shield, Briefcase } from "lucide-react";
import { FramerParticleBackground } from '../components/common/FramerParticleBackground';

// IMPORT THE UNIFIED AUTHENTICATION FUNCTION
import { authenticateLogin } from '@/logic/db'; 

// 💥 NEW: Import the useAuth hook to access the global login function
import { useAuth } from '../logic/auth'; 

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('Client'); 
    
    // 💥 NEW: Get the login function from the Auth Context
    const { login } = useAuth(); 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let result = null;
        let dashboardPath = null;

        const toastConfig = {
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark"
        };

        try {
            // CALL THE UNIFIED AUTHENTICATION FUNCTION
            // Assuming authenticateLogin returns { role: 'Admin' | 'Client' | 'Giver' } on success
            result = await authenticateLogin(email, password, selectedRole);

            if (result) {
                // 💥 CRITICAL FIX: Update the global authentication state
                // This call sets the userRole in context and localStorage,
                // which satisfies the <ProtectedRoute /> component.
                login(result.role); 
                
                dashboardPath = `/dashboard/${result.role.toLowerCase()}`;
                
                // SUCCESS TOASTIFY CALL
                toast.success(`Welcome back, ${result.role}! 🎉`, {
                    ...toastConfig,
                    autoClose: 2000,
                });
                
                // Delay navigation slightly to let the toast show
                setTimeout(() => {
                    // Navigation will now succeed because the state is set
                    navigate(dashboardPath, { replace: true });
                }, 100); 

            } else {
                const failureMessage = `Invalid email or password for ${selectedRole}.`;
                
                // FAILURE TOASTIFY CALL 
                toast.error(failureMessage, {
                    ...toastConfig,
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.error("Login attempt failed:", err);
            const systemErrorMessage = 'An error occurred during authentication. Please contact support.';
            
            // SYSTEM ERROR TOASTIFY CALL 
            toast.error("System Error 🚨", {
                ...toastConfig,
                autoClose: 5000,
                description: systemErrorMessage,
            });
        }
    };

    return (
        <div className="bg-gray-900 text-white relative min-h-screen flex items-center justify-center "> 
        <FramerParticleBackground />
            <Card className="w-full max-w-md bg-gray-800 border border-gray-700 shadow-2xl p-6 md:p-8">
                <CardHeader className="text-center pb-6">
                    <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
                        <MountainIcon className="h-8 w-8 text-amber-500" />
                        <span className="text-2xl font-bold text-white">MediaHub</span>
                    </Link>

                    <CardTitle className="text-3xl font-extrabold text-white flex items-center justify-center">
                        <LogIn className="h-6 w-6 mr-2 text-amber-500" /> Sign In
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Welcome back! Select your role to continue.
                    </p>
                </CardHeader>
                
                <CardContent>
                    
                    {/* ROLE SELECTION RADIO GROUP */}
                    <div className="mb-6 space-y-2">
                        <Label className="text-white">I am signing in as:</Label>
                        <RadioGroup 
                            value={selectedRole} 
                            onValueChange={setSelectedRole} 
                            className="flex justify-between space-x-2"
                        >
                            {/* Client Role */}
                            <div className="flex-1">
                                <RadioGroupItem value="Client" id="client" className="sr-only" />
                                <Label 
                                    htmlFor="client" 
                                    className={`flex flex-col items-center justify-between rounded-md border-2 p-3 cursor-pointer transition-colors ${selectedRole === 'Client' ? 'border-amber-500 bg-amber-900/10' : 'border-gray-700 hover:bg-gray-700/50'}`}
                                >
                                    <Users className="h-6 w-6 mb-1 text-amber-500" />
                                    <span className="text-sm font-medium">Client</span>
                                </Label>
                            </div>

                            {/* Giver Role */}
                            <div className="flex-1">
                                <RadioGroupItem value="Giver" id="giver" className="sr-only" />
                                <Label 
                                    htmlFor="giver" 
                                    className={`flex flex-col items-center justify-between rounded-md border-2 p-3 cursor-pointer transition-colors ${selectedRole === 'Giver' ? 'border-amber-500 bg-amber-900/10' : 'border-gray-700 hover:bg-gray-700/50'}`}
                                >
                                    <Briefcase className="h-6 w-6 mb-1 text-amber-500" />
                                    <span className="text-sm font-medium">Creative</span>
                                </Label>
                            </div>

                            {/* Admin Role */}
                            <div className="flex-1">
                                <RadioGroupItem value="Admin" id="admin" className="sr-only" />
                                <Label 
                                    htmlFor="admin" 
                                    className={`flex flex-col items-center justify-between rounded-md border-2 p-3 cursor-pointer transition-colors ${selectedRole === 'Admin' ? 'border-red-500 bg-red-900/10' : 'border-gray-700 hover:bg-gray-700/50'}`}
                                >
                                    <Shield className="h-6 w-6 mb-1 text-red-500" />
                                    <span className="text-sm font-medium">Admin</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    
                    {/* Google Sign-In and Divider */}
                    <Button 
                        variant="outline" 
                        className="w-full mb-6 py-6 border-amber-500 text-amber-500 hover:bg-amber-900/20 font-semibold"
                    >
                        <Chrome className="h-5 w-5 mr-3" /> Continue with Google
                    </Button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-700"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-800 px-2 text-gray-500">Or use your email</span>
                        </div>
                    </div>
                    
                    {/* 2. Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="yourname@domain.com" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`pl-10 bg-gray-700 border-gray-600 text-white focus:border-${selectedRole === 'Admin' ? 'red' : 'amber'}-500`}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className={`text-sm text-${selectedRole === 'Admin' ? 'red' : 'amber'}-500 hover:text-amber-400 transition-colors`}>
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`pl-10 bg-gray-700 border-gray-600 text-white focus:border-${selectedRole === 'Admin' ? 'red' : 'amber'}-500`}
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <Button 
                            type="submit" 
                            className={`w-full font-bold py-6 text-base transition-all duration-300 ${selectedRole === 'Admin' ? 'bg-red-500 hover:bg-red-400 text-gray-900' : 'bg-amber-500 hover:bg-amber-400 text-gray-900'}`}
                        >
                            {selectedRole === 'Admin' ? 'Access Admin Console' : 'Log In to Dashboard'}
                        </Button>
                    </form>
                    
                    {/* 3. Registration Link */}
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Don't have a creator account?{' '}
                        <Link to="/profile" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                            Apply to be a Creative
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </div>
    );
}