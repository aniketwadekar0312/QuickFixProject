import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, PlusCircle, ArrowLeft, Trash2 } from "lucide-react";
import {
  useStripe,
  useElements,
  CardElement,
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { useToast } from "@/components/ui/use-toast";
import { getPaymentMethods, deletePaymentMethod } from "@/api/paymentApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


// The Stripe form component
const StripeCardForm = ({
  isSubmitting,
  handleSubmit,
  handlePreviousStep,
  clientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const { toast } = useToast();

  // Handle the payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setCardError("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: "Customer Name",
        email: "customer@example.com",
      },
    });

    if (error) {
      setCardError(error.message || "An error occurred with your card");
      return;
    }

    if (clientSecret) {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );
      
      if (error) {
        console.log('error', error);
        setCardError("Payment failed");
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: error.message || "There was an error processing your payment."
        });
      } else if (paymentIntent?.status === "succeeded") {
        handleSubmit(e);
      }
    } else {
      setCardError("Payment failed");
      console.log('Client secret not found');
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Unable to process payment. Please try again."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="border rounded-md p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
        {cardError && (
          <p className="text-sm text-red-500 mt-1">{cardError}</p>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Your card information is secured with SSL encryption.
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={handlePreviousStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !stripe}
          className="min-w-[120px]"
          onClick={(e) => handlePaymentSubmit(e)}
        >
          {isSubmitting ? "Processing..." : "Pay & Confirm"}
        </Button>
      </div>
    </div>
  );
};

// The main payment section component
const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  selectedPaymentId,
  setSelectedPaymentId,
  handleSubmit,
  isSubmitting,
  handlePreviousStep,
  addNewPaymentMethod,
  clientSecret,
  stripe
}) => {
  const [useNewCard, setUseNewCard] = useState(false);
  // const { toast } = useToast();
  const queryClient = useQueryClient();
  // const stripe = useStripe();

  // Fetch payment methods using React Query
  const { data: response, isLoading } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethods,
  });

  // Extract payment methods from response
  const paymentMethods = response?.data || [];

  // Delete payment method mutation
  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentMethods']);
      toast({
        title: "Success",
        description: "Payment method deleted successfully"
      });
      // If the deleted method was selected, clear the selection
      if (selectedPaymentId === methodId) {
        setSelectedPaymentId("");
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete payment method"
      });
    }
  });

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);

    // Reset selected payment ID if paying with cash
    if (value !== "online") {
      setSelectedPaymentId("");
      setUseNewCard(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    try {
      await deleteMutation.mutateAsync(methodId);
    } catch (error) {
      // Error is handled by the mutation
      console.error('Error deleting payment method:', error);
    }
  };

  // Handle payment with saved card
  const handleSavedCardPayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !selectedPaymentId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a payment method"
      });
      return;
    }

    try {
      // Get the selected payment method from our list
      const selectedMethod = paymentMethods.find(method => method.paymentMethodId === selectedPaymentId);
      
      if (!selectedMethod) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Selected payment method not found"
        });
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: selectedPaymentId,
          return_url: `${window.location.origin}/booking/confirmation`,
        }
      );

      if (error) {
        console.error('Payment error:', error);
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: error.message || "There was an error processing your payment."
        });
      } else if (paymentIntent?.status === "succeeded") {
        handleSubmit(e);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again."
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <RadioGroup
            value={paymentMethod}
            onValueChange={handlePaymentMethodChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="cod" id="cod" />
              <Label
                htmlFor="cod"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Wallet className="h-5 w-5 text-yellow-600" />
                Cash on Delivery
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3">
              <RadioGroupItem value="online" id="online" />
              <Label
                htmlFor="online"
                className="flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="h-5 w-5 text-blue-600" />
                Online Payment
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "online" && (
            <div className="space-y-4 mt-4 border-t pt-4">
              <p className="font-medium text-sm">Select Payment Method</p>

              {paymentMethods.length > 0 && !useNewCard && (
                <RadioGroup
                  value={selectedPaymentId}
                  onValueChange={setSelectedPaymentId}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method._id}
                      className="flex items-center space-x-2 border rounded-md p-3"
                    >
                      <RadioGroupItem value={method.paymentMethodId} id={method._id} />
                      <Label
                        htmlFor={method._id}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p>
                              {method.brand} •••• {method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {method.exp_month}/{method.exp_year}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeletePaymentMethod(method._id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {/* New Card Option */}
              {!useNewCard ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setUseNewCard(true)}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Use New Card
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addNewPaymentMethod}
                      className="flex items-center gap-2"
                    >
                      Manage Payment Methods
                    </Button>
                  </div>
                  
                  {selectedPaymentId && paymentMethods.length > 0 && (
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePreviousStep}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        onClick={handleSavedCardPayment}
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                      >
                        {isSubmitting ? "Processing..." : "Pay & Confirm"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <StripeCardForm
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  handlePreviousStep={handlePreviousStep}
                  clientSecret={clientSecret}
                />
              )}
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="space-y-6 mt-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 text-sm">
                <p>
                  You will pay the service provider in cash after the service is
                  completed.
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
