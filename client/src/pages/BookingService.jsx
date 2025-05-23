import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import BookingForm from "@/components/booking/BookingForm";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentSection from "@/components/booking/PaymentSection";
import { getService } from "../api/servicesApi";
import { getUsers } from "../api/authServices";
import {
  createBooking,
  intiatePayment,
  verifyPayment,
} from "../api/bookingApi";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51MX036SABObgi1uhHXCwZMh1JkOuNafgiCZWnvEEzRHTPNDRFbwlOr5TOopcgNnuMQ0gDTnqWKWlZhzlrHZUTKH800JIj4QVSP"
);

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(id || "");
  const [selectedWorker, setSelectedWorker] = useState("");

  const intialstate = {

  }

  const [formData, setFormData] = useState({

  })
  const [date, setDate] = useState(undefined);
  const [timeSlot, setTimeSlot] = useState("");
  const [address, setAddress] = useState(
    "123, ABC Road, South East, Mumbai - 400065"
  );
  const [additionalNotes, setAdditionalNotes] = useState("ABC XYZ");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [contactNumber, setContactNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  // Mock saved payment methods (in a real app, this would come from an API)
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm1",
      cardNumber: "4242 4242 4242 4242",
      cardType: "Visa",
      expiryDate: "12/34",
      isDefault: true,
    },
    {
      id: "pm2",
      cardNumber: "**** **** **** 5555",
      cardType: "Mastercard",
      expiryDate: "08/24",
      isDefault: false,
    },
  ]);

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await getService();
      // console.log(res.services);
      setServices(res.services);
    } catch (error) {
      console.log("error fetching Services", error);
    }finally{
      setLoading(false)
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers(); // Use API function
      const allUsers = res; // API now correctly returns an array

      // Filter only workers
      const workerUsers = allUsers.filter((user) => user.role === "worker");

      setWorkers(workerUsers);
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchUsers();
  }, []);

  const serviceDetails = id
  ? services.find((service) => service._id === id)
  : null;
const workerName = selectedWorker
  ? workers.find((w) => w._id === selectedWorker)?.name
  : undefined;

  const servicePrice = selectedWorker
  ? workers.find((w) => w._id === selectedWorker)?.pricing[serviceDetails?.name]
  : undefined;

  useEffect(() => {
    if (serviceDetails) {
      setSelectedService(serviceDetails._id);
    }

    if (currentUser?.phone) {
      setContactNumber(currentUser.phone);
    }
    const defaultPayment = paymentMethods.find((method) => method.isDefault);
    if (defaultPayment) {
      setSelectedPaymentId(defaultPayment.id);
    }
  }, [serviceDetails, currentUser, paymentMethods]);

  const initiatePayment = async () => {
    try {
      const totalAmount = servicePrice ? servicePrice + 49 : 0;
      const res = await intiatePayment({
        workerName: workerName,
        serviceName: serviceDetails?.name,
        amount: totalAmount * 100 // in paisa
      });
      if (res.status) {
        setClientSecret(res.clientSecret);
        setCurrentStep(2);
      }
      return res;
    } catch (error) {
      console.log("error in payment", error);
    }
  };

  const handleNextStep = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a service.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/book-service/${id || ""}` } });
      return;
    }

    if (currentStep === 1) {
      // Validate all required fields for booking details
      if (
        !selectedService ||
        !date ||
        !timeSlot ||
        !address ||
        !contactNumber
      ) {
        toast({
          title: "Incomplete Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Move to payment step
      initiatePayment();
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a service.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    if (!selectedPaymentId) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const totalAmount = servicePrice ? servicePrice + 49 : 0;
      // Prepare booking data
      const bookingData = {
        serviceId: selectedService,
        workerId: selectedWorker !== "any" ? selectedWorker : undefined,
        date: date?.toISOString(),
        timeSlot,
        address,
        additionalNotes,
        paymentMethod,
        paymentId: selectedPaymentId,
        contactNumber,
        totalAmount,
      };

      if (paymentMethod === "online") {
        localStorage.setItem("pendingBooking",JSON.stringify(bookingData));
        const initiatedPaymentRes = await initiatePayment();
        
       
        // const res = await verifyPayment({session_id: initiatedPaymentRes.session_id});
        
        
        // if (res.paymentStatus === "paid") {
        //   const response = await createBooking(bookingData);
        //   console.log("booking res",response);
          
        //   if (response.status) {
        //     toast({
        //       title: "Booking Successful",
        //       description: "Your service has been booked successfully!",
        //     });
        //     setIsSubmitting(false);
        //     navigate("/customer/dashboard");
        //   }
        // }
      } else {
        const response = await createBooking(bookingData);
        if (response.status) {
          toast({
            title: "Booking Successful",
            description: "Your service has been booked successfully!",
          });
          setIsSubmitting(false);
          navigate("/customer/dashboard");
        }
      }
    } catch (error) {
      console.error("Error in booking process:", error);
      toast({
        title: "Booking Failed",
        description:
          "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  const addNewPaymentMethod = () => {
    navigate("/customer/payment-methods");
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-4 px-2">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/services")}
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-8 text-center">
            {currentStep === 1 ? "Book a Service" : "Payment"}
          </h1>

          <div className="max-w-6xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-10">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                    currentStep >= 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Service Details</span>
              </div>

              <div
                className={`h-1 w-20 ${
                  currentStep >= 2 ? "bg-primary" : "bg-gray-200"
                }`}
              ></div>

              <div className="flex items-center space-x-2">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                    currentStep >= 2
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {currentStep === 1 ? (
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
                    services={services}
                    workers={workers}
                    workerName={workerName}
                    handleSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  // <Elements stripe={stripePromise}>
                  // <PaymentSection
                  //   paymentMethod={paymentMethod}
                  //   setPaymentMethod={setPaymentMethod}
                  //   paymentMethods={paymentMethods}
                  //   selectedPaymentId={selectedPaymentId}
                  //   setSelectedPaymentId={setSelectedPaymentId}
                  //   handleSubmit={handleSubmit}
                  //   isSubmitting={isSubmitting}
                  //   handlePreviousStep={handlePreviousStep}
                  //   addNewPaymentMethod={addNewPaymentMethod}
                  //   clientSecret={clientSecret}
                  //   stripe={stripePromise}
                  // />
                  // </Elements>
                  <>
                    {clientSecret && (
                      <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{ clientSecret }}
                      >
                        <EmbeddedCheckout />
                      </EmbeddedCheckoutProvider>
                    )}
                  </>
                )}
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
                  services={services}
                  servicePrice={servicePrice}
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
