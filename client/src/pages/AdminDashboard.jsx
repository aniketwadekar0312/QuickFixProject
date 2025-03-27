import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  getDashboardStats,
  getAllBookings,
  getCustomers,
  getWorkers,
  updateWorkerStatus,
} from "../api/adminServices";

import {
  Search,
  UserCheck,
  UserX,
  ClipboardList,
  Users,
  BarChart3,
  Eye
} from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState(null);
  const [booking, setBooking] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [worker, setWorker] = useState([]);
  const navigate = useNavigate();

  const getDashboardStatics = async () => {
    try {
      const { status, summary } = await getDashboardStats();
      if (status) {
        setStats(summary);
      }
    } catch (error) {
      console.log("error in getDashboardStats", error);
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

  const getCustomer = async () => {
    try {
      const { status, users } = await getCustomers();
      if (status) {
        setCustomer(users);
      }
    } catch (error) {
      console.log("error in getCustomer", error);
    }
  };

  const getWorker = async () => {
    try {
      const { status, workers } = await getWorkers();
      if (status) {
        setWorker(workers);
      }
    } catch (error) {
      console.log("error in getCustomer", error);
    }
  };

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

  useEffect(() => {
    getDashboardStatics();
    getBookings();
    getCustomer();
    getWorker();
    
  }, []);

  const formattedDate = (date) => {
    const dateString = new Date(date);
    const formattedDate = dateString.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>

          {/* Dashboard Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold">{stats?.users || 0}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Service Providers</p>
                    <h3 className="text-2xl font-bold">
                      {stats?.approvedWorkers || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <UserCheck className="h-6 w-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <h3 className="text-2xl font-bold">
                      {stats?.completedBookings || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ClipboardList className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <h3 className="text-2xl font-bold">
                      ₹{stats?.totalRevenue[0]?.total || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-yellow-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Overview of the recent bookings across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {booking.length > 0 &&
                      booking.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell className="font-medium">
                            {booking?.service?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {booking?.customer?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {booking?.worker?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(booking.status)}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{booking?.totalAmount}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>Key performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Booking Completion Rate
                    </span>
                    <span className="font-medium">
                      {Math.round(
                        (stats?.completedBookings / stats?.totalBookings) * 100
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats?.completedBookings / stats?.totalBookings) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      Worker Approval Rate
                    </span>
                    <span className="font-medium">
                      {Math.round(
                        (stats?.approvedWorkers /
                          (stats?.approvedWorkers + stats?.pendingWorkers)) *
                          100
                      ) || 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats?.approvedWorkers /
                            (stats?.approvedWorkers + stats?.pendingWorkers)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      Average Customer Rating
                    </span>
                    <span className="font-medium">4.7/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(4.7 / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending-approvals" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="pending-approvals">
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger value="all-workers">
                All Service Providers
              </TabsTrigger>
              <TabsTrigger value="all-customers">All Customers</TabsTrigger>
            </TabsList>

            <TabsContent value="pending-approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Workers Pending Approval</CardTitle>
                  <CardDescription>
                    Review and approve new service provider registrations
                  </CardDescription>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {worker.filter((w) => w.status === "pending").length > 0 ? (
                    <div className="space-y-4">
                      {worker
                        .filter((w) => w.status === "pending")
                        .map((worker) => (
                          <div
                            key={worker._id}
                            className="border rounded-lg p-4 hover:border-brand-200 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-shrink-0">
                                <img
                                  src={
                                    worker?.photoUrl ||
                                    "https://elouwerse.nl/placecircle/200"
                                  }
                                  alt={worker?.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-semibold text-lg">
                                  {worker?.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <div className="text-gray-600 text-sm">
                                    <span className="font-medium">Email:</span>{" "}
                                    {worker?.email}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    <span className="font-medium">Phone:</span>{" "}
                                    {worker?.phone}
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {worker?.location}
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="font-medium">Services:</span>{" "}
                                  {worker?.services.join(", ")}
                                </div>
                                <div className="mt-1">
                                  <p className="text-sm text-gray-600">
                                    {worker?.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-shrink-0 flex flex-col md:items-end justify-start gap-2">
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
                                <Button
                                  variant="link"
                                  className="w-full md:w-auto"
                                  onClick={() => navigate(`/admin/worker/${worker.id}`)}
                                  >
                                    
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Pending Approvals
                      </h3>
                      <p className="text-gray-600">
                        There are no service providers waiting for approval at
                        the moment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all-workers">
              <Card>
                <CardHeader>
                  <CardTitle>All Service Providers</CardTitle>
                  <CardDescription>
                    Manage all service providers on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {worker.map((worker) => (
                        <TableRow key={worker._id}>
                          <TableCell className="font-medium">
                            {worker?.name}
                          </TableCell>
                          <TableCell>{worker?.services.join(", ")}</TableCell>
                          <TableCell>
                            {worker?.location.charAt(0).toUpperCase() +
                              worker?.location.slice(1)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                worker?.status === "approved"
                                  ? "default"
                                  : worker?.status === "pending"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {worker?.status.charAt(0).toUpperCase() +
                                worker?.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{worker?.rating.toFixed(1)}</TableCell>
                          <TableCell className="text-right">
                          <Button 
                              variant="link" 
                              size="sm"
                              onClick={() => navigate(`/admin/worker/${worker._id}`)}
                            >
                              <Eye className="h-4 w-4  mt-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all-customers">
              <Card>
                <CardHeader>
                  <CardTitle>All Customers</CardTitle>
                  <CardDescription>Manage customer accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Bookings</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customer.length > 0 &&
                        customer.map((customer) => (
                          <TableRow key={customer._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10">
                                  <img
                                    src={customer.photoUrl}
                                    alt={customer.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                </div>
                                <div>{customer?.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{customer?.email}</TableCell>
                            <TableCell>{customer?.phone}</TableCell>
                            <TableCell>
                              {formattedDate(customer?.createdAt)}
                            </TableCell>
                            <TableCell>
                              {customer?.bookings?.length || 0}
                            </TableCell>
                            <TableCell className="text-right">
                            <Button 
                                variant="link" 
                                size="sm"
                                onClick={() => navigate(`/admin/customer/${customer._id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default AdminDashboard;
