import { toast } from "react-toastify";

export async function createBooking({
  giver_id,
  service_id,
  start_date,
  end_date,
  total_price_RWF,
}) {
  try {
    const client_id = localStorage.getItem("userId");
    if (!client_id) {
      toast.error("You must be logged in as a client to book.");
      return false;
    }

    const res = await fetch("http://localhost:3001/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giver_id,
        client_id: Number(client_id),
        service_id,
        start_date,
        end_date,
        total_price_RWF,
      }),
    });

    if (!res.ok) throw new Error("Booking failed.");
    const data = await res.json();
    toast.success("✅ Booking request sent successfully!");
    return data.booking;
  } catch (err) {
    toast.error(err.message);
    return false;
  }
}
