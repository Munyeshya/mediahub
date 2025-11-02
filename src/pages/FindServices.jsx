// src/pages/FindServices.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, Search, User, CheckCircle, ArrowLeft, ArrowRight, Tag } from "lucide-react"; // <-- Added Tag icon

// --- Mock Data ---
const CATEGORIES = ['Photography', 'Videography', 'Audio Production', 'Graphics & Design', 'Web Development'];
const PRICE_LEVELS = ['$', '$$', '$$$'];

// Generates 16 mock creatives (to better test the 4-per-row layout)
const MOCK_CREATIVES = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: `Creative Studio ${i + 1}`,
    category: CATEGORIES[i % CATEGORIES.length],
    rating: (4.0 + (i % 10) * 0.1).toFixed(1),
    priceLevel: PRICE_LEVELS[i % PRICE_LEVELS.length],
    bookings: (10 + i * 5) + '+',
    isVerified: i % 3 === 0,
    // 💥 UPGRADE: Added mock skill tags for demonstration
    skills: ['Figma', 'Premiere Pro', 'Drone Ops', 'SEO', 'Mobile', 'Events'].sort(() => 0.5 - Math.random()).slice(0, 3) 
}));

// --- 1. Filter Components (Left Sidebar) ---

function FiltersPanel() {
    return (
        // Sticky top-20 keeps the filter panel visible as the user scrolls the results
        <div className="p-4 bg-gray-800 rounded-xl shadow-xl border border-gray-700 sticky top-20 ">
            <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center">
                <Filter className="h-6 w-6 mr-2" /> Filters
            </h2>

            {/* Keyword Search */}
            <div className="mb-6 pb-4 border-b border-gray-700">
                <Label htmlFor="search" className="text-white mb-2 block font-semibold">Keyword Search</Label>
                <div className="relative">
                    <Input id="search" placeholder="E.g. 'Wedding Photographer'" className="pl-10 bg-gray-900 border-gray-600 text-white" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
            </div>

            {/* Categories Filter */}
            <div className="mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Service Category</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={`cat-${category}`} className="border-amber-500 data-[state=checked]:bg-amber-500" />
                            <Label htmlFor={`cat-${category}`} className="text-gray-300">{category}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Min Rating Filter */}
            <div className="mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Min Rating</h3>
                <div className="space-y-2">
                    {[5.0, 4.5, 4.0, 3.5].map((minRating) => (
                        <div key={minRating} className="flex items-center space-x-2">
                            <Checkbox id={`rating-${minRating}`} className="border-amber-500 data-[state=checked]:bg-amber-500" />
                            <Label htmlFor={`rating-${minRating}`} className="text-gray-300 flex items-center">
                                <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                                {minRating} & Up
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Hourly Rate (RWF)</h3>
                <Slider 
                    defaultValue={[10000, 50000]} 
                    max={100000} 
                    step={1000} 
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>RWF 10,000</span>
                    <span>RWF 100,000+</span>
                </div>
            </div>

            {/* Verification Status */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Verification</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox id="verified" className="border-amber-500 data-[state=checked]:bg-amber-500" />
                    <Label htmlFor="verified" className="text-gray-300">MediaHub Verified Only</Label>
                </div>
            </div>

            <Button className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400 font-bold">Apply Filters</Button>
            <Button variant="ghost" className="w-full mt-2 text-gray-400 hover:text-white">Clear Filters</Button>
        </div>
    );
}

// --- 2. Service Card Component (ULTRA COMPACT FINAL DESIGN) ---

function ServiceCard({ creative }) {
    // Determine how many tags to show and if an overflow count is needed
    const visibleSkills = creative.skills.slice(0, 2); // Show first 2 tags
    const overflowCount = creative.skills.length - visibleSkills.length;

    return (
        <Card 
            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-amber-500/50 
                       transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 h-full flex flex-col"
        >
            {/* Header/Logo (Compact) */}
            <CardHeader className="p-3 flex flex-row items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-2">
                    {/* Icon kept small */}
                    <div className="h-8 w-8 rounded-full bg-gray-700 border border-amber-500 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        {/* Name: text-sm */}
                        <CardTitle className="text-sm font-bold text-white leading-tight">
                            {creative.name}
                        </CardTitle>
                        {/* Category: text-xs */}
                        <p className="text-xs text-gray-400">{creative.category}</p>
                    </div>
                </div>
                {creative.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" title="MediaHub Verified" />
                )}
            </CardHeader>

            {/* Content (Ultra-Compact) */}
            <CardContent className="p-3 flex-grow flex flex-col justify-between">
                
                {/* Rating & Price */}
                <div className="flex justify-between items-center mb-3">
                    {/* Rating Section (Compact) */}
                    <div className="flex items-center space-x-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-400">{creative.rating}</span>
                        <span className="text-xs text-gray-500">({creative.bookings} done)</span>
                    </div>
                    
                    {/* Price Level (Compact) */}
                    <p className="text-sm font-bold text-white">
                        {creative.priceLevel}
                    </p>
                </div>

                {/* 💥 UPGRADE: Skill Tags Section */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {visibleSkills.map(skill => (
                        <span key={skill} className="text-xs font-medium bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center">
                            <Tag className="h-3 w-3 mr-1" />{skill}
                        </span>
                    ))}
                    {/* Overflow Tag */}
                    {overflowCount > 0 && (
                        <span className="text-xs font-medium bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full border border-gray-600">
                            +{overflowCount} more
                        </span>
                    )}
                </div>
                {/*  (Illustrates the compact tag design) */}

                {/* Button: Icon only, smaller size */}
                <Button 
                    className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400 font-bold mt-auto h-8 text-sm p-0 flex justify-center items-center"
                    aria-label="View Profile" 
                >
                    <ArrowRight className="h-4 w-4" /> 
                </Button>
            </CardContent>
        </Card>
    );
}

// --- 3. Pagination Component (Unchanged) ---
// ... (PaginationControls component remains the same) ...
function PaginationControls({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex justify-between items-center mt-10 ">
            <Button 
                variant="outline" 
                className="text-amber-500 border-amber-500 hover:bg-amber-900/20 disabled:opacity-50"
                disabled={currentPage === 1}
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            
            <div className="text-gray-400">
                Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span>
            </div>
            
            <Button 
                className="bg-amber-500 text-gray-900 hover:bg-amber-400 disabled:opacity-50"
                disabled={currentPage === totalPages}
            >
                Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
}


// --- 4. Main FindServices Page Component (Unchanged) ---

export function FindServices() {
    // Mock state for results and pagination
    const totalCreatives = 76; // Hypothetical total
    const resultsPerPage = 16;
    const totalPages = Math.ceil(totalCreatives / resultsPerPage);
    const currentPage = 1; // Start on page 1

    return (
        <div className="bg-gray-900 text-white min-h-screen bg-abstract-motion
     animate-spark-1 animate-spark-2 animate-spark-3 animate-spark-4 animate-spark-5 
     animate-spark-6 animate-spark-7 animate-spark-8 animate-spark-9 animate-spark-10 
     animate-spark-11 animate-spark-12 animate-spark-13 animate-spark-14 animate-spark-15">
            <div className="mx-auto max-w-7xl px-8 py-12 md:py-16">
                
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-12 border-b-2 border-amber-500/50 pb-4">
                    Find the Perfect <span className="text-amber-500">Creative Service</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
                    
                    {/* Left Column: Filters */}
                    <aside>
                        <FiltersPanel />
                    </aside>
                    
                    {/* Right Column: Results */}
                    <main>
                        
                        {/* Results Summary and Sorting */}
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-300">
                                Showing {resultsPerPage} of {totalCreatives} results
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="sort" className="text-gray-400">Sort by:</Label>
                                <select 
                                    id="sort" 
                                    className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-sm"
                                >
                                    <option>Best Match</option>
                                    <option>Highest Rated</option>
                                    <option>Most Booked</option>
                                    <option>Price: Low to High</option>
                                </select>
                            </div>
                        </div>

                        {/* Service Results Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {MOCK_CREATIVES.map((creative) => (
                                <ServiceCard key={creative.id} creative={creative} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <PaginationControls 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={() => console.log('Page change functionality would go here')}
                        />

                    </main>
                </div>
            </div>
        </div>
    );
}