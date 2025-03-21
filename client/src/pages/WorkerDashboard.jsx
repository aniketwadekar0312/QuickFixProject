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
import { mockBookings, mockServices, mockUsers } from "@/data/mockData";
import { Calendar, User, Star, MapPin, Clock, Briefcase, Settings, DollarSign, Clipboard, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

const WorkerDashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Get worker bookings from mock data
  const workerBookings = mockBookings.filter(
    booking => booking.workerId === "worker1" // Using worker1 since current user might not match mock data
  );
  
  const findCustomerName = (customerId) => {
    const customer = mockUsers.find(user => user.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };
  
  const findServiceName = (serviceId) => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };
  
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
  
  const handleAvailabilityChange = () => {
    setIsAvailable(!isAvailable);
    toast({
      title: !isAvailable ? "You are now available" : "You are now unavailable",
      description: !isAvailable ? "Customers can now book your services." : "Customers cannot book your services at the moment.",
    });
  };
  
  const handleBookingAction = (bookingId, action) => {
    toast({
      title: `Booking ${action === "accept" ? "accepted" : action === "reject" ? "rejected" : "marked as complete"}`,
      description: `You have successfully ${action === "accept" ? "accepted" : action === "reject" ? "rejected" : "completed"} the booking.`,
    });
  };

  // Count for badge notifications
  const pendingRequestsCount = workerBookings.filter(b => b.status === "pending").length;
  const upcomingJobsCount = workerBookings.filter(b => b.status === "accepted").length;

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
                      src={currentUser?.photoUrl || "https://i.pravatar.cc/150?img=2"}
                      alt={currentUser?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold">{currentUser?.name || "Jane Smith"}</h2>
                  <p className="text-gray-600">{currentUser?.email || "jane@example.com"}</p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= 4.5
                            ? "fill-yellow-400 stroke-yellow-400"
                            : "stroke-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm">4.5</span>
                  </div>
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Label htmlFor="availability" className="mr-2">Availability Status:</Label>
                        <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <Switch
                        id="availability"
                        checked={isAvailable}
                        onCheckedChange={handleAvailabilityChange}
                      />
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/profile">Edit Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/worker/services">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Manage Services
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/worker/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
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
              <h1 className="text-2xl font-bold mb-6">Service Provider Dashboard</h1>
              
              <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="requests" className="relative">
                    Service Requests
                    {pendingRequestsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="relative">
                    Upcoming Jobs
                    {upcomingJobsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {upcomingJobsCount}
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
                      {pendingRequestsCount > 0 && (
                        <Badge variant="outline" className="bg-orange-50">
                          {pendingRequestsCount} new {pendingRequestsCount === 1 ? 'request' : 'requests'}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      {workerBookings.filter(b => b.status === "pending").length > 0 ? (
                        <div className="space-y-4">
                          {workerBookings
                            .filter(b => b.status === "pending")
                            .map((booking) => (
                              <div
                                key={booking.id}
                                className="border rounded-lg p-4 hover:border-orange-200 transition-colors bg-orange-50/30"
                              >
                                <div className="flex flex-col md:flex-row justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {findServiceName(booking.serviceId)}
                                    </h3>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <User className="h-4 w-4 mr-1" />
                                      <span>Customer: {findCustomerName(booking.customerId)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      <span>
                                        {booking.date.toLocaleDateString()} at {booking.time}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{booking.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      <span className="text-orange-600 font-medium">Awaiting your response</span>
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                                    <div className="font-semibold">₹{booking.price}</div>
                                    <div className="flex gap-2 mt-4">
                                      <Button
                                        size="sm"
                                        onClick={() => handleBookingAction(booking.id, "accept")}
                                      >
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBookingAction(booking.id, "reject")}
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
                          <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                          <p className="text-gray-600">
                            You don't have any pending service requests at the moment.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="upcoming">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                        Upcoming Jobs
                      </CardTitle>
                      {upcomingJobsCount > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {upcomingJobsCount} upcoming {upcomingJobsCount === 1 ? 'job' : 'jobs'}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      {workerBookings.filter(b => b.status === "accepted").length > 0 ? (
                        <div className="space-y-4">
                          {workerBookings
                            .filter(b => b.status === "accepted")
                            .sort((a, b) => a.date.getTime() - b.date.getTime())
                            .map((booking) => (
                              <div
                                key={booking.id}
                                className="border rounded-lg p-4 hover:border-blue-200 transition-colors bg-blue-50/30"
                              >
                                <div className="flex flex-col md:flex-row justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {findServiceName(booking.serviceId)}
                                    </h3>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <User className="h-4 w-4 mr-1" />
                                      <span>Customer: {findCustomerName(booking.customerId)}</span>
                                    </div>
                                    <div className="flex items-center text-blue-600 mt-1 font-medium">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      <span>
                                        {booking.date.toLocaleDateString()} at {booking.time}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{booking.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>
                                        {Math.round((booking.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                                    <Badge variant="secondary" className="mb-2">Accepted</Badge>
                                    <div className="font-semibold">₹{booking.price}</div>
                                    <div className="flex gap-2 mt-4">
                                      <Button
                                        size="sm"
                                        onClick={() => handleBookingAction(booking.id, "complete")}
                                      >
                                        Mark as Complete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">No Upcoming Jobs</h3>
                          <p className="text-gray-600">
                            You don't have any accepted jobs scheduled at the moment.
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
                      {workerBookings.filter(b => b.status === "completed").length > 0 ? (
                        <div className="space-y-4">
                          {workerBookings
                            .filter(b => b.status === "completed")
                            .map((booking) => (
                              <div
                                key={booking.id}
                                className="border rounded-lg p-4 hover:border-green-200 transition-colors bg-green-50/30"
                              >
                                <div className="flex flex-col md:flex-row justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {findServiceName(booking.serviceId)}
                                    </h3>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <User className="h-4 w-4 mr-1" />
                                      <span>Customer: {findCustomerName(booking.customerId)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      <span>
                                        {booking.date.toLocaleDateString()}
                                      </span>
                                    </div>
                                    {booking.rating && (
                                      <div className="flex items-center mt-2">
                                        <div className="flex items-center text-yellow-500 mr-4">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-4 w-4 ${
                                                i < booking.rating
                                                  ? "fill-yellow-400 stroke-yellow-400"
                                                  : "stroke-gray-300"
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {booking.feedback && (
                                      <p className="text-sm text-gray-600 mt-1 italic">
                                        "{booking.feedback}"
                                      </p>
                                    )}
                                  </div>
                                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                                    <Badge variant="default" className="bg-green-500">Completed</Badge>
                                    <div className="mt-2 font-semibold">₹{booking.price}</div>
                                    <Badge
                                      variant={booking.paymentStatus === "completed" ? "default" : "outline"}
                                      className={`mt-2 ${booking.paymentStatus === "completed" ? "bg-green-100 text-green-800" : ""}`}
                                    >
                                      {booking.paymentStatus === "completed" ? "Paid" : "Payment Pending"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Check className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">No Completed Jobs</h3>
                          <p className="text-gray-600">
                            You don't have any completed jobs yet.
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

export default WorkerDashboard;