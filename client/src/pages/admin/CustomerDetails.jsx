import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockUsers, mockBookings, mockServices } from "@/data/mockData";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllBookings, getCustomers, getWorkers } from "../../api/adminServices";
import { useEffect, useState } from "react";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [booking, setBooking] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showAll, setShowAll] = useState(false);
    
    const getCustomer = async () => {
        try {
          const { status, users } = await getCustomers();
          if (status) {
            setCustomers(users);
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
      getCustomer();
      getBookings();
    }, []);
    
  
  // Find customer by ID
  const customer = customers.find(u => u._id === id );
  console.log(customer);
  
  // Get customer's bookings
  const customerBookings = booking.filter(b => b.customer._id === id);
  
  const displayedBookings = showAll ? customerBookings : customerBookings.slice(0, 8);

  if (!customer) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center gap-2" 
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2">Customer Not Found</h2>
                  <p className="text-gray-600 mb-4">The customer you're looking for doesn't exist.</p>
                  <Button onClick={() => navigate('/admin/dashboard')}>Return to Dashboard</Button>
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
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Profile */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center pt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{customer.name}</CardTitle>
                    <Badge className="mt-2" variant="outline">
                      Customer
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{customer.address || 'No address provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      {/* <span>Joined on {customer.createdAt.toLocaleDateString()}</span> */}
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Account Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Bookings</span>
                          <span className="font-medium">{customerBookings.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed Bookings</span>
                          <span className="font-medium">
                            {customerBookings.filter(b => b.status === 'completed').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Spent</span>
                          <span className="font-medium">
                            ₹{customerBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Payment Methods</h3>
                      <div className="border rounded-lg p-3 flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-xs text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Booking History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking History</CardTitle>
                </CardHeader>
                <CardContent>
                  {displayedBookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerBookings.map(booking => {
                          const service = booking.service
                          return (
                            <TableRow key={booking._id}>
                              <TableCell className="font-medium">
                                {service?.name || 'Unknown Service'}
                              </TableCell>
                              <TableCell>
                                {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={getStatusBadgeVariant(booking.status)}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>₹{booking.totalAmount || booking.price}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="link" 
                                  className="h-8 px-2" 
                                  onClick={() => navigate(`/booking/${booking._id}`)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow> 
                          );
                        })}
                        
                      </TableBody>
                        {/* {customerBookings.length > 3 && (
                          <div className="mt-4 text-center">
                            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                              {showAll ? "Show Less" : "View All Bookings"}
                            </Button>
                          </div>
                        )} */}
                    </Table>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600">No bookings found for this customer.</p>
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

// Helper function
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "pending":
    case "pending_payment":
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

export default CustomerDetails;
