import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  User,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Settings,
  DollarSign,
  Clipboard,
  Check,
  AlertCircle,
} from "lucide-react";
import PendingRequests from "@/components/booking/PendingRequests";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkerBookings,
  updateWorkerAvailability,
  updateBookingStatus,
  getWorkerProfile,
  getWorkerEarnings,
  getWorkerReviewAndUpdate,
} from "@/api/workerApi";
import { getWorkerReviews } from "../api/reviewApi";

const WorkerDashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState();

  const workerId = currentUser?._id;
  // Fetch worker data using React Query
  const { data: workerProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["workerProfile", workerId],
    queryFn: getWorkerProfile(workerId),
    enabled: !!currentUser,
    staleTime: 2 * 60 * 1000,  // Reduce stale time
  cacheTime: 10 * 60 * 1000,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["workerBookings"],
    queryFn: getWorkerBookings,
    enabled: !!currentUser,
    staleTime: 2 * 60 * 1000,  // Reduce stale time
    cacheTime: 10 * 60 * 1000,
  });

  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ["workerEarnings"],
    queryFn: getWorkerEarnings,
    enabled: !!currentUser,
    staleTime: 2 * 60 * 1000,  // Reduce stale time
  cacheTime: 10 * 60 * 1000,
  });

  // Mutations
  const availabilityMutation = useMutation({
    mutationFn: updateWorkerAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries(["workerProfile"]);
      toast({
        title: "Availability Updated",
        description: "Your availability status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability",
        variant: "destructive",
      });
    },
  });

  const bookingStatusMutation = useMutation({
    mutationFn: ({ bookingId, status }) =>
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["workerBookings"]);
      toast({
        title: "Booking Updated",
        description: "The booking status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status",
        variant: "destructive",
      });
    },
  });
  // State
  const [isAvailable, setIsAvailable] = useState(
    workerProfile?.isAvailable ?? true
  );

  // Update isAvailable when workerProfile changes
  useEffect(() => {
    if (workerProfile?.isAvailable !== undefined) {
      setIsAvailable(workerProfile.isAvailable);
    }
  }, [workerProfile]);

  // Handle availability change
  const handleAvailabilityChange = () => {
    const newAvailability = !isAvailable;
    setIsAvailable(newAvailability);
    availabilityMutation.mutate(newAvailability);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingRes, reviewsRes] = await Promise.all([
          getWorkerReviewAndUpdate(currentUser._id),
          getWorkerReviews(),
        ]);
  
        if (ratingRes.status) {
          setRating(ratingRes.averageRating);
        }
  
        if (reviewsRes?.reviews) {
          setReviews(reviewsRes.reviews);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  // Handle booking action
  const handleBookingAction = async (bookingId, status) => {
    bookingStatusMutation.mutate({ bookingId, status });
  };

  // Filter bookings by status
  const pendingRequests = useMemo(() => 
    bookingsData?.data?.filter((b) => b.status === "pending") || [], [bookingsData]
  );
  
  const upcomingJobs = useMemo(() => 
    bookingsData?.data?.filter((b) => b.status === "accepted") || [], [bookingsData]
  );
  
  const completedJobs = useMemo(() => 
    bookingsData?.data?.filter((b) => b.status === "completed") || [], [bookingsData]
  );
  

  if (profileLoading || bookingsLoading || earningsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  const renderCompletedJobs = () => {
    if (!completedJobs.length) {
      return (
        <div className="text-center py-8">
          <Check className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-semibold mb-2">No Completed Jobs</h3>
          <p className="text-gray-600">You haven't completed any jobs yet.</p>
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        {completedJobs.map((booking) => {
          const bookingReview = reviews?.find(
            (review) => review.booking._id === booking._id
          );
  
          return (
            <div
              key={booking._id}
              className="border rounded-lg p-4 hover:border-green-200 transition-colors bg-green-50/30"
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {booking.service?.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <User className="h-4 w-4 mr-1" />
                    <span>Customer: {booking.customer?.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(booking.date).toLocaleDateString()} at{" "}
                      {booking.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{booking.address}</span>
                  </div>
  
                  {bookingReview && (
                    <div className="mt-4">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= bookingReview.rating
                                ? "fill-yellow-400 stroke-yellow-400"
                                : "stroke-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-gray-700">{bookingReview.comment}</p>
                      <p className="text-sm text-gray-500">
                        - {bookingReview.customer.name}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className="font-semibold">₹{booking.totalAmount}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
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
                        workerProfile?.data?.photoUrl ||
                        "https://i.pravatar.cc/150?img=2"
                      }
                      alt={currentUser?.name || workerProfile?.data?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold">
                    {currentUser?.name || workerProfile?.data?.name}
                  </h2>
                  <p className="text-gray-600">
                    {currentUser?.email || workerProfile?.data?.email}
                  </p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (rating || 0)
                            ? "fill-yellow-400 stroke-yellow-400"
                            : "stroke-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm">{rating || "0.0"}</span>
                  </div>
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Label htmlFor="availability" className="mr-2">
                          Availability Status:
                        </Label>
                        <span
                          className={`text-sm font-medium ${
                            isAvailable ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <Switch
                        id="availability"
                        checked={isAvailable}
                        onCheckedChange={handleAvailabilityChange}
                        disabled={availabilityMutation.isLoading}
                      />
                    </div>
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
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/worker/services">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Manage Services
                    </Link>
                  </Button>
                  {/* <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/worker/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                  </Button> */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/worker/earnings">
                      <DollarSign className="h-4 w-4 mr-2" />
                      My Earnings
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <h1 className="text-2xl font-bold mb-6">
                Service Provider Dashboard
              </h1>

              <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="requests" className="relative">
                    Service Requests
                    {pendingRequests.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {pendingRequests.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="relative">
                    Upcoming Jobs
                    {upcomingJobs.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {upcomingJobs.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
                </TabsList>

                <TabsContent value="requests">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Clipboard className="h-5 w-5 mr-2 text-orange-500" />
                        Pending Service Requests
                      </CardTitle>
                      {pendingRequests.length > 0 && (
                        <Badge variant="outline" className="bg-orange-50">
                          {pendingRequests.length} new{" "}
                          {pendingRequests.length === 1
                            ? "request"
                            : "requests"}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      {pendingRequests.length > 0 ? (
                        <div className="space-y-4">
                          {pendingRequests.map((booking) => (
                            <div
                              key={booking._id}
                              className="border rounded-lg p-4 hover:border-orange-200 transition-colors bg-orange-50/30"
                            >
                              <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {booking.service.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>
                                      Customer: {booking.customer.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>
                                      {new Date(
                                        booking.date
                                      ).toLocaleDateString()}{" "}
                                      at {booking.timeSlot}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{booking.address}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    <span className="text-orange-600 font-medium">
                                      Awaiting your response
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-col items-end">
                                  <div className="font-semibold">
                                    ₹{booking.totalAmount}
                                  </div>
                                  <div className="flex gap-2 mt-4">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleBookingAction(
                                          booking._id,
                                          "accepted"
                                        )
                                      }
                                      disabled={bookingStatusMutation.isLoading}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleBookingAction(
                                          booking._id,
                                          "rejected"
                                        )
                                      }
                                      disabled={bookingStatusMutation.isLoading}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clipboard className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Pending Requests
                          </h3>
                          <p className="text-gray-600">
                            You don't have any pending service requests at the
                            moment.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="upcoming">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                        Upcoming Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingJobs.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingJobs.map((booking) => (
                            <div
                              key={booking._id}
                              className="border rounded-lg p-4 hover:border-blue-200 transition-colors bg-blue-50/30"
                            >
                              <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    {booking.service?.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <User className="h-4 w-4 mr-1" />
                                    <span>
                                      Customer: {booking.customer?.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>
                                      {new Date(
                                        booking.date
                                      ).toLocaleDateString()}{" "}
                                      at {booking.timeSlot}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{booking.address}</span>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-col items-end">
                                  <div className="font-semibold">
                                    ₹{booking.totalAmount}
                                  </div>
                                  <Button
                                    size="sm"
                                    className="mt-4"
                                    onClick={() =>
                                      handleBookingAction(
                                        booking._id,
                                        "completed"
                                      )
                                    }
                                    disabled={bookingStatusMutation.isLoading}
                                  >
                                    Mark as Complete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Upcoming Jobs
                          </h3>
                          <p className="text-gray-600">
                            You don't have any upcoming jobs at the moment.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        Completed Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderCompletedJobs()}
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

export default WorkerDashboard;
