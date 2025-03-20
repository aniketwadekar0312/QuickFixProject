import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { mockWorkers, mockBookings, mockUsers, mockServices } from "@/data/mockData";
import { Search, UserCheck, UserX, ClipboardList, Users, BarChart3, Percent } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const pendingWorkers = mockWorkers.filter(worker => 
    worker.status === "pending" && 
    (worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     worker.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleWorkerAction = (workerId, action) => {
    toast({
      title: `Worker ${action === "approve" ? "approved" : "rejected"}`,
      description: `The worker has been successfully ${action}.`,
    });
  };
  
  const dashboardSummary = {
    totalUsers: mockUsers.length,
    totalWorkers: mockWorkers.filter(w => w.status === "approved").length,
    pendingApprovals: mockWorkers.filter(w => w.status === "pending").length,
    totalBookings: mockBookings.length,
    completedBookings: mockBookings.filter(b => b.status === "completed").length,
    pendingBookings: mockBookings.filter(b => b.status === "pending").length,
    totalRevenue: mockBookings.filter(b => b.paymentStatus === "completed")
      .reduce((sum, booking) => sum + booking.price, 0),
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
                    <h3 className="text-2xl font-bold">{dashboardSummary.totalUsers}</h3>
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
                    <h3 className="text-2xl font-bold">{dashboardSummary.totalWorkers}</h3>
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
                    <h3 className="text-2xl font-bold">{dashboardSummary.totalBookings}</h3>
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
                    <h3 className="text-2xl font-bold">₹{dashboardSummary.totalRevenue}</h3>
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
                <CardDescription>Overview of the recent bookings across the platform</CardDescription>
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
                    {mockBookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {mockServices.find(s => s.id === booking.serviceId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {mockUsers.find(u => u.id === booking.customerId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {mockWorkers.find(w => w.id === booking.workerId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{booking.price}</TableCell>
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
                    <span className="text-sm text-gray-500">Booking Completion Rate</span>
                    <span className="font-medium">
                      {Math.round((dashboardSummary.completedBookings / dashboardSummary.totalBookings) * 100) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(dashboardSummary.completedBookings / dashboardSummary.totalBookings) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">Worker Approval Rate</span>
                    <span className="font-medium">
                      {Math.round((dashboardSummary.totalWorkers / (dashboardSummary.totalWorkers + dashboardSummary.pendingApprovals)) * 100) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(dashboardSummary.totalWorkers / (dashboardSummary.totalWorkers + dashboardSummary.pendingApprovals)) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">Average Customer Rating</span>
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
              <TabsTrigger value="pending-approvals">Pending Approvals</TabsTrigger>
              <TabsTrigger value="all-workers">All Service Providers</TabsTrigger>
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
                  {pendingWorkers.length > 0 ? (
                    <div className="space-y-4">
                      {pendingWorkers.map((worker) => (
                        <div
                          key={worker.id}
                          className="border rounded-lg p-4 hover:border-brand-200 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-shrink-0">
                              <img
                                src={worker.photoUrl}
                                alt={worker.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold text-lg">{worker.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <div className="text-gray-600 text-sm">
                                  <span className="font-medium">Email:</span> {worker.email}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  <span className="font-medium">Phone:</span> {worker.phone}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  <span className="font-medium">Location:</span> {worker.location}
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="font-medium">Services:</span>{" "}
                                {worker.services.join(", ")}
                              </div>
                              <div className="mt-1">
                                <p className="text-sm text-gray-600">{worker.description}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col md:items-end justify-start gap-2">
                              <Button
                                className="w-full md:w-auto"
                                onClick={() => handleWorkerAction(worker.id, "approve")}
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full md:w-auto"
                                onClick={() => handleWorkerAction(worker.id, "reject")}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                variant="link"
                                className="w-full md:w-auto"
                              >
                                View Documents
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserCheck className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                      <p className="text-gray-600">
                        There are no service providers waiting for approval at the moment.
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
                      {mockWorkers.slice(0, 6).map((worker) => (
                        <TableRow key={worker.id}>
                          <TableCell className="font-medium">{worker.name}</TableCell>
                          <TableCell>{worker.services.join(", ")}</TableCell>
                          <TableCell>{worker.location}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                worker.status === "approved" 
                                  ? "default" 
                                  : worker.status === "pending" 
                                    ? "outline" 
                                    : "destructive"
                              }
                            >
                              {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{worker.rating.toFixed(1)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="link" size="sm">View</Button>
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
                  <CardDescription>
                    Manage customer accounts
                  </CardDescription>
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
                      {mockUsers
                        .filter(user => user.role === "customer")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell>
                              {mockBookings.filter(b => b.customerId === user.id).length}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="link" size="sm">View</Button>
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
