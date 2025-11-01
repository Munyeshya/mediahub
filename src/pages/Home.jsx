// src/pages/Home.jsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TypingText from "@/components/TypingText"; 
import { Camera, Video, Mic, HeartHandshake, Zap, Shield, Search, TrendingUp, X, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Data derived from the "MediaHub Rwanda: Booking Creatives with Confidence" document
const coreProblems = [
    { title: "Unreliable Bookings", icon: X, description: "High risk of cancellations or no-shows due to informal agreements.", color: "text-red-400" },
    { title: "Unpredictable Quality", icon: TrendingUp, description: "Inconsistent quality of final deliverables and portfolio verification.", color: "text-red-400" },
    { title: "Lack of Trust", icon: HeartHandshake, description: "Difficulty verifying a provider's true skills and professional background.", color: "text-red-400" },
];

const coreServices = [
    { title: "Photography", icon: Camera, description: "Weddings, events, and commercial studio shoots." },
    { title: "Videography", icon: Video, description: "Film production, documentaries, and corporate videos." },
    { title: "Audio Production", icon: Mic, description: "Sound design, music recording, and voice-overs." },
    { title: "Graphics & Design", icon: Zap, description: "Branding, logos, and digital marketing materials." },
];

export function Home() {
  return (
    // Reusing the attractive background with its animation class
    <div className="bg-gray-900 text-white min-h-screen bg-abstract-motion animate-abstract-move">
      <div className="container mx-auto px-4 py-12 md:py-20">
        
        {/* --- 1. Massive Dynamic Hero Section --- */}
        <section className="text-center mb-24 max-w-6xl mx-auto pt-16 pb-20 border-b border-amber-500/30">
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-snug mb-6">
                Transforming Rwanda's <span className="text-amber-500 block">
                    {/* The most prominent typing effect */}
                    <TypingText 
                        text="Creative Services" 
                        typingSpeed={100} 
                        repeatDelay={5000} 
                    />
                </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-400 mb-10 max-w-4xl mx-auto">
                The centralized platform where you can **Book Creatives with Confidence.**
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <Link to="/services">
                    <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 text-xl py-8 px-10 font-bold shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-105">
                        <Search className="h-6 w-6 mr-3" /> Find Verified Creatives
                    </Button>
                </Link>
                <Link to="/register">
                    <Button variant="outline" className="text-white border-amber-500 hover:bg-amber-500/10 text-xl py-8 px-10 font-bold transition-all duration-300 hover:scale-105">
                        List Your Service <ArrowRight className="h-5 w-5 ml-3" />
                    </Button>
                </Link>
            </div>
        </section>

        {/* --- 2. Staggered Problem & Solution Callout --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-start">
            
            {/* The Problems Column */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-t-4 border-red-500 transition-all duration-500 hover:shadow-red-500/10">
                <h2 className="text-4xl font-extrabold text-white mb-6 flex items-center">
                    <X className="h-8 w-8 text-red-500 mr-4" /> The Challenges We Eliminate
                </h2>
                <div className="space-y-8">
                    {coreProblems.map((problem, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <problem.icon className={`h-8 w-8 ${problem.color} flex-shrink-0`} />
                            <div>
                                <h3 className="text-2xl font-semibold text-white">{problem.title}</h3>
                                <p className="text-gray-400">{problem.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Solution Column */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-t-4 border-amber-500 transition-all duration-500 hover:shadow-amber-500/20">
                <h2 className="text-4xl font-extrabold text-white mb-6 flex items-center">
                    <CheckCircle className="h-8 w-8 text-amber-500 mr-4" /> Our Reliable Guarantees
                </h2>
                <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                        <Shield className="h-8 w-8 text-amber-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl font-semibold text-white">Verified Trust</h3>
                            <p className="text-gray-400">Secure escrow payments and verified accounts protect both client funds and creative fees.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Search className="h-8 w-8 text-amber-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl font-semibold text-white">Transparent Pricing</h3>
                            <p className="text-gray-400">Clear service packages and community ratings remove all negotiation friction.</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <TrendingUp className="h-8 w-8 text-amber-500 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl font-semibold text-white">Guaranteed Quality</h3>
                            <p className="text-gray-400">Rigorously checked portfolios ensure you only work with proven professionals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- 3. Service Showcase Grid (Animated) --- */}
        <section className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12">
                Explore Our Core <span className="text-amber-500">Service Categories</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreServices.map((service, index) => (
                    <Card 
                        key={index} 
                        className="bg-gray-800 border-amber-500/50 shadow-xl shadow-amber-500/10 
                                   transition-all duration-500 hover:scale-[1.05] 
                                   transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30"
                    >
                        <CardHeader className="text-center space-y-4 pt-8">
                            <service.icon className="h-16 w-16 text-amber-500 mx-auto" />
                            <CardTitle className="text-xl font-bold text-white">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 text-center">{service.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <Link to="/services">
                <Button className="mt-12 bg-gray-700 text-white hover:bg-gray-600 text-lg py-6 px-8 transition-colors">
                    View All Categories
                </Button>
            </Link>
        </section>

      </div>
    </div>
  );
}