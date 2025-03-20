import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { mockServices, mockWorkers } from "@/data/mockData";
import BookingForm from "@/components/booking/BookingForm";
import BookingSummary from "@/components/booking/BookingSummary";

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [selectedService, setSelectedService] = useState(id || "");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [date, setDate] = useState(undefined);
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [contactNumber, setContactNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const serviceDetails = id ? mockServices.find(service => service.id === id) : null;
  const workerName = selectedWorker ? mockWorkers.find(w => w.id === selectedWorker)?.name : undefined;
  
  useEffect(() => {
    if (serviceDetails) {
      setSelectedService(serviceDetails.id);
    }
    if (currentUser?.phone) {
      setContactNumber(currentUser.phone);
    }
  }, [serviceDetails, currentUser]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a service.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    if (!date || !timeSlot || !address || !contactNumber) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Booking Successful",
        description: "Your service has been booked successfully!",
      });
      setIsSubmitting(false);
      navigate("/customer/dashboard");
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-8 text-center">Book a Service</h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <BookingForm
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  selectedWorker={selectedWorker}
                  setSelectedWorker={setSelectedWorker}
                  date={date}
                  setDate={setDate}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  address={address}
                  setAddress={setAddress}
                  additionalNotes={additionalNotes}
                  setAdditionalNotes={setAdditionalNotes}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  contactNumber={contactNumber}
                  setContactNumber={setContactNumber}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  serviceDetails={serviceDetails}
                />
              </div>
              
              <div>
                <BookingSummary
                  selectedService={selectedService}
                  selectedWorker={selectedWorker}
                  date={date}
                  timeSlot={timeSlot}
                  address={address}
                  paymentMethod={paymentMethod}
                  workerName={workerName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookService;