import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Star, Mail, MapPin, Camera, ArrowLeft, Calendar, User } from "lucide-react";

export function GiverProfile() {
  const { id } = useParams();
  const [giver, setGiver] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(false);

  useEffect(() => {
    // if (!id) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [giverRes, portfolioRes] = await Promise.all([
          fetch(`http://localhost:3001/api/giver/${id}`),
          fetch(`http://localhost:3001/api/giver/${id}/portfolio`),
        ]);

        if (!giverRes.ok) throw new Error("Failed to load giver details.");
        const giverData = await giverRes.json();
        setGiver(giverData);

        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json();
          setPortfolio(portfolioData);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60 text-amber-500">
        <Camera className="h-6 w-6 animate-spin mr-2" />
        <p>Loading profile...</p>
      </div>
    );

  if (!giver)
    return (
      <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <p>Creative not found.</p>
      </div>
    );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/services">
            <Button variant="ghost" className="text-amber-500 hover:text-amber-400">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Services
            </Button>
          </Link>
        </div>

        {/* --- Giver Info --- */}
        <Card className="bg-gray-800 border border-gray-700 mb-8">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-white">{giver.giver_name}</CardTitle>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" /> {giver.email}
              </p>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-2" /> {giver.city}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(giver.avg_review_rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {Number(giver.avg_review_rating || 0).toFixed(1)} / 5 ({giver.total_reviews} reviews)
              </p>
              <p className="text-lg text-amber-400 font-bold mt-2">
                RWF {Number(giver.hourly_rate_RWF || 0).toLocaleString()} / hr
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-gray-300 italic mt-2">{giver.bio}</p>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
              <p>
                <strong>Jobs Completed:</strong> {giver.total_jobs}
              </p>
              <p>
                <strong>Service:</strong> {giver.service_name}
              </p>
            </div>

            <div className="mt-6 text-right">
              <Button
                className="bg-green-500 hover:bg-green-400 text-gray-900"
                onClick={() => setSelectedBooking(true)}
              >
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* --- Portfolio Section --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Portfolio</h2>
          {portfolio.length === 0 ? (
            <p className="text-gray-400">No portfolio images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {portfolio.map((img) => (
                <div
                  key={img.image_id}
                  className="rounded-lg overflow-hidden border border-gray-700 hover:border-amber-500/40 transition-all"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3 bg-gray-800 text-sm text-gray-300">
                    {img.caption || "Untitled"}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(img.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- Recent Bookings --- */}
        <section>
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Recent Jobs</h2>
          {giver.recent_bookings && giver.recent_bookings.length > 0 ? (
            <div className="grid gap-4">
              {giver.recent_bookings.map((b) => (
                <Card key={b.booking_id} className="bg-gray-800 border border-gray-700">
                  <CardHeader className="flex justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{b.service_name}</CardTitle>
                      <p className="text-sm text-gray-400 flex items-center mt-1">
                        <User className="h-4 w-4 mr-2" /> {b.client_name}
                      </p>
                    </div>
                    <p className="text-amber-400 font-semibold">
                      {b.status} — RWF {Number(b.total_price_RWF).toLocaleString()}
                    </p>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(b.created_at).toLocaleDateString()}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No jobs found.</p>
          )}
        </section>
      </div>

      {/* --- Booking Modal --- */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(false)}>
          <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-500">
                Book {giver.giver_name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              <p>
                <strong>Service:</strong> {giver.service_name || "Custom Work"}
              </p>
              <p>
                <strong>Rate:</strong> RWF{" "}
                {Number(giver.hourly_rate_RWF || 0).toLocaleString()} / hr
              </p>

              <label className="block text-gray-400 text-sm mt-4">Select Date</label>
              <input
                type="date"
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              />

              <label className="block text-gray-400 text-sm mt-4">Project Details</label>
              <textarea
                placeholder="Describe your project..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              />

              <Button
                className="w-full bg-amber-500 text-gray-900 hover:bg-amber-400 mt-4"
                onClick={() => {
                  toast.success(`Booking request sent to ${giver.giver_name}!`);
                  setSelectedBooking(false);
                }}
              >
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
