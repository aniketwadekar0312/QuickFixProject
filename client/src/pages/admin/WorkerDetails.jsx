import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import {
  getAllBookings,
  getCustomers,
  getWorkers,
  updateWorkerStatus,
} from "../../api/adminServices";

const WorkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  // const [customer, setCustomer] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [booking, setBooking] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const getWorker = async () => {
    try {
      const { status, workers } = await getWorkers();
      if (status) {
        setWorkers(workers);
      }
    } catch (error) {
      console.log("error in getCustomer", error);
    }
  };
  const getBookings = async () => {
    try {
      const { status, bookings } = await getAllBookings();
      if (status) {
        setBooking(bookings);
      }
    } catch (error) {
      console.log("error in getBooking", error);
    }
  };
  useEffect(() => {
    getWorker();
    getBookings();
  }, []);

  // Find worker by ID
  const worker = workers.find((w) => w._id === id);

  const workerBookings = booking.filter((b) => b.worker._id === id);
  // console.log(workerBookings);
  const displayedBookings = showAll
    ? workerBookings
    : workerBookings.slice(0, 3);


     const handleWorkerAction = async (workerId, action) => {
        try {
          const { status } = await updateWorkerStatus({ workerId, status: action });
          if (status) {
            toast({
              title: `Worker ${action === "approve" ? "approved" : "rejected"}`,
              description: `The worker has been successfully ${action}.`,
            });
            getWorker()
          }
        } catch (error) {
          console.log("error in handleWorkerAction", error);
          toast({
            title: "Action failed",
            description: "Failed to update worker status",
            variant: "destructive",
          });
        }
      };
  // Handle worker status change
  const handleStatusChange = (status) => {
    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Status Updated",
        description: `Worker status has been changed to ${status}.`,
      });
      setIsUpdating(false);
    }, 1000);
  };

  if (!worker) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2">Worker Not Found</h2>
                  <p className="text-gray-600 mb-4">
                    The worker you're looking for doesn't exist.
                  </p>
                  <Button onClick={() => navigate("/admin/dashboard")}>
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
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate("/admin/dashboard")}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Worker Profile */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center pt-6">
                  <div className="flex flex-col items-center">
                    <img
                      src={worker.photoUrl || "/placeholder.svg"}
                      alt={worker.name}
                      className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                    <CardTitle className="text-xl">{worker.name}</CardTitle>
                    <div className="mt-2 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>
                        {worker.rating} ({worker.reviews?.length || 0} reviews)
                      </span>
                    </div>
                    <Badge
                      className="mt-2"
                      variant={
                        worker.status === "approved"
                          ? "default"
                          : worker.status === "pending"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {worker.status.charAt(0).toUpperCase() +
                        worker.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className=" capitalize">{worker.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{worker.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{worker.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span>
                        Joined on{" "}
                        {worker.createdAt
                          ? new Date(worker.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Services Offered</h3>
                      <div className="flex flex-wrap gap-2">
                        {worker.services.map((service) => (
                          <Badge key={service} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-sm text-gray-600">
                        {worker.description}
                      </p>
                    </div>
                    <Separator />
                    <div className="flex flex-col space-y-2">
                      {worker.status === "pending" && (
                        <>
                          <Button
                            className="w-full md:w-auto"
                            onClick={() =>
                              handleWorkerAction(worker._id, "approved")
                            }
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full md:w-auto"
                            onClick={() =>
                              handleWorkerAction(worker._id, "rejected")
                            }
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {worker.status === "approved" && (
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleStatusChange("suspended")}
                          disabled={isUpdating}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Suspend Worker
                        </Button>
                      )}
                      {worker.status === "rejected" && (
                        <Button
                          className="w-full"
                          onClick={() => handleStatusChange("approved")}
                          disabled={isUpdating}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Approve Worker
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings & Documents */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {workerBookings.length > 0 ? (
                    <div className="space-y-4">
                      {displayedBookings.map((booking) => {
                        const service = booking.service;
                        // console.log("abcd",booking);

                        return (
                          <div
                            key={booking._id}
                            className={`overflow-y-auto ${
                              showAll ? "max-h-80" : ""
                            } border rounded-lg p-4`}
                          >
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">
                                {service?.name || "Unknown Service"}
                              </span>
                              <Badge
                                variant={getStatusBadgeVariant(booking.status)}
                              >
                                {booking.status.charAt(0).toUpperCase() +
                                  booking.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <span>Booking #{booking._id.slice(-6)}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {booking.date
                                  ? new Date(booking.date).toLocaleDateString(
                                      "en-IN"
                                    )
                                  : "N/A"}
                              </span>
                              <span className="mx-2">•</span>
                              <span>₹{booking.totalAmount}</span>
                            </div>
                            <Button
                              variant="link"
                              className="h-8 px-0 text-blue-600"
                              onClick={() =>
                                navigate(`/booking/${booking._id}`)
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600">
                        No bookings found for this worker.
                      </p>
                    </div>
                  )}
                  {workerBookings.length > 3 && (
                    <div className="mt-4 text-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAll(!showAll)}
                      >
                        {showAll ? "Show Less" : "View All Bookings"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">Identity Verification</p>
                          <p className="text-sm text-gray-600">Aadhaar Card</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">Address Proof</p>
                          <p className="text-sm text-gray-600">Utility Bill</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">
                            Qualification Certificate
                          </p>
                          <p className="text-sm text-gray-600">
                            Professional Training
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper function
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

export default WorkerDetails;
