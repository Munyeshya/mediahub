// src/pages/Contact.jsx
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import TypingText from "@/components/TypingText"; 
import { FramerParticleBackground } from '../components/common/FramerParticleBackground';

export function Contact() {
  
  // Debugging Checkpoint (You can remove this line once satisfied)
  useEffect(() => {
    console.log("MediaHub Contact Page Mounted.");
  }, []);
  
  // Simple handler for front-end feedback
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will be in touch shortly.");
    // NOTE: Replace alert with actual form submission logic (e.g., fetch API call)
  };

  return (
    // Applied the custom background class with animation utility
    <div className="bg-gray-900 text-white relative min-h-screen overflow-x-hidden ">
        <FramerParticleBackground />
      {/* Set wide container (max-w-6xl) for side spacing */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-20"> 
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
            {/* Typing Effect on the H1 Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-amber-500 mb-4">
                <TypingText 
                    text="Get In Touch" 
                    typingSpeed={120} 
                    repeatDelay={5000} 
                />
            </h1>
            <p className="text-xl text-gray-400">
                Have a question about booking, listing your service, or a partnership inquiry? We're here to help.
            </p>
        </div>

        {/* items-stretch ensures the cards maintain equal height (h-full) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch"> 
            
            {/* --- 1. Contact Form (Spans 2/3 width) --- */}
            <div className="lg:col-span-2 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 h-full"> 
                <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-400">Full Name</Label>
                            <Input id="name" type="text" placeholder="Your Name" className="bg-gray-900 border-gray-700 text-white focus:border-amber-500" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-400">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" className="bg-gray-900 border-gray-700 text-white focus:border-amber-500" required />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-400">Subject</Label>
                        <Input id="subject" type="text" placeholder="I have a question about..." className="bg-gray-900 border-gray-700 text-white focus:border-amber-500" required />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-400">Your Message</Label>
                        <Textarea id="message" placeholder="Type your message here." className="bg-gray-900 border-gray-700 text-white h-32 focus:border-amber-500" required />
                    </div>
                    
                    <Button type="submit" className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400 py-6 text-lg font-semibold transition-colors">
                        Submit Inquiry
                    </Button>
                </form>
            </div>

            {/* --- 2. Direct Contact Info (Fills remaining 1/3 width, h-full for equal height) --- */}
            <div className="bg-gray-900 p-8 rounded-xl border border-amber-500/50 shadow-xl shadow-amber-500/10 h-full">
                <h2 className="text-2xl font-bold text-white mb-6">Direct Information</h2>
                
                <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                        <Mail className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-white">Email</p>
                            <a href="mailto:support@mediahubrwanda.com" className="text-gray-400 hover:text-amber-500 transition-colors">
                                support@mediahubrwanda.com
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <Phone className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-white">Phone</p>
                            <a href="tel:+250780000000" className="text-gray-400 hover:text-amber-500 transition-colors">
                                +250 78 000 0000
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                        <MapPin className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-white">Office Location</p>
                            <p className="text-gray-400">
                                Innovation Village, Kigali Heights<br/>
                                KN 8 Street, Kigali, Rwanda
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
      </div>
    </div>
  );
}