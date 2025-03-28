import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getBookingById, updateBookingStatus } from "@/api/bookingApi";
import { mockServices, mockWorkers } from "@/data/mockData";
import { format } from "date-fns";
import { 
  ArrowLeft,
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard, 
  User, 
  Briefcase, 
  CheckCircle, 
  XCircle,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch booking details manually
  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const data = await getBookingById(id);
        // console.log(data.booking);
        setBooking(data.booking);
      } catch (err) {
        setError("Failed to fetch booking details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const serviceDetails = booking?.service ? booking.service : null;
  const workerDetails = booking?.worker ? booking.worker : null;
  console.log("serviceDetails", serviceDetails, workerDetails);
  

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!id) return;

    setIsUpdating(true);
    try {
      await updateBookingStatus(id, "cancelled");
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      // Manually update state instead of refetching
      setBooking((prev) => prev ? { ...prev, status: "cancelled" } : prev);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "outline";
      case "confirmed":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

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
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-10">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
                  <p className="text-gray-600 mb-6">
                    The booking you're looking for doesn't exist or you don't have permission to view it.
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

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Booking Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Booking Details */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="border-b pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">
                          {serviceDetails?.name || "Service"}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">Booking #{id?.slice(-6)}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Date and Time */}
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Date and Time</h3>
                          <p className="text-gray-600">
                            {booking.date ? format(new Date(booking.date), 'PPP') : 'N/A'} at {booking.timeSlot}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Service Location</h3>
                          <p className="text-gray-600">{booking.address}</p>
                        </div>
                      </div>

                      {/* Worker Details */}
                      <div className="flex items-start space-x-3">
                        <User className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Service Provider</h3>
                          <p className="text-gray-600">
                            {workerDetails ? workerDetails.name : "Not assigned yet"}
                          </p>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="flex items-start space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium">Payment Method</h3>
                          <p className="text-gray-600">
                            {booking.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                          </p>
                          {booking.payment && (
                            <Badge variant={booking.payment.status === 'completed' ? 'default' : 'outline'} className="mt-2">
                              {booking.payment.status === 'completed' ? 'Paid' : 'Payment Pending'}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      {booking.additionalNotes && (
                        <div className="flex items-start space-x-3">
                          <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <h3 className="font-medium">Additional Notes</h3>
                            <p className="text-gray-600">{booking.additionalNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {booking.status === 'pending' && (
                    <CardFooter className="border-t pt-6">
                      <Button 
                        variant="destructive" 
                        onClick={handleCancelBooking}
                        disabled={isUpdating}
                        className="flex items-center space-x-2"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>Cancel Booking</span>
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee</span>
                        <span>₹{serviceDetails?.price || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee</span>
                        <span>₹49</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{booking.totalAmount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetails;