// src/pages/FindServices.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, Search, User, CheckCircle, ArrowLeft, ArrowRight, Tag } from "lucide-react";

// --- Mock Data (Unchanged) ---
const CATEGORIES = ['Photography', 'Videography', 'Audio Production', 'Graphics & Design', 'Web Development'];
const PRICE_LEVELS = ['$', '$$', '$$$'];

// Generates 16 mock creatives
const MOCK_CREATIVES = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: `Creative Studio ${i + 1}`,
    category: CATEGORIES[i % CATEGORIES.length],
    rating: (4.0 + (i % 10) * 0.1).toFixed(1),
    priceLevel: PRICE_LEVELS[i % PRICE_LEVELS.length],
    bookings: (10 + i * 5) + '+',
    isVerified: i % 3 === 0,
    skills: ['Figma', 'Premiere Pro', 'Drone Ops', 'SEO', 'Mobile', 'Events'].sort(() => 0.5 - Math.random()).slice(0, 3) 
}));

// --- 1. Filter Components (Left Sidebar) ---

function FiltersPanel() {
    return (
        // 💥 CHANGE 1: Filter Panel Background and Border
        <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 sticky top-20">
            <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center">
                <Filter className="h-6 w-6 mr-2" /> Filters
            </h2>

            {/* Keyword Search */}
            <div className="mb-6 pb-4 border-b border-gray-200"> {/* 💥 CHANGE 2: Border */}
                <Label htmlFor="search" className="text-gray-900 mb-2 block font-semibold">Keyword Search</Label> {/* 💥 CHANGE 3: Label Text Color */}
                <div className="relative">
                    {/* 💥 CHANGE 4: Input Colors */}
                    <Input id="search" placeholder="E.g. 'Wedding Photographer'" className="pl-10 bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500" />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
            </div>

            {/* Categories Filter */}
            <div className="mb-6 pb-4 border-b border-gray-200"> {/* 💥 CHANGE 2: Border */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Category</h3> {/* 💥 CHANGE 3: Text Color */}
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={`cat-${category}`} className="border-amber-500 data-[state=checked]:bg-amber-500" />
                            <Label htmlFor={`cat-${category}`} className="text-gray-700">{category}</Label> {/* 💥 CHANGE 5: Checkbox Label Color */}
                        </div>
                    ))}
                </div>
            </div>

            {/* Min Rating Filter */}
            <div className="mb-6 pb-4 border-b border-gray-200"> {/* 💥 CHANGE 2: Border */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Min Rating</h3> {/* 💥 CHANGE 3: Text Color */}
                <div className="space-y-2">
                    {[5.0, 4.5, 4.0, 3.5].map((minRating) => (
                        <div key={minRating} className="flex items-center space-x-2">
                            <Checkbox id={`rating-${minRating}`} className="border-amber-500 data-[state=checked]:bg-amber-500" />
                            <Label htmlFor={`rating-${minRating}`} className="text-gray-700 flex items-center"> {/* 💥 CHANGE 5: Checkbox Label Color */}
                                <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                                {minRating} & Up
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-4 border-b border-gray-200"> {/* 💥 CHANGE 2: Border */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Rate (RWF)</h3> {/* 💥 CHANGE 3: Text Color */}
                <Slider 
                    defaultValue={[10000, 50000]} 
                    max={100000} 
                    step={1000} 
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2"> {/* 💥 CHANGE 6: Secondary Text Color */}
                    <span>RWF 10,000</span>
                    <span>RWF 100,000+</span>
                </div>
            </div>

            {/* Verification Status */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Verification</h3> {/* 💥 CHANGE 3: Text Color */}
                <div className="flex items-center space-x-2">
                    <Checkbox id="verified" className="border-amber-500 data-[state=checked]:bg-amber-500" />
                    <Label htmlFor="verified" className="text-gray-700">MediaHub Verified Only</Label> {/* 💥 CHANGE 5: Checkbox Label Color */}
                </div>
            </div>

            <Button className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400 font-bold">Apply Filters</Button>
            {/* 💥 CHANGE 7: Ghost Button Text Color */}
            <Button variant="ghost" className="w-full mt-2 text-gray-600 hover:text-gray-900">Clear Filters</Button> 
        </div>
    );
}

// --- 2. Service Card Component (Light Theme) ---

function ServiceCard({ creative }) {
    const visibleSkills = creative.skills.slice(0, 2);
    const overflowCount = creative.skills.length - visibleSkills.length;

    return (
        <Card 
            // 💥 CHANGE 8: Card Background and Border
            className="bg-white rounded-xl border border-gray-200 hover:border-amber-500/50 
                       transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 h-full flex flex-col"
        >
            {/* Header/Logo (Compact) */}
            <CardHeader className="p-3 flex flex-row items-center justify-between border-b border-gray-200"> {/* 💥 CHANGE 9: Border */}
                <div className="flex items-center space-x-2">
                    {/* 💥 CHANGE 10: Icon Background */}
                    <div className="h-8 w-8 rounded-full bg-gray-100 border border-amber-500 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        {/* 💥 CHANGE 11: Text Color */}
                        <CardTitle className="text-sm font-bold text-gray-900 leading-tight">
                            {creative.name}
                        </CardTitle>
                        {/* 💥 CHANGE 12: Secondary Text Color */}
                        <p className="text-xs text-gray-500">{creative.category}</p>
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
                    <div className="flex items-center space-x-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-500">{creative.rating}</span>
                        <span className="text-xs text-gray-500">({creative.bookings} done)</span>
                    </div>
                    
                    {/* 💥 CHANGE 11: Text Color */}
                    <p className="text-sm font-bold text-gray-900">
                        {creative.priceLevel}
                    </p>
                </div>

                {/* Skill Tags Section */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {visibleSkills.map(skill => (
                        // Tags remain visually distinct with amber accent
                        <span key={skill} className="text-xs font-medium bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center">
                            <Tag className="h-3 w-3 mr-1" />{skill}
                        </span>
                    ))}
                    {/* 💥 CHANGE 13: Overflow Tag Colors */}
                    {overflowCount > 0 && (
                        <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full border border-gray-300">
                            +{overflowCount} more
                        </span>
                    )}
                </div>

                {/* Button (Unchanged, uses amber accent) */}
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

// --- 3. Pagination Component (Light Theme) ---

function PaginationControls({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="flex justify-between items-center mt-10">
            <Button 
                variant="outline" 
                className="text-amber-500 border-amber-500 hover:bg-amber-100/50 disabled:opacity-50"
                disabled={currentPage === 1}
            >
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            
            {/* 💥 CHANGE 14: Pagination Text Colors */}
            <div className="text-gray-600">
                Page <span className="text-gray-900 font-bold">{currentPage}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
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


// --- 4. Main FindServices Page Component (Light Theme) ---

export function FindServices() {
    const totalCreatives = 76;
    const resultsPerPage = 16;
    const totalPages = Math.ceil(totalCreatives / resultsPerPage);
    const currentPage = 1;

    return (
        // 💥 CHANGE 15: Main Page Background and Text Color
        <div className="bg-gray-50 text-gray-900 min-h-screen">
            <div className="mx-auto max-w-7xl px-8 py-12 md:py-16">
                
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-12 border-b-2 border-amber-500/50 pb-4">
                    Find the Perfect <span className="text-amber-600">Creative Service</span> {/* 💥 CHANGE 16: Accent Color for readability */}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
                    
                    {/* Left Column: Filters (Unchanged component call) */}
                    <aside>
                        <FiltersPanel />
                    </aside>
                    
                    {/* Right Column: Results */}
                    <main>
                        
                        {/* Results Summary and Sorting */}
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-300"> {/* 💥 CHANGE 17: Border */}
                            <h2 className="text-xl font-semibold text-gray-700"> {/* 💥 CHANGE 18: Text Color */}
                                Showing {resultsPerPage} of {totalCreatives} results
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="sort" className="text-gray-600">Sort by:</Label> {/* 💥 CHANGE 19: Label Color */}
                                <select 
                                    id="sort" 
                                    // 💥 CHANGE 20: Select Input Colors
                                    className="bg-white border border-gray-300 text-gray-900 rounded-md p-2 text-sm focus:border-amber-500"
                                >
                                    <option>Best Match</option>
                                    <option>Highest Rated</option>
                                    <option>Most Booked</option>
                                    <option>Price: Low to High</option>
                                </select>
                            </div>
                        </div>

                        {/* Service Results Grid (Unchanged component call) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {MOCK_CREATIVES.map((creative) => (
                                <ServiceCard key={creative.id} creative={creative} />
                            ))}
                        </div>

                        {/* Pagination (Unchanged component call) */}
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