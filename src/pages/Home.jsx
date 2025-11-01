// src/pages/Home.jsx (COMPLETE HOME PAGE CONTENT)
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Zap, CheckCircle, Shield, XCircle, DollarSign, Users, TrendingUp } from "lucide-react"; 
// Icons for visual representation

// Content derived from MediaHub-Rwanda-Booking-Creatives-with-Confidence.pdf
const challengeItems = [
  { 
    title: "Lack of Trust & Verification", 
    description: "Difficulty verifying a provider's true skills, reliability, and professional background.", 
    icon: XCircle,
    color: "text-red-500" 
  },
  { 
    title: "Unpredictable Quality", 
    description: "Inconsistent quality of final deliverables, leading to client dissatisfaction and delays.", 
    icon: XCircle, // Using XCircle for a strong negative visual
    color: "text-red-500" 
  },
  { 
    title: "Unclear & Volatile Pricing", 
    description: "Absence of standardized pricing models makes budgeting difficult and negotiations cumbersome.", 
    icon: DollarSign,
    color: "text-red-500" 
  },
];

const solutionItems = [
    { 
      title: "Verified Profiles & Portfolios", 
      description: "Rigorous profile verification ensures professional standards and showcases high-quality sample work.", 
      icon: CheckCircle,
      color: "text-amber-500" 
    },
    { 
      title: "Client Ratings and Reviews", 
      description: "A community-driven quality control mechanism establishes a reputation system for reliable bookings.", 
      icon: Shield,
      color: "text-amber-500" 
    },
    { 
      title: "Secure Escrow Payments", 
      description: "Funds are held securely until the service is delivered and approved, guaranteeing payment for creatives and security for clients.", 
      icon: DollarSign,
      color: "text-amber-500" 
    },
  ];


export function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
        
      {/* --- 1. Hero Section --- */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 container mx-auto px-4">
        
        {/* Optional: Subtle background gradient */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ 
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none' 
        }}></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          {/* Main Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block text-gray-200">Transforming Rwanda's Multimedia Industry:</span>
            <span className="block mt-2 text-amber-500">Book Creatives with Confidence.</span>
          </h1>

          {/* Subtitle/Value Proposition */}
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Tired of the fragmented and informal market? MediaHub Rwanda is the centralized platform bringing **professionalism, transparency, and security** to your multimedia services.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg" 
              className="bg-amber-500 text-gray-900 hover:bg-amber-400 text-lg font-semibold py-7 px-8 transition-all shadow-lg shadow-amber-500/30"
            >
              <Search className="h-5 w-5 mr-2" />
              Find & Book a Creative Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-amber-500 border-amber-500 hover:bg-amber-900/20 text-lg font-semibold py-7 px-8"
            >
              <Zap className="h-5 w-5 mr-2" />
              See How We Ensure Quality
            </Button>
          </div>
          
        </div>
      </section>

      {/* --- 2. The Challenge Section --- */}
      <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-200">
              The Challenge: Why Booking Creatives is Broken
          </h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
              Clients navigate a **fragmented and informal market**, leading to significant friction and risk.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {challengeItems.map((item) => (
                  <Card key={item.title} className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader className="text-center space-y-4">
                          <item.icon className={`h-12 w-12 mx-auto ${item.color}`} />
                          <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <CardDescription className="text-gray-400 text-center">{item.description}</CardDescription>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>

      <div className="border-t border-gray-800 my-16"></div> 

      {/* --- 3. The Solution Section --- */}
      <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-extrabold text-center mb-4 text-amber-500">
              MediaHub Rwanda: The Reliable Solution
          </h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
              We bring **professionalism, transparency, and security** to the creative gig economy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {solutionItems.map((item) => (
                  <Card key={item.title} className="bg-gray-800 border-amber-500/50 shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
                      <CardHeader className="text-center space-y-4">
                          <item.icon className={`h-12 w-12 mx-auto ${item.color}`} />
                          <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <CardDescription className="text-gray-400 text-center">{item.description}</CardDescription>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>
      
      {/* --- 4. Market Advantage / CTA Section Placeholder --- */}
      <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-200 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Experience the difference that trust, transparency, and quality make.
          </p>
          <Button 
              size="lg" 
              className="bg-amber-500 text-gray-900 hover:bg-amber-400 text-xl font-semibold py-7 px-10"
          >
              Join the Hub Today <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
      </section>

    </div>
  );
}