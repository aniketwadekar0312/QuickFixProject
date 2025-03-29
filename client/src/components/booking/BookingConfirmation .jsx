import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {verifyPayment} from "../../api/bookingApi"

const BookingConfirmation = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const { toast } = useToast();
    useEffect(() => {
        const confirmBooking = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const session_id = urlParams.get("session_id");
            
            if (!session_id) {
                setError("Invalid session ID.");
                setLoading(false);
                return;
            }

            // const storedBookingData = localStorage.getItem("pendingBooking");
            // if (!storedBookingData) {
            //     setError("No booking data found.");
            //     setLoading(false);
            //     return;
            // }

           // const bookingData = JSON.parse(storedBookingData);

            try {
                // const response = await axios.post(
                //     "http://localhost:5000/api/v1/book",
                //     { session_id, ...bookingData },
                //     { withCredentials: true }
                // );
                const res = await verifyPayment({session_id: session_id});
                if (res.paymentStatus === "paid") {
                    toast({
                      title: "Booking confirmed successfully!",
                      description: `your service is booked`,
                    });
                    navigate("/customer/dashboard");
                } else {
                    setError("Booking failed. ");
                }
            } catch (error) {
                setError("Error confirming booking. Please try again.");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        confirmBooking();
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {loading ? (
                <h2>Processing Booking...</h2>
            ) : error ? (
                <h2 style={{ color: "red" }}>{error}</h2>
            ) : (
                <h2 style={{ color: "green" }}>Booking confirmed! Redirecting...</h2>
            )}
        </div>
    );
};

export default BookingConfirmation;
