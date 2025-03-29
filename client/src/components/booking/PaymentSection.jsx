import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, PlusCircle, ArrowLeft } from "lucide-react";
import {
  useStripe,
  useElements,
  CardElement,
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";


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
          payment_method: paymentMethod.id, // Use the payment method ID
        }
      );
      
      if (error) {
        console.log('error', error)
        setCardError("Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        handleSubmit(e); 
      }
    }else{
      setCardError("Payment failed");
      console.log('Client secret not found')
    }
  };

  return (
    // <form onSubmit={handlePaymentSubmit}>
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
            onClick={(e) =>handlePaymentSubmit(e)}
          >
            {isSubmitting ? "Processing..." : "Pay & Confirm"}
          </Button>
        </div>
      </div>
    // </form>
  );
};

// The main payment section component
const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  paymentMethods,
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

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);

    // Reset selected payment ID if paying with cash
    if (value !== "online") {
      setSelectedPaymentId("");
      setUseNewCard(false);
    }
  };

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
                      key={method.id}
                      className="flex items-center space-x-2 border rounded-md p-3"
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label
                        htmlFor={method.id}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p>
                              {method.cardType} {method.cardNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {method.expiryDate}
                            </p>
                          </div>
                          {method.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
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
                        onClick={handleSubmit} 
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
