import { useState } from "react";
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

const WorkerProfile = () => {
  const { id } = useParams();
  const worker = mockWorkers.find(w => w.id === id);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  if (!worker) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Worker Not Found</h1>
            <p className="mb-6">The service provider you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/workers">View All Service Providers</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
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
                <h1 className="text-3xl font-bold mb-2">{worker.name}</h1>
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400 mr-1" />
                  <span className="font-medium">{worker.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-700 mb-6">{worker.description}</p>
                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" disabled={!worker.available}>Book Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Book an Appointment</DialogTitle>
                      <DialogDescription>Select a service, date, and time to book with {worker.name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBooking}>
                      <Label>Select Service</Label>
                      {worker.services.map((service) => (
                        <button key={service} onClick={() => setSelectedService(service)}>{service}</button>
                      ))}
                      <Label>Select Date</Label>
                      <Calendar selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
                      <Label>Select Time</Label>
                      {timeSlots.map((time) => (
                        <button key={time} onClick={() => setSelectedTime(time)}>{time}</button>
                      ))}
                      <DialogFooter>
                        <Button type="submit">Confirm Booking</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerProfile;
