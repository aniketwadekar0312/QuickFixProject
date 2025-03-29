import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { confirmSetupIntent } from '@/api/paymentApi';

const AddCardForm = ({ onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement);
      
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // Confirm the setup intent with the payment method
      const { error: setupError, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (setupError) {
        setError(setupError.message);
        setProcessing(false);
        return;
      }

      // Confirm the setup with our backend
      await confirmSetupIntent(setupIntent.id);
      
      toast({
        title: "Success",
        description: "Card added successfully"
      });
      
      onSuccess();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError('An unexpected error occurred.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add card. Please try again."
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="min-w-[120px]"
        >
          {processing ? 'Adding...' : 'Add Card'}
        </Button>
      </div>
    </form>
  );
};

export default AddCardForm; 