import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Calendar, ArrowUpRight, ArrowDownRight, BarChart, Download, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWorkerEarnings, getWorkerBookings } from "@/api/workerApi";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const WorkerEarnings = () => {
  const { toast } = useToast();
  
  // Fetch earnings data
  const { data: earningsData, isLoading: earningsLoading, error: earningsError } = useQuery({
    queryKey: ['workerEarnings'],
    queryFn: getWorkerEarnings,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Fetch recent bookings for transactions
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['workerBookings'],
    queryFn: getWorkerBookings,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Handle errors
  if (earningsError) {
    toast({
      title: "Error fetching earnings",
      description: earningsError.message || "Failed to load earnings data",
      variant: "destructive",
    });
  }

  if (bookingsError) {
    toast({
      title: "Error fetching bookings",
      description: bookingsError.message || "Failed to load booking data",
      variant: "destructive",
    });
  }

  if (earningsLoading || bookingsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const totalEarnings = earningsData?.data?.totalEarnings || 0;
  const monthlyEarnings = earningsData?.data?.monthlyEarnings || [];
  const recentTransactions = bookingsData?.data
    ?.filter(booking => booking)
    ?.slice(0, 5) || [];

  const handleDownloadStatement = () => {
    toast({
      title: "Statement downloaded",
      description: "Your earnings statement has been downloaded successfully."
    });
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">My Earnings</h1>
            <p className="text-gray-600">Track your earnings, payments, and financial summary</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Earnings</p>
                    <h3 className="text-2xl font-bold flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {totalEarnings.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">This Month</p>
                    <h3 className="text-2xl font-bold flex items-center">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {monthlyEarnings[monthlyEarnings.length - 1]?.amount?.toLocaleString() || 0}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <ArrowDownRight className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Completed Jobs</p>
                    <h3 className="text-2xl font-bold flex items-center">
                      {recentTransactions
                            ?.filter(booking => booking.status === 'completed')
                            .length}
                    </h3>
                    <p className="text-sm text-gray-500">Total completed jobs</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Earnings Overview</CardTitle>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      This Year
                    </Button>
                  </div>
                  <CardDescription>Your earnings over the months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={monthlyEarnings}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, 'Earnings']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="amount" name="Monthly Earnings" fill="#3f51b5" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent earnings from completed jobs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions
                            ?.filter(booking => booking.status === 'completed')
                            .map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.service?.name || 'Service'}</p>
                          <p className="text-sm text-gray-500">{booking.customer?.name || 'Customer'}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{booking.totalAmount.toLocaleString()}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadStatement}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Statement
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Service</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-right py-3 px-4">Amount</th>
                            <th className="text-right py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions
                            ?.map((booking) => (
                            <tr key={booking._id} className="border-b">
                              <td className="py-3 px-4">
                                {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                              </td>
                              <td className="py-3 px-4">{booking.service?.name || 'Service'}</td>
                              <td className="py-3 px-4">{booking.customer?.name || 'Customer'}</td>
                              <td className="py-3 px-4 text-right">₹{booking.totalAmount.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                              <span
                                  className={`px-2 py-1 rounded-full text-xs 
                                    ${booking.status === "completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Service</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-right py-3 px-4">Amount</th>
                            <th className="text-right py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions
                            ?.filter(booking => booking.status === 'completed')
                            .map((booking) => (
                            <tr key={booking._id} className="border-b">
                              <td className="py-3 px-4">
                                {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                              </td>
                              <td className="py-3 px-4">{booking.service?.name || 'Service'}</td>
                              <td className="py-3 px-4">{booking.customer?.name || 'Customer'}</td>
                              <td className="py-3 px-4 text-right">₹{booking.totalAmount.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">
                              <span
                                  className={`px-2 py-1 rounded-full text-xs 
                                    ${booking.status === "completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Service</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-right py-3 px-4">Amount</th>
                            <th className="text-right py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTransactions
                            ?.filter(booking => booking.status === 'pending' || booking.status === "accepted")
                            .map((booking) => (
                              <tr key={booking._id} className="border-b">
                                <td className="py-3 px-4">
                                  {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                                </td>
                                <td className="py-3 px-4">{booking.service?.name || 'Service'}</td>
                                <td className="py-3 px-4">{booking.customer?.name || 'Customer'}</td>
                                <td className="py-3 px-4 text-right">₹{booking.totalAmount.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs 
                                    ${booking.status === "completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                                  {booking.status}
                                </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerEarnings;