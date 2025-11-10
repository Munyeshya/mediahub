import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, Search, User, CheckCircle, Tag, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { FramerParticleBackground } from "../components/common/FramerParticleBackground";

export function FindServices() {
  const [creatives, setCreatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: null,
    minRating: 0,
    verifiedOnly: false,
    minPrice: 0,
    maxPrice: 100000,
  });
  const [selectedGiver, setSelectedGiver] = useState(null);

  // 🔹 Fetch data with filters
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams(
          Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
          )
        ).toString();

        const res = await fetch(`http://localhost:3001/api/givers?${query}`);
        if (!res.ok) throw new Error("Failed to fetch creatives.");
        const json = await res.json();
        setCreatives(json);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [filters]);

  return (
    <div className="bg-gray-900 text-white min-h-screen relative">
      <FramerParticleBackground />
      <div className="mx-auto max-w-7xl px-8 py-12 md:py-16">
        <h1 className="text-4xl font-extrabold text-white mb-12 border-b-2 border-amber-500/50 pb-4">
          Find the Perfect <span className="text-amber-500">Creative</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* --- FILTER PANEL --- */}
          <aside className="p-4 bg-gray-800 rounded-xl border border-gray-700 sticky top-20">
            <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center">
              <Filter className="h-6 w-6 mr-2" /> Filters
            </h2>

            <Label className="text-white mb-2 block font-semibold">Keyword</Label>
            <Input
              placeholder="Search by name or category..."
              className="mb-4 bg-gray-900 border-gray-600 text-white"
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />

            <h3 className="text-lg font-semibold text-white mb-3">Min Rating</h3>
            {[5, 4, 3, 2].map((r) => (
              <div key={r} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`r-${r}`}
                  checked={filters.minRating === r}
                  onCheckedChange={() =>
                    setFilters({ ...filters, minRating: filters.minRating === r ? 0 : r })
                  }
                />
                <Label htmlFor={`r-${r}`} className="text-gray-300 flex items-center">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" /> {r}+ Stars
                </Label>
              </div>
            ))}

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">
              Verification
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={filters.verifiedOnly}
                onCheckedChange={(val) =>
                  setFilters({ ...filters, verifiedOnly: val })
                }
              />
              <Label htmlFor="verified" className="text-gray-300">
                Verified Only
              </Label>
            </div>

            <h3 className="text-lg font-semibold text-white mt-6 mb-2">
              Price Range (RWF)
            </h3>
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              min={0}
              max={200000}
              step={5000}
              onValueChange={([min, max]) =>
                setFilters({ ...filters, minPrice: min, maxPrice: max })
              }
            />
            <p className="text-gray-400 text-sm mt-2">
              {filters.minPrice.toLocaleString()} – {filters.maxPrice.toLocaleString()}
            </p>
          </aside>

          {/* --- RESULTS --- */}
          <main>
            {isLoading ? (
              <p className="text-amber-500">Loading creatives...</p>
            ) : creatives.length === 0 ? (
              <p className="text-gray-400">No creatives found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creatives.map((c) => (
                  <Card
                    key={c.giver_id}
                    className="bg-gray-800 border border-gray-700 hover:border-amber-500/50 transition-all"
                  >
                    <CardHeader className="flex flex-row items-center justify-between border-b border-gray-700">
                      <div>
                        <CardTitle className="text-white text-sm font-bold">
                          {c.giver_name}
                        </CardTitle>
                        <p className="text-xs text-gray-400">{c.service_name}</p>
                      </div>
                      {c.is_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : null}
                    </CardHeader>
                    <CardContent className="p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="text-sm text-amber-400">
                            {Number(c.avg_rating || 0).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-300">
                          RWF {Number(c.price_RWF).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3">
                        {c.bio || "No bio provided."}
                      </p>
                      <Button
                        onClick={() => setSelectedGiver(c)}
                        className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* --- MODAL --- */}
      {selectedGiver && (
        <Dialog open={!!selectedGiver} onOpenChange={() => setSelectedGiver(null)}>
          <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-500">
                {selectedGiver.giver_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <p>
                <strong>Email:</strong> {selectedGiver.email}
              </p>
              <p>
                <strong>Service:</strong> {selectedGiver.service_name}
              </p>
              <p>
                <strong>Rate:</strong> RWF{" "}
                {Number(selectedGiver.price_RWF).toLocaleString()} / hr
              </p>
              <p>
                <strong>Bio:</strong> {selectedGiver.bio}
              </p>
              <p>
                <strong>Rating:</strong> ⭐{" "}
                {Number(selectedGiver.avg_rating || 0).toFixed(1)}
              </p>
              <Button className="w-full bg-green-500 text-gray-900 hover:bg-green-400 mt-4">
                Book Now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
