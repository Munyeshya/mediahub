// src/pages/About.jsx (VIBRANT & ANIMATED VERSION with Typing Effect)
import { MountainIcon, CheckCircle, Shield, X, Phone, Globe, Smartphone, Users, Zap, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TypingText from "@/components/TypingText"; // <--- NEW IMPORT

const competitiveAdvantages = [
    { 
        title: "First-Mover Advantage", 
        description: "Dominating a currently informal sector with a professional, centralized platform.", 
        icon: Globe 
    },
    { 
        title: "Mobile-First Focus", 
        description: "Platform specifically optimized for mobile devices and local payment methods (Mobile Money).", 
        icon: Smartphone 
    },
    { 
        title: "Built-in Trust Mechanism", 
        description: "Verified accounts and community reviews create an unmatched foundation of reliability.", 
        icon: Shield 
    },
];

export function About() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        
        {/* --- 1. Dynamic Hero / Mission Section --- */}
        <section className="text-center mb-20 max-w-5xl mx-auto py-12 border-b border-gray-800">
            <MountainIcon className="h-16 w-16 text-amber-500 mx-auto mb-6 animate-pulse" />
            
            {/* --- TYPING EFFECT IMPLEMENTATION --- */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
                Empowering Rwanda's <span className="block md:inline">
                    <TypingText text="Creative Economy" typingSpeed={75} />
                </span>
            </h1>
            {/* ---------------------------------- */}
            
            <p className="text-2xl text-gray-400 mb-10 max-w-4xl mx-auto">
                We are the centralized platform transforming the multimedia service industry, ensuring every booking is made **with confidence and security.**
            </p>
            <Link to="/services">
                <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 text-xl py-8 px-10 font-bold shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.05]">
                    Find Verified Creatives <Zap className="h-6 w-6 ml-2" />
                </Button>
            </Link>
        </section>

        {/* --- 2. The Problem & Solution Split (Vibrant Theming) --- */}
        <section id="mission" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            
            {/* The Problem Panel (Red Accent) */}
            <div className="bg-red-950/40 p-8 md:p-12 rounded-2xl shadow-xl border border-red-900/50 hover:border-red-500/50 transition-all duration-500">
                <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center">
                    <X className="h-8 w-8 mr-3" /> The Challenge
                </h2>
                <p className="text-lg text-red-200 mb-6">
                    Rwandan clients currently navigate a fragmented market, facing **uncertainty, inconsistent quality, and high risk** when hiring creatives.
                </p>
                <ul className="space-y-4 text-red-100 list-disc list-inside ml-4">
                    <li>**Lack of Verification:** Difficulty confirming professional background and reliability.</li>
                    <li>**Pricing Chaos:** No standardized models, leading to difficult negotiations.</li>
                    <li>**Unreliable Bookings:** High risk of cancellations and project delays due to informal agreements.</li>
                </ul>
            </div>

            {/* The Solution Panel (Amber Accent) */}
            <div className="bg-amber-950/40 p-8 md:p-12 rounded-2xl shadow-xl border border-amber-900/50 hover:border-amber-500/50 transition-all duration-500">
                <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center">
                    <CheckCircle className="h-8 w-8 mr-3" /> Our Reliable Solution
                </h2>
                <p className="text-lg text-amber-200 mb-6">
                    MediaHub brings professionalism and security through a **centralized, transparent, and trusted** digital platform.
                </p>
                <ul className="space-y-4 text-amber-100 list-disc list-inside ml-4">
                    <li>**Verified Quality:** Rigorous checks, secure payments, and formal contracts.</li>
                    <li>**Transparency:** Community ratings and clear, standardized service pricing.</li>
                    <li>**Confidence:** Secure escrow system protects both client funds and creative payments.</li>
                </ul>
            </div>
        </section>

        {/* --- 3. Competitive Advantage Grid (Animated Cards) --- */}
        <section className="mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12">
                Our <span className="text-amber-500">Unmatched</span> Competitive Edge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {competitiveAdvantages.map((item, index) => (
                    <Card 
                        key={item.title} 
                        className="bg-gray-800 border-amber-500/50 shadow-xl shadow-amber-500/10 transition-all duration-500 
                                   hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/30 
                                   transform hover:rotate-z-[1deg] hover:-translate-y-1"
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        <CardHeader className="text-center space-y-4 pt-8">
                            <item.icon className="h-12 w-12 text-amber-500 mx-auto" />
                            <CardTitle className="text-2xl font-bold text-white">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 text-center">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* --- 4. Call to Action (More engaging footer) --- */}
        <section className="bg-gray-800 p-10 md:p-16 rounded-xl text-center border-t border-amber-500/50">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
                <Briefcase className="h-7 w-7 text-amber-500 mr-3" /> Ready to Partner with the Best?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-4xl mx-auto">
                Whether you're looking for your next creative project or want to list your professional services, we're here to help you grow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/contact">
                    <Button variant="outline" className="text-amber-500 border-amber-500 hover:bg-amber-900/20 py-7 px-8 text-lg w-full sm:w-auto">
                        <Phone className="h-5 w-5 mr-2" /> Contact Our Team
                    </Button>
                </Link>
                <Link to="/register">
                    <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 py-7 px-8 text-lg font-semibold w-full sm:w-auto">
                        List Your Service Today
                    </Button>
                </Link>
            </div>
        </section>

      </div>
    </div>
  );
}