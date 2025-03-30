import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getBookingByCustomerId } from "../api/bookingApi";
import { getCustomerReviews, updateReview, deleteReview } from "@/api/reviewApi";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, ClipboardList, MapPin, Clock, CreditCard, Trash2, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [editingReview, setEditingReview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [reviewToDelete, setReviewToDelete] = useState(null);
  

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "outline";
      case "accepted":
        return "secondary";
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
};

const handleBookingClick = (bookingId) => {
  navigate(`/booking/${bookingId}`);
};

  const getCustomerBookings = async () => {
    try {
      const res = await getBookingByCustomerId();

      if (Array.isArray(res.bookings)) {
        setBookings(res.bookings);
      } else {
        console.warn("Bookings data is not an array:", res.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    getCustomerBookings();
  }, []);
  const formattedDate = (date) => {
    const dateString = new Date(date);
    const formattedDate = dateString.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };



  // Fetch reviews using React Query
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: getCustomerReviews
  });

  // Update review mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
      setIsDialogOpen(false);
      setEditingReview(null);
      toast.success('Review updated successfully');
    },
    onError: () => {
      toast.error('Failed to update review');
    }
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
      toast.success('Review deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete review');
    }
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateMutation.mutate({
      id: editingReview._id,
      data: {
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment')
      }
    });
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={
                        currentUser?.photoUrl ||
                        "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?t=st=1742568984~exp=1742572584~hmac=eda45c968a953e5a2780fb6cc1f3aec1501576925abbf55247243029d0aee3a0&w=740"
                      }
                      alt={currentUser?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold">{currentUser?.name}</h2>
                  <p className="text-gray-600 mb-4">{currentUser?.email}</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link to="/profile">Edit Profile</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/services">
                      <Clock className="h-4 w-4 mr-2" />
                      Book a Service
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/workers">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Find Workers
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/customer/payment-methods">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>

              <Tabs defaultValue="bookings" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                  <TabsTrigger value="history">Booking History</TabsTrigger>
                  <TabsTrigger value="reviews">My Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="bookings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {bookings.length > 0 ? (
                        <div className="space-y-4">
                          {bookings.map((booking, index) => (
                            <div
                              key={booking._id || index}
                              className="border rounded-lg p-4 hover:border-brand-200 transition-colors cursor-pointer hover:bg-gray-50"
                                onClick={() => handleBookingClick(booking._id)}
                            >
                              <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {booking.service.name}
                                  </h3>
                                  <p className="text-gray-600">
                                    Service Provider: {booking?.worker?.name}
                                  </p>
                                  <div className="flex items-center text-gray-600 mt-2">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>
                                      {formattedDate(booking?.date)} at{" "}
                                      {booking?.timeSlot}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="capitalize">{booking?.worker.location || ""}</span>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-col items-end">
                                  <Badge
                                    variant={getStatusBadgeVariant(
                                      booking?.status
                                    )}
                                  >
                                    {booking?.status.charAt(0).toUpperCase() +
                                      booking?.status.slice(1)}
                                  </Badge>
                                  <div className="mt-2 font-semibold">
                                    ₹{booking?.totalAmount}
                                  </div>
                                  <Badge
                                    variant={
                                      booking?.payment?.status === "completed"
                                        ? "default"
                                        : "outline"
                                    }
                                    className="mt-2"
                                  >
                                    {booking?.payment?.status === "completed"
                                      ? "Paid"
                                      : "Payment Pending"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Current Bookings
                          </h3>
                          <p className="text-gray-600 mb-4">
                            You don't have any active bookings at the moment.
                          </p>
                          <Button asChild>
                            <Link to="/services">Book a Service</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {bookings.length > 0 &&
                      bookings?.filter((b) => b?.status === "completed")
                        .length > 0 ? (
                        <div className="space-y-4">
                          {bookings
                            .filter((b) => b.status === "completed")
                            .map((booking) => (
                              <div
                                key={booking._id}
                                className="border rounded-lg p-4 hover:border-brand-200 transition-colors cursor-pointer hover:bg-gray-50"
                                onClick={() => handleBookingClick(booking._id)}
                              >
                                <div className="flex flex-col md:flex-row justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {booking?.service?.name ||
                                        "Unknown Service"}
                                    </h3>
                                    <p className="text-gray-600">
                                      Service Provider:{" "}
                                      {booking?.worker?.name ||
                                        "Unknown Worker"}
                                    </p>
                                    <div className="flex items-center text-gray-600 mt-2">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>
                                        {formattedDate(booking?.date) || ""} at{" "}
                                        {booking?.timeSlot || ""}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="capitalize">{booking?.worker.location || ""}</span>
                                  </div>
                                    <div className="flex items-center">
                                      {booking?.rating && (
                                        <div className="flex items-center text-yellow-500 mr-4">
                                          {Array.from({ length: 5 }).map(
                                            (_, i) => (
                                              <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                  i < (booking.rating || 0)
                                                    ? "fill-yellow-400 stroke-yellow-400"
                                                    : "stroke-gray-300"
                                                }`}
                                              />
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {booking?.feedback && (
                                      <p className="text-sm text-gray-600 mt-1 italic">
                                        "{booking.feedback}"
                                      </p>
                                    )}
                                  </div>
                                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                                    <Badge variant="default">Completed</Badge>
                                    <div className="mt-2 font-semibold">
                                      ₹{booking?.totalAmount}
                                    </div>
                                    <Badge variant="default" className="mt-2">
                                      Paid
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Booking History
                          </h3>
                          <p className="text-gray-600">
                            You haven't completed any bookings yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* {reviewsLoading ? (
                        <div className="text-center py-8">Loading...</div>
                      ) : reviewsData?.reviews?.length > 0 ? ( */}

                      {bookings.filter((b) => b.rating).length > 0 ? (

                        <div className="space-y-4">
                          {reviewsData.reviews.map((review) => (
                            <div
                              key={review._id}
                              className="border rounded-lg p-4 hover:border-brand-200 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold">
                                        {review.booking.service.name}
                                      </h3>
                                      <p className="text-gray-600">
                                        Service Provider: {review.worker.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Dialog open={isDialogOpen && editingReview?._id === review._id} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              setEditingReview(review);
                                              setIsDialogOpen(true);
                                            }}
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Edit Review</DialogTitle>
                                          </DialogHeader>
                                          <form onSubmit={handleUpdate} className="space-y-4">
                                            <div>
                                              <label className="text-sm font-medium">Rating</label>
                                              <Input
                                                type="number"
                                                name="rating"
                                                defaultValue={review.rating}
                                                min="1"
                                                max="5"
                                                required
                                              />
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium">Comment</label>
                                              <Textarea
                                                name="comment"
                                                defaultValue={review.comment}
                                                required
                                              />
                                            </div>
                                            <Button type="submit" className="w-full">
                                              Update Review
                                            </Button>
                                          </form>
                                        </DialogContent>
                                      </Dialog>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setReviewToDelete(review)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete this review? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => {
                                                deleteMutation.mutate(review._id);
                                                setReviewToDelete(null);
                                              }}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-2">
                                    <div className="flex items-center text-yellow-500">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating
                                              ? "fill-yellow-400 stroke-yellow-400"
                                              : "stroke-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-gray-700 mt-2">
                                    "{review.comment}"
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Star className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Reviews Yet
                          </h3>
                          <p className="text-gray-600">
                            You haven't submitted any reviews for your completed
                            services.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
