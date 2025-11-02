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
    <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden bg-abstract-motion
     animate-spark-1 animate-spark-2 animate-spark-3 animate-spark-4 animate-spark-5 
     animate-spark-6 animate-spark-7 animate-spark-8 animate-spark-9 animate-spark-10 
     animate-spark-11 animate-spark-12 animate-spark-13 animate-spark-14 animate-spark-15">
      {/* 💥 CHANGE 1: Increased container width from default (max-w-5xl/6xl) 
        to max-w-7xl for more side space on large screens. 
        Retained responsive padding (px-4) for mobile.
      */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          {/* Typing Effect on the H1 Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-amber-500 mb-4">
            <TypingText
              text="Why are we here"
              typingSpeed={120}
              repeatDelay={5000}
            />
          </h1>
          <p className="text-xl text-gray-400">
            What do you need to know about what we have for you
          </p>
        </div>

        {/* --- 2. The Problem & Solution Split (Reduced Component Size) --- */}
        <section id="mission" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* The Problem Panel (Red Accent) */}
          {/* 💥 CHANGE 2: Reduced padding from p-8 md:p-12 to p-6 md:p-8 */}
          <div className="bg-red-950/40 p-6 md:p-8 rounded-xl shadow-xl border border-red-900/50 hover:border-red-500/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
              {/* 💥 CHANGE 3: Reduced icon size from h-8 w-8 to h-6 w-6 */}
              <X className="h-6 w-6 mr-3" /> The Challenge
            </h2>
            <p className="text-base text-red-200 mb-4">
              Rwandan clients currently navigate a fragmented market, facing **uncertainty, inconsistent quality, and high risk** when hiring creatives.
            </p>
            <ul className="space-y-3 text-red-100 list-disc list-inside ml-4 text-sm">
              <li>**Lack of Verification:** Difficulty confirming professional background and reliability.</li>
              <li>**Pricing Chaos:** No standardized models, leading to difficult negotiations.</li>
              <li>**Unreliable Bookings:** High risk of cancellations and project delays due to informal agreements.</li>
            </ul>
          </div>

          {/* The Solution Panel (Amber Accent) */}
          {/* 💥 CHANGE 2: Reduced padding from p-8 md:p-12 to p-6 md:p-8 */}
          <div className="bg-amber-950/40 p-6 md:p-8 rounded-xl shadow-xl border border-amber-900/50 hover:border-amber-500/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center">
              {/* 💥 CHANGE 3: Reduced icon size from h-8 w-8 to h-6 w-6 */}
              <CheckCircle className="h-6 w-6 mr-3" /> Our Reliable Solution
            </h2>
            <p className="text-base text-amber-200 mb-4">
              MediaHub brings professionalism and security through a **centralized, transparent, and trusted** digital platform.
            </p>
            <ul className="space-y-3 text-amber-100 list-disc list-inside ml-4 text-sm">
              <li>**Verified Quality:** Rigorous checks, secure payments, and formal contracts.</li>
              <li>**Transparency:** Community ratings and clear, standardized service pricing.</li>
              <li>**Confidence:** Secure escrow system protects both client funds and creative payments.</li>
            </ul>
          </div>
        </section>

        {/* --- 3. Competitive Advantage Grid (Card Title reduced to 2xl) --- */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-10">
            Our <span className="text-amber-500">Unmatched</span> Competitive Edge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competitiveAdvantages.map((item, index) => (
              <Card
                key={item.title}
                className="bg-gray-800 border-amber-500/50 shadow-xl shadow-amber-500/10 transition-all duration-500 
                                   hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/30 
                                   transform hover:rotate-z-[1deg] hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* 💥 CHANGE 4: Reduced padding in CardHeader and CardTitle text size */}
                <CardHeader className="text-center space-y-3 pt-6"> 
                  {/* 💥 Reduced icon size from h-12 w-12 to h-10 w-10 */}
                  <item.icon className="h-10 w-10 text-amber-500 mx-auto" />
                  <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* --- 4. Call to Action (Reduced Component Size) --- */}
        {/* 💥 CHANGE 5: Reduced padding from p-10 md:p-16 to p-8 md:p-12 */}
        <section className="relative overflow-hidden bg-gray-800 p-8 md:p-12 rounded-2xl border border-amber-500/50 shadow-2xl shadow-amber-500/10 mt-16">
            
            {/* Ambient Radial Glow Effect */}
            <div className="absolute inset-0 z-0 opacity-10" 
                 style={{ background: 'radial-gradient(circle at center, #fbbf24 0%, transparent 70%)' }} />
            
            <div className="relative z-10 text-center">
                
                {/* 💥 FLOATING TITLE AND ICON */}
                <h2 className="text-3xl font-extrabold text-white mb-4 flex items-center justify-center animate-float-subtle">
                    <Briefcase className="h-8 w-8 text-amber-500 mr-3" /> 
                    Ready to Partner with the Best?
                </h2>
                
                <p className="text-xl text-gray-400 mb-8 max-w-4xl mx-auto">
                    Whether you're looking for your next creative project or want to list your professional services, we're here to help you grow.
                </p>

                {/* Buttons (kept the reduced size from previous step) */}
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Link to="/contact">
                        <Button 
                            variant="outline" 
                            className="text-amber-500 border-amber-500 hover:bg-amber-900/20 py-6 px-7 text-base w-full sm:w-auto transition-all duration-300"
                        >
                            <Phone className="h-5 w-5 mr-2" /> Contact Our Team
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button 
                            className="bg-amber-500 text-gray-900 hover:bg-amber-400 py-6 px-7 text-base font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-[1.02]"
                        >
                            List Your Service Today
                        </Button>
                    </Link>
                </div>
                
            </div>
        </section>

      </div>
    </div>
  );
}