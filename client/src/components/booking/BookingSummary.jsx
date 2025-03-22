import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, CreditCard, Wallet } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { mockServices } from "@/data/mockData";

const BookingSummary = ({
  selectedService,
  selectedWorker,
  date,
  timeSlot,
  address,
  paymentMethod,
  workerName,
  currentStep = 1,
  selectedPaymentId = "",
  paymentMethods = [],
  services
}) => {
  const serviceDetails = selectedService 
    ? services.find(s => s._id === selectedService) 
    : null;
      
  // Get selected payment method details
  const selectedPaymentMethod = selectedPaymentId
    ? paymentMethods.find(method => method.id === selectedPaymentId)
    : undefined;
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
        
        {selectedService ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Selected Service</p>
              <p className="font-medium">
                {serviceDetails?.name || "Not selected"}
              </p>
            </div>
            
            {selectedWorker && workerName && (
              <div>
                <p className="text-sm text-gray-500">Service Provider</p>
                <p className="font-medium">{workerName}</p>
              </div>
            )}
            
            {date && (
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{format(date, "PPP")}</p>
                </div>
              </div>
            )}
            
            {timeSlot && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time Slot</p>
                  <p className="font-medium">{timeSlot}</p>
                </div>
              </div>
            )}
            
            {address && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{address}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start">
            {paymentMethod === "online" ? (
                <CreditCard className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              ) : (
                <Wallet className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              )}
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">
                  {paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                </p>

                {currentStep === 2 && paymentMethod === "online" && selectedPaymentMethod && (
                  <p className="text-sm text-gray-600">
                    {selectedPaymentMethod.cardType} {selectedPaymentMethod.cardNumber}
                  </p>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Service Fee</p>
                <p className="font-medium">
                  {serviceDetails ? `₹${serviceDetails.price}` : "-"}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-500">Platform Fee</p>
                <p className="font-medium">₹49</p>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <p>Total</p>
                <p>
                  {serviceDetails
                    ? `₹${(serviceDetails.price || 0) + 49}`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Select a service to see the summary</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 block">
        <p className="text-xs text-gray-500 mt-4">
          By confirming your booking, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BookingSummary;
