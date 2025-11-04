// src/pages/Home.jsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TypingText from "@/components/TypingText"; 
// Ensure all necessary Lucide icons are imported
import { Camera, Video, Mic, HeartHandshake, Zap, Shield, Search, TrendingUp, X, CheckCircle, ArrowRight, Star, Quote, Rocket, User } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Ensure Carousel components are imported
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"; 
import { FramerParticleBackground } from '../components/common/FramerParticleBackground';

// --- DATA BLOCKS ---
const coreProblems = [
    { title: "Unreliable Bookings", icon: X, description: "High risk of cancellations or no-shows due to informal agreements.", color: "text-red-400" },
    { title: "Unpredictable Quality", icon: TrendingUp, description: "Inconsistent quality of final deliverables and portfolio verification.", color: "text-red-400" },
    { title: "Lack of Trust", icon: HeartHandshake, description: "Difficulty verifying a provider's true skills and professional background.", color: "text-red-400" },
    { 
        title: "No Consequence for Unprofessionalism", 
        icon: X, 
        description: (
            // Final fix using <span> with font-bold for JSX visibility
            <>
                The current informal market lacks a <span className="font-bold">structured review and penalty system</span>. Without a public,
                searchable reputation, there are <span className="font-bold">no professional repercussions</span> for poor service or no-shows,
                making every new booking a high-risk gamble for the client.
            </>
        ), 
        color: "text-red-400" 
    },
];

const coreServices = [
    { id: 1, title: "Photography", icon: Camera, description: "Weddings, events, and commercial studio shoots." },
    { id: 2, title: "Videography", icon: Video, description: "Film production, documentaries, and corporate videos." },
    { id: 3, title: "Audio Production", icon: Mic, description: "Sound design, music recording, and voice-overs." },
    { id: 4, title: "Graphics & Design", icon: Zap, description: "Branding, logos, and digital marketing materials." },
];

const testimonials = [
    { quote: "MediaHub eliminated all the headaches of hiring. Found a verified videographer in minutes, and the payment escrow gave me total peace of mind.", name: "Jean-Claude B.", city: "Kigali" },
    { quote: "The best directory for quality creatives in Rwanda. The portfolio check feature meant I didn't waste time sifting through unproven profiles.", name: "Sarah N.", city: "Remera" },
    { quote: "As a client who values reliability, MediaHub is a game-changer. The formal booking agreement ensured high-quality work and was on time.", name: "Isabelle M.", city: "Gisenyi" },
];

const featuredCreatives = [
    { name: "Alpha Visuals", category: "Videography", rating: 5.0, bookings: "100+", profileLink: "/profile/alpha" },
    { name: "Kreative Designs", category: "Graphics", rating: 4.9, bookings: "85+", profileLink: "/profile/kreative" },
    { name: "Sound Masters", category: "Audio Production", rating: 4.8, bookings: "60+", profileLink: "/profile/sound" },
    { name: "Event Snaps", category: "Photography", rating: 4.7, bookings: "120+", profileLink: "/profile/eventsnaps" }, 
];

// --- Component Start ---

export function Home() {
  return (
    <div className="bg-gray-900 text-white relative min-h-screen overflow-x-hidden ">
      <FramerParticleBackground />
      <div className="mx-auto max-w-7xl px-8 py-12 md:py-20"> 
        
        {/* --- 1. Massive Dynamic Hero Section --- */}
        <section className="text-center mb-24 max-w-6xl mx-auto pt-16 pb-20 border-b border-amber-500/30">
            
            <h1 className="text-3xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-snug mb-6">
                Transforming Rwanda's <span className="text-amber-500 block">
                    <TypingText 
                        text="Creative Services" 
                        typingSpeed={100} 
                        repeatDelay={5000} 
                    />
                </span>
            </h1>
            
            <p className="text-2xl md:text-2xl text-gray-400 mb-10 max-w-4xl mx-auto">
                The centralized platform where you can <span className=" font-bold">Book Creatives with Confidence.</span>
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
                <h2 className="text-3xl font-extrabold text-white mb-6 flex items-center">
                    <X className="h-7 w-7 text-red-500 mr-3" /> The Challenges We Eliminate
                </h2>
                <div className="space-y-6">
                    {coreProblems.map((problem, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <problem.icon className={`h-6 w-6 ${problem.color} flex-shrink-0 mt-1`} />
                            <div>
                                <h3 className="text-xl font-semibold text-white">{problem.title}</h3> 
                                <p className="text-gray-400 text-base">{problem.description}</p> 
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Solution Column */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-t-4 border-amber-500 transition-all duration-500 hover:shadow-amber-500/20">
                <h2 className="text-3xl font-extrabold text-white mb-6 flex items-center">
                    <CheckCircle className="h-7 w-7 text-amber-500 mr-3" /> Our Reliable Guarantees
                </h2>
                <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                        <Shield className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold text-white">Verified Trust</h3> 
                            <p className="text-gray-400 text-base">Secure escrow payments and verified accounts protect both client funds and creative fees.</p> 
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <Search className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold text-white">Transparent Pricing</h3> 
                            <p className="text-gray-400 text-base">Clear service packages and community ratings remove all negotiation friction.</p> 
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <TrendingUp className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold text-white">Guaranteed Quality</h3> 
                            <p className="text-gray-400 text-base">Rigorously checked portfolios ensure you only work with proven professionals.</p> 
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <HeartHandshake className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-semibold text-white">Accountability Loop</h3>
                            <p className="text-gray-400 text-base">Formal ratings and reviews create a performance history, ensuring high standards and consequences for poor service.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- 3. Image & Text Row --- */}
        <section className="mb-24 bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto bg-amber-900/40 flex items-center justify-center p-12">
                    <Rocket className="w-24 h-24 text-amber-500 animate-bounce" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50"></div>
                </div>
                
                <div className="p-10 md:p-16 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        Fueling Rwanda's <span className="text-amber-500">Creative Growth</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-6">
                        We don't just connect—we empower. By centralizing the market, we provide creatives with predictable income and clients with reliable, high-quality service, driving the digital economy forward.
                    </p>
                    <Link to="/about">
                        <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 text-lg py-6 px-8 self-start">
                            Learn More About Our Impact
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
        
        {/* --- 4. Client Testimonials Section --- */}
        <section className="mb-24">
            <h2 className="text-4xl font-extrabold text-white text-center mb-12">
                What Our Clients Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((review, index) => (
                    <Card 
                        key={index} 
                        className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-amber-500/50 
                                   transition-transform duration-300 hover:scale-[1.03]"
                    >
                        <CardContent className="p-0">
                            <Quote className="h-7 w-7 text-amber-500 mb-4 opacity-70" />
                            <p className="italic text-base text-gray-300 mb-4">"{review.quote}"</p> 
                            <div className="text-right">
                                <p className="font-semibold text-white text-base">— {review.name}</p> 
                                <p className="text-sm text-amber-500">{review.city}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* --- 5. Top-Rated Creatives Showcase (CAROUSEL) --- */}
        <section className="mb-24">
            <h2 className="text-4xl font-extrabold text-white text-center mb-12">
                Book The <span className="text-amber-500">Highest Rated</span> Talent
            </h2>
            
            <Carousel
                opts={{
                    align: "start",
                    loop: true, // FIXED: Enables continuous cycling
                }}
                className="w-full max-w-5xl mx-auto"
            >
                <CarouselContent className="-ml-4">
                    {featuredCreatives.map((creative, index) => (
                        <CarouselItem 
                            key={index} 
                            // Renders 1 on mobile, 2 on medium, 3 on large screens
                            className="pl-4 basis-full md:basis-1/2 lg:basis-1/3" 
                        >
                            <Link to={creative.profileLink}>
                                <Card 
                                    className="bg-gray-800 p-6 rounded-xl border border-amber-500/50 shadow-xl 
                                               transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 text-center h-full"
                                >
                                    {/* Card Header contains Title and Rating (Text First) */}
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle className="text-xl font-bold text-white hover:text-amber-500 mb-2">{creative.name}</CardTitle>
                                        <div className="flex items-center justify-center space-x-1">
                                            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                            <span className="text-lg font-semibold text-amber-400">{creative.rating}</span>
                                        </div>
                                    </CardHeader>
                                    
                                    {/* --- PROFILE PICTURE/LOGO PLACEHOLDER (Moved & Enlarged) --- */}
                                    <div className="flex justify-center mb-6">
                                        <div className="h-20 w-20 rounded-full bg-gray-700 border-2 border-amber-500 flex items-center justify-center">
                                            <User className="h-10 w-10 text-amber-500" /> 
                                        </div>
                                    </div>
                                    
                                    <CardContent className="p-0">
                                        <p className="text-gray-400 text-base mb-2">{creative.category} Specialist</p>
                                        <p className="text-sm text-gray-500">Completed: **{creative.bookings}**</p>
                                        <Button className="mt-4 w-full bg-amber-500 text-gray-900 hover:bg-amber-400 py-5 text-base">View Profile</Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                {/* FIXED: Spacing added with negative margins */}
                <CarouselPrevious className="-left-12 hidden md:flex" /> 
                <CarouselNext className="-right-12 hidden md:flex" />
            </Carousel>
            
            <div className="text-center mt-12">
                <Link to="/services">
                    <Button className="bg-gray-700 text-white hover:bg-gray-600 text-lg py-6 px-8 transition-colors">
                        Explore All 100+ Creatives
                    </Button>
                </Link>
            </div>
        </section>

        {/* --- 6. Service Showcase Grid --- */}
        <section className="mb-20 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-12">
                Explore Our Core <span className="text-amber-500">Service Categories</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreServices.map((service, index) => (
                    <Card 
                        key={service.id} 
                        className="bg-gray-800 border-amber-500/50 shadow-xl shadow-amber-500/10 
                                   transition-all duration-500 hover:scale-[1.05] 
                                   transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/30"
                    >
                        <CardHeader className="text-center space-y-4 pt-8">
                            <service.icon className="h-12 w-12 text-amber-500 mx-auto" />
                            <CardTitle className="text-xl font-bold text-white">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-400 text-base text-center">{service.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
}