import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Calendar, ArrowUpRight, ArrowDownRight, BarChart, Download, Filter } from "lucide-react";
import { mockBookings } from "@/data/mockData";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const WorkerEarnings = () => {
  const { toast } = useToast();

// Mock earnings data
const earnings = {
  totalEarnings: 42500,
  pendingPayouts: 5600,
  totalBookings: 85,
  completedBookings: 78,
  recentTransactions: [
    {
      id: "tr1",
      amount: 500,
      date: "2023-09-15",
      status: "completed",
      customerName: "John Doe",
      serviceName: "Plumbing"
    },
    {
      id: "tr2",
      amount: 600,
      date: "2023-09-12",
      status: "completed",
      customerName: "Sarah Johnson",
      serviceName: "Electrical"
    },
    {
      id: "tr3",
      amount: 800,
      date: "2023-09-08",
      status: "completed",
      customerName: "Michael Brown",
      serviceName: "Air Conditioning"
    },
    {
      id: "tr4",
      amount: 550,
      date: "2023-09-05",
      status: "pending",
      customerName: "Emily Wilson",
      serviceName: "Plumbing"
    },
    {
      id: "tr5",
      amount: 700,
      date: "2023-09-02",
      status: "completed",
      customerName: "David Miller",
      serviceName: "Electrical"
    }
  ],
  monthlyEarnings: [
    { month: "Jan", earnings: 4200 },
    { month: "Feb", earnings: 4800 },
    { month: "Mar", earnings: 5100 },
    { month: "Apr", earnings: 5600 },
    { month: "May", earnings: 4900 },
    { month: "Jun", earnings: 5800 },
    { month: "Jul", earnings: 6200 },
    { month: "Aug", earnings: 5300 },
    { month: "Sep", earnings: 0 },
    { month: "Oct", earnings: 0 },
    { month: "Nov", earnings: 0 },
    { month: "Dec", earnings: 0 }
  ]
};

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
                    {earnings.totalEarnings.toLocaleString()}
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
                  <p className="text-gray-500">Pending Payouts</p>
                  <h3 className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {earnings.pendingPayouts.toLocaleString()}
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
                  <p className="text-gray-500">Total Jobs</p>
                  <h3 className="text-2xl font-bold flex items-center">
                    {earnings.completedBookings}/{earnings.totalBookings}
                  </h3>
                  <p className="text-sm text-gray-500">Completed jobs</p>
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
                    <RechartsBarChart data={earnings.monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Earnings']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="earnings" name="Monthly Earnings" fill="#3f51b5" />
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
                  {earnings.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{transaction.serviceName}</p>
                        <p className="text-sm text-gray-500">{transaction.customerName}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{transaction.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {transaction.status === 'completed' ? 'Paid' : 'Pending'}
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
                        {earnings.recentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b">
                            <td className="py-3 px-4">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">{transaction.serviceName}</td>
                            <td className="py-3 px-4">{transaction.customerName}</td>
                            <td className="py-3 px-4 text-right">₹{transaction.amount}</td>
                            <td className="py-3 px-4 text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {transaction.status === 'completed' ? 'Paid' : 'Pending'}
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
                        {earnings.recentTransactions
                          .filter(t => t.status === 'completed')
                          .map((transaction) => (
                            <tr key={transaction.id} className="border-b">
                              <td className="py-3 px-4">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">{transaction.serviceName}</td>
                              <td className="py-3 px-4">{transaction.customerName}</td>
                              <td className="py-3 px-4 text-right">₹{transaction.amount}</td>
                              <td className="py-3 px-4 text-right">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Paid
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
                        {earnings.recentTransactions
                          .filter(t => t.status === 'pending')
                          .map((transaction) => (
                            <tr key={transaction.id} className="border-b">
                              <td className="py-3 px-4">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">{transaction.serviceName}</td>
                              <td className="py-3 px-4">{transaction.customerName}</td>
                              <td className="py-3 px-4 text-right">₹{transaction.amount}</td>
                              <td className="py-3 px-4 text-right">
                                <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                  Pending
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