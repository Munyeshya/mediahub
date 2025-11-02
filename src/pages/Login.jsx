// src/pages/Login.jsx
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn, Chrome, MountainIcon } from "lucide-react";

export function Login() {
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // NOTE: Replace alert with actual authentication logic (e.g., Firebase, JWT exchange)
        alert("Attempting to log in...");
    };

    return (
        // Uses the animated dark background class for brand consistency
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center bg-abstract-motion">
            
            <Card className="w-full max-w-md bg-gray-800 border border-gray-700 shadow-2xl p-6 md:p-8">
                <CardHeader className="text-center pb-6">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
                        <MountainIcon className="h-8 w-8 text-amber-500" />
                        <span className="text-2xl font-bold text-white">MediaHub</span>
                    </Link>

                    <CardTitle className="text-3xl font-extrabold text-white flex items-center justify-center">
                        <LogIn className="h-6 w-6 mr-2 text-amber-500" /> Sign In
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Welcome back! Access your Creative Hub.
                    </p>
                </CardHeader>
                
                <CardContent>
                    
                    {/* 1. Google Sign-In Button (Modern Priority) */}
                    <Button 
                        variant="outline" 
                        className="w-full mb-6 py-6 border-amber-500 text-amber-500 hover:bg-amber-900/20 font-semibold"
                    >
                        <Chrome className="h-5 w-5 mr-3" /> Continue with Google
                    </Button>

                    {/* Divider */}
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
                                    className="pl-10 bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="text-sm text-amber-500 hover:text-amber-400 transition-colors">
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
                                    className="pl-10 bg-gray-700 border-gray-600 text-white focus:border-amber-500"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <Button type="submit" className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400 font-bold py-6 text-base transition-all duration-300">
                            Log In
                        </Button>
                    </form>
                    
                    {/* 3. Registration Link */}
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Don't have a creator account?{' '}
                        {/* Links to the Profile/Registration page */}
                        <Link to="/profile" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                            Apply to be a Creative
                        </Link>
                    </p>

                </CardContent>
            </Card>
        </div>
    );
}