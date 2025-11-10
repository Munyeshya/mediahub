import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import {
  Star,
  Mail,
  MapPin,
  Camera,
  Calendar,
  User,
  RotateCw,
  CreditCard,
  CheckCircle,
  Smartphone,
} from "lucide-react";

export function BookingDetails() {
  const { bookingId } = useParams();
  const [data, setData] = useState(null);
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    number: "",
  });
  const [processing, setProcessing] = useState(false);

  // ✅ Fetch booking + review
  useEffect(() => {
    const fetchBookingAndReview = async () => {
      try {
        const [bookingRes, reviewRes] = await Promise.all([
          fetch(`http://localhost:3001/api/bookings/${bookingId}`),
          fetch(`http://localhost:3001/api/bookings/${bookingId}/review`),
        ]);

        if (!bookingRes.ok) throw new Error("Failed to fetch booking details");
        const bookingData = await bookingRes.json();
        setData(bookingData);
        setPaid(bookingData.is_paid || false);

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          setReview(reviewData);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingAndReview();
  }, [bookingId]);

  // ✅ Simulate payment processing
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentInfo.name || !paymentInfo.number)
      return toast.error("Please fill in all payment details.");

    setProcessing(true);
    toast.info("Processing payment... 💳");

    setTimeout(() => {
      setPaid(true);
      setProcessing(false);
      setShowPaymentModal(false);
      toast.success("Payment successful! ✅");
    }, 2500);
  };

  // ✅ Handle review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating.");

    try {
      setSubmitting(true);
      const method = review ? "PUT" : "POST";
      const endpoint = review
        ? `http://localhost:3001/api/reviews/${review.review_id}`
        : `http://localhost:3001/api/reviews`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          giver_id: data.giver_id,
          client_id: data.client_id,
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review.");

      const updated = await res.json();
      toast.success(review ? "Review updated ✏️" : "Review submitted 🎉");
      setReview(updated);
      setEditing(false);
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60 text-amber-500">
        <RotateCw className="h-6 w-6 animate-spin mr-2" />
        <p>Loading booking details...</p>
      </div>
    );

  if (!data)
    return (
      <div className="text-center text-gray-400 bg-gray-800 p-6 rounded-lg border border-gray-700">
        <p>Booking not found.</p>
      </div>
    );

  const renderStars = (value) => {
    const fullStars = Math.floor(value);
    const hasHalf = value % 1 !== 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) stars.push("fill-amber-400 text-amber-400");
      else if (i === fullStars + 1 && hasHalf)
        stars.push("fill-amber-300/50 text-amber-300/50");
      else stars.push("text-gray-600");
    }

    return (
      <div className="flex items-center space-x-1">
        {stars.map((cls, i) => (
          <Star key={i} className={`h-4 w-4 ${cls}`} />
        ))}
        <span className="ml-2 text-sm text-gray-400">
          {Number(value || 0).toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* --- Booking Info --- */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Camera className="h-5 w-5 text-amber-500" />
            <span>Booking Information</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-300">
          <div className="border-b border-gray-700 pb-3">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <User className="h-5 w-5 text-amber-500" />
              <span>{data.giver_name}</span>
            </h3>
            <p className="text-sm text-gray-400 flex items-center space-x-2 mt-1">
              <Mail className="h-4 w-4" /> <span>{data.giver_email}</span>
            </p>
            <p className="text-sm text-gray-400 flex items-center space-x-2">
              <MapPin className="h-4 w-4" /> <span>{data.city}</span>
            </p>
            {renderStars(data.giver_rating || 0)}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-amber-500 mb-1">
              Service Details
            </h4>
            <p><strong>Service:</strong> {data.service_name}</p>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Total:</strong> RWF {Number(data.total_price_RWF).toLocaleString()}</p>
            <p className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{data.start_date} → {data.end_date}</span>
            </p>
          </div>

          {/* ✅ Payment Section */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <h4 className="text-lg font-semibold text-amber-500 mb-2">Payment</h4>
            {paid ? (
              <div className="flex items-center text-green-400 space-x-2">
                <CheckCircle className="h-5 w-5" />
                <p>Payment completed successfully</p>
              </div>
            ) : (
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-green-500 text-gray-900 hover:bg-green-400 font-semibold"
              >
                <CreditCard className="h-4 w-4 mr-2" /> Pay Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* --- Review Section --- */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Client Review</span>
            {review && !editing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
                className="border-amber-500 text-amber-500 hover:bg-amber-900/20"
              >
                Edit Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {review && !editing ? (
            <div className="space-y-3 text-gray-300">
              <h4 className="text-amber-400 font-semibold text-lg">Your Review</h4>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-400">
                  {review.rating} / 5
                </span>
              </div>
              <p className="italic text-gray-400 border-t border-gray-700 pt-2">
                “{review.comment}”
              </p>
              <p className="text-xs text-gray-500">
                Posted on {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      star <= (hover || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Comment</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your experience..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900"
              >
                {submitting
                  ? "Submitting..."
                  : review
                  ? "Update Review"
                  : "Submit Review"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* --- PAYMENT MODAL --- */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-500">
              Complete Payment
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePaymentSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-gray-400 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="momo">Mobile Money</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">
                {paymentMethod === "card" ? "Card Number" : "Phone Number"}
              </label>
              <input
                type="text"
                value={paymentInfo.number}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, number: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                placeholder={
                  paymentMethod === "card" ? "1234 5678 9012 3456" : "07XX XXX XXX"
                }
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Name on Card / Account</label>
              <input
                type="text"
                value={paymentInfo.name}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, name: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white"
                placeholder="John Doe"
              />
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-semibold"
            >
              {processing ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" /> Processing Payment...
                </>
              ) : (
                <>
                  {paymentMethod === "card" ? (
                    <CreditCard className="h-4 w-4 mr-2" />
                  ) : (
                    <Smartphone className="h-4 w-4 mr-2" />
                  )}
                  Pay RWF {Number(data.total_price_RWF).toLocaleString()}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
