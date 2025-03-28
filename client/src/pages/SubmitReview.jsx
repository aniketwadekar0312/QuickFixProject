import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import ReviewForm from "@/components/reviews/ReviewForm";
import { getBookingById } from "@/api/bookingApi";

const SubmitReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getBookingById(id);
        setBooking(data.booking);
        
        // If booking is not completed, show error
        if (data.booking?.status !== "completed") {
          setError("This booking cannot be reviewed yet.");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading booking details...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !booking) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2" 
              onClick={() => navigate('/customer/dashboard')}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2">Cannot Submit Review</h2>
                  <p className="text-gray-600 mb-4">
                    {error || "The booking you're trying to review doesn't exist or hasn't been completed yet."}
                  </p>
                  <Button onClick={() => navigate('/customer/dashboard')}>
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
  
  const service = booking.service;
  const worker = booking.worker;
  
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2" 
            onClick={() => navigate('/customer/dashboard')}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Submit a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{service?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Provider</p>
                    <p className="font-medium">{worker?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {booking.date instanceof Date 
                        ? booking.date.toLocaleDateString() 
                        : new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">₹{booking.totalAmount}</p>
                  </div>
                </div>
              </div>
              
              <ReviewForm bookingId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitReview;