import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockWorkers } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Star, MapPin, Phone, Mail, Clock, Check } from "lucide-react";
import { getUsers } from "../api/authServices";

const WorkerProfile = () => {
  const { id } = useParams();

  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [mockWorkers, setMockWorkers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers(); // Use API function
        const allUsers = res; // API now correctly returns an array
        // Filter only workers
        const workerUsers = allUsers.filter((user) => user.role === "worker");
        setMockWorkers(workerUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const worker = mockWorkers.find((w) => w._id === id);
  console.log(worker);

  if (!worker) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Worker Not Found</h1>
            <p className="mb-6">
              The service provider you're looking for doesn't exist or has been
              removed.
            </p>
            <Button asChild>
              <Link to="/workers">View All Service Providers</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedService) {
      toast({
        title: "Service required",
        description: "Please select a service to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "Time slot required",
        description: "Please select a time slot to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking request sent!",
      description: `Your booking request with ${worker.name} has been sent for approval.`,
    });

    setBookingDialogOpen(false);
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Worker profile header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={worker.photoUrl}
                  alt={worker.name}
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{worker.name}</h1>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-4">
                        <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400 mr-1" />
                        <span className="font-medium">
                          {worker.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-1" />
                        <span>{worker.location}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      {worker.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-block bg-brand-100 text-brand-800 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div
                      className={`flex items-center mb-2 ${
                        worker.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <Clock className="h-5 w-5 mr-1" />
                      <span className="font-medium">
                        {worker.available
                          ? "Available Now"
                          : "Currently Unavailable"}
                      </span>
                    </div>
                    {worker.verified && (
                      <div className="flex items-center text-green-600 mb-4">
                        <Check className="h-5 w-5 mr-1" />
                        <span className="font-medium">Verified Provider</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{worker.description}</p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex flex-wrap justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Contact Information
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{worker.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{worker.email}</span>
                      </div>
                    </div>
                    <div>
                      <Button size="lg" disabled={!worker.available}>
                        <Link to={"/book-service/:id?"}>Book Now</Link>
                      </Button>
                      {/* <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                        <DialogTrigger asChild>
                          
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Book an Appointment</DialogTitle>
                            <DialogDescription>
                              Select a service, date and time to book with {worker.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleBooking}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 gap-4">
                                <Label htmlFor="service" className="col-span-4">
                                  Select Service
                                </Label>
                                <div className="col-span-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    {worker.services.map((service) => (
                                      <div
                                        key={service}
                                        className={`border rounded-md p-3 cursor-pointer transition-colors ${
                                          selectedService === service
                                            ? "border-brand-600 bg-brand-50"
                                            : "border-gray-200 hover:border-brand-400"
                                        }`}
                                        onClick={() => setSelectedService(service)}
                                      >
                                        <div className="font-medium">{service}</div>
                                        <div className="text-sm text-gray-500">
                                          ₹{worker.pricing[service]}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4">
                                <Label htmlFor="date" className="col-span-4">
                                  Select Date
                                </Label>
                                <div className="col-span-4 flex justify-center">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={(date) => {
                                      // Disable past dates and dates more than 30 days in the future
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      const futureLimit = new Date();
                                      futureLimit.setDate(futureLimit.getDate() + 30);
                                      return date < today || date > futureLimit;
                                    }}
                                    className="rounded-md border"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4">
                                <Label htmlFor="time" className="col-span-4">
                                  Select Time Slot
                                </Label>
                                <div className="col-span-4">
                                  <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((time) => (
                                      <div
                                        key={time}
                                        className={`border rounded-md p-2 text-center cursor-pointer transition-colors ${
                                          selectedTime === time
                                            ? "border-brand-600 bg-brand-50"
                                            : "border-gray-200 hover:border-brand-400"
                                        }`}
                                        onClick={() => setSelectedTime(time)}
                                      >
                                        {time}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4">
                                <Label htmlFor="notes" className="col-span-4">
                                  Additional Notes (Optional)
                                </Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Provide any additional details about your service needs..."
                                  className="col-span-4"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">
                                Confirm Booking
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="services">Services & Pricing</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Services Offered
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(worker.pricing).map(([service, price]) => (
                      <div key={service} className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{service}</h4>
                          <span className="text-lg font-semibold">
                            ₹{price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {worker.services.includes(service) &&
                            "Professional service with expert care and quality materials."}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Work Portfolio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {worker.documents.workImages.map((image, index) => (
                      <div
                        key={index}
                        className="rounded-md overflow-hidden aspect-square"
                      >
                        <img
                          src={image}
                          alt={`Work sample ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Customer Reviews
                  </h3>
                  {/* Placeholder reviews */}
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <div className="flex items-start mb-2">
                        <img
                          src="https://i.pravatar.cc/150?img=32"
                          alt="Customer"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium">Rahul Mehta</h4>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 5
                                    ? "fill-yellow-400 stroke-yellow-400"
                                    : "stroke-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              1 month ago
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Excellent service! Very professional and completed the
                        job quickly. Would definitely hire again for future
                        needs.
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <div className="flex items-start mb-2">
                        <img
                          src="https://i.pravatar.cc/150?img=45"
                          alt="Customer"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium">Priya Singh</h4>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 4
                                    ? "fill-yellow-400 stroke-yellow-400"
                                    : "stroke-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              2 months ago
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Good work overall. Arrived on time and fixed the issue,
                        though the price was a bit higher than expected.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-start mb-2">
                        <img
                          src="https://i.pravatar.cc/150?img=68"
                          alt="Customer"
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium">Anil Patel</h4>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 5
                                    ? "fill-yellow-400 stroke-yellow-400"
                                    : "stroke-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              3 months ago
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Top notch service! Very knowledgeable and explained
                        everything clearly. The work was done perfectly and they
                        cleaned up after themselves. Highly recommend!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerProfile;
