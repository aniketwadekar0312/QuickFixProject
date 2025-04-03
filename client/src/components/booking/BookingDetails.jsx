import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard, 
  FileText, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Star,
  Loader2
} from "lucide-react";
import { getBookingById, updateBookingStatus, getBookingReviews } from "@/api/bookingApi";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [service, setService] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [worker, setWorker] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        let data = await getBookingById(id);
        
        setBooking(data.booking);
        
        if (data.booking.service) setService(data.booking.service);
        if (data.booking.customer) setCustomer(data.booking.customer);
        if (data.booking.worker) setWorker(data.booking.worker);
        
        // Check if the booking has been reviewed
        // In a real app, this would come from an API call
        setHasReviewed(data.rating !== undefined);
        
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast({
          title: "Error",
          description: "Failed to load booking details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id, toast]);
  
  // Handle booking cancellation
  const handleCancel = async () => {
    if (!booking || !id) return;
    
    setIsActionLoading(true);
    
    try {
      await updateBookingStatus(id, "rejected"); // Changed from "cancelled" to "rejected"
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      
      // Update the local booking state
      setBooking({
        ...booking,
        status: "rejected" // Changed from "cancelled" to "rejected"
      });
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };
  
  // Handle booking acceptance by worker
  const handleAccept = async () => {
    if (!booking || !id) return;
    
    setIsActionLoading(true);
    
    try {
      await updateBookingStatus(id, "accepted");
      
      toast({
        title: "Booking Accepted",
        description: "You have successfully accepted this booking.",
      });
      
      // Update the local booking state
      setBooking({
        ...booking,
        status: "accepted"
      });
      
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast({
        title: "Error",
        description: "Failed to accept booking.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };
  
  // Handle booking rejection by worker
  const handleReject = async () => {
    if (!booking || !id) return;
    
    setIsActionLoading(true);
    
    try {
      await updateBookingStatus(id, "rejected");
      
      toast({
        title: "Booking Rejected",
        description: "You have rejected this booking.",
      });
      
      // Update the local booking state
      setBooking({
        ...booking,
        status: "rejected"
      });
      
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast({
        title: "Error",
        description: "Failed to reject booking.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Loading booking details...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  // console.log(booking);
  
  if (!booking) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
                  <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
                  <Button onClick={() => navigate('/customer/dashboard')}>Return to Dashboard</Button>
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
            className="mb-6 flex items-center gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Booking #{booking._id
                      // .slice(-6)
                      }</p>
                      <CardTitle className="text-xl md:text-2xl">
                        {service?.name}
                      </CardTitle>
                    </div>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-500 mb-3">Booking Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Date</p>
                            <p className="text-gray-600">
                              {booking.date instanceof Date 
                                ? booking.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                                : new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">TimeSlot</p>
                            <p className="text-gray-600">{booking.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Location</p>
                            <p className="text-gray-600">{booking.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-500 mb-3">Payment Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <CreditCard className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Payment Status</p>
                            <Badge variant={booking.payment.status === "completed" ? "default" : "outline"}>
                              {console.log(booking.payment)}
                              {booking.payment.status.charAt(0).toUpperCase() + booking.payment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium">Service Fee</p>
                            <p className="text-gray-600">₹{booking.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="font-medium text-gray-500 mb-3">Service Provider</h3>
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                        {worker?.photoUrl ? (
                          <img src={worker.photoUrl} alt={worker?.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{worker?.name}</p>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{worker?.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>{worker?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 justify-end">
                    {currentUser?.role === "customer" && booking.status === "pending" && (
                      <Button 
                        variant="destructive" 
                        onClick={handleCancel}
                        disabled={isActionLoading}
                      >
                        {isActionLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Cancel Booking"
                        )}
                      </Button>
                    )}
                    
                    {currentUser?.role === "worker" && booking.status === "pending" && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={handleReject}
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            "Reject"
                          )}
                        </Button>
                        <Button
                          onClick={handleAccept}
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Accepting...
                            </>
                          ) : (
                            "Accept"
                          )}
                        </Button>
                      </>
                    )}
                    
                    {currentUser?.role === "customer" && booking.status === "completed" && !hasReviewed && (
                      <Button asChild>
                        <Link to={`/booking/${booking._id}/review`}>
                          <Star className="h-4 w-4 mr-2" />
                          Leave a Review
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {service && (
                    <div className="space-y-4">
                      <div className="aspect-video rounded-md bg-gray-100 overflow-hidden">
                        <img 
                          src={service.image || "/placeholder.svg"} 
                          alt={service.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-lg">{service.name}</h3>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Service Fee</span>
                        <span className="font-medium">₹{booking.totalAmount}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper function to determine badge variant based on status
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "pending":
      return "outline";
    case "accepted":
      return "secondary";  
    case "completed":
      return "default";
    case "rejected":
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export default BookingDetails;