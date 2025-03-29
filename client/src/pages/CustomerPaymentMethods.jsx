import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Trash2, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod, createSetupIntent } from "@/api/paymentApi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddCardForm from "@/components/payment/AddCardForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CustomerPaymentMethods = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payment methods
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
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete payment method"
      });
    }
  });

  // Set default payment method mutation
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentMethods']);
      toast({
        title: "Success",
        description: "Default payment method updated successfully"
      });
    },
    onError: (error) => {
    toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update default payment method"
      });
    }
  });

  const handleDeleteCard = async (methodId) => {
    try {
      await deleteMutation.mutateAsync(methodId);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await setDefaultMutation.mutateAsync(methodId);
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleAddCard = async () => {
    try {
      const data = await createSetupIntent();
      setClientSecret(data.clientSecret);
      setShowAddCard(true);
    } catch (error) {
    toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize card addition"
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <Button onClick={handleAddCard} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Card
          </Button>
          </div>

        {showAddCard ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Card</CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <AddCardForm
                    clientSecret={clientSecret}
                    onSuccess={() => {
                      setShowAddCard(false);
                      setClientSecret(null);
                      queryClient.invalidateQueries(['paymentMethods']);
                    }}
                  />
                </Elements>
              )}
            </CardContent>
          </Card>
        ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Saved Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No payment methods saved yet
              </div>
            ) : (
              <RadioGroup className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                    key={method._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem
                        value={method._id}
                        id={method._id}
                        checked={method.isDefault}
                        onChange={() => handleSetDefault(method._id)}
                      />
                        <div>
                        <Label htmlFor={method._id} className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          {method.brand} •••• {method.last4}
                        </Label>
                        <p className="text-sm text-gray-500">
                          Expires {method.exp_month}/{method.exp_year}
                        </p>
                      </div>
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
                        onClick={() => handleDeleteCard(method._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerPaymentMethods;
