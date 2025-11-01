// src/pages/Contact.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  // Simple handler for front-end feedback
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will be in touch shortly.");
    // NOTE: In a real app, replace this alert with actual API submission logic.
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-amber-500 mb-4">
                Get In Touch
            </h1>
            <p className="text-xl text-gray-400">
                Have a question about booking, listing your service, or a partnership inquiry? We're here to help.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* --- 1. Contact Form --- */}
            <div className="lg:col-span-2 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
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

            {/* --- 2. Direct Contact Info --- */}
            <div className="bg-gray-900 p-8 rounded-xl border border-amber-500/50 shadow-xl shadow-amber-500/10 h-fit">
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