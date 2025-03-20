import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Trash2, PlusCircle, Check } from "lucide-react";

const CustomerPaymentMethods = () => {

  const { toast } = useToast();
const [showAddCard, setShowAddCard] = useState(false);

// Mock saved payment methods
const [paymentMethods, setPaymentMethods] = useState([
  {
    id: "pm1",
    cardNumber: "**** **** **** 4242",
    cardType: "Visa",
    expiryDate: "12/25",
    isDefault: true,
  },
  {
    id: "pm2",
    cardNumber: "**** **** **** 5555",
    cardType: "Mastercard",
    expiryDate: "08/24",
    isDefault: false,
  }
]);

const handleDeleteCard = (id) => {
  setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  toast({
    title: "Payment method removed",
    description: "The payment method has been successfully removed."
  });
};

const handleSetDefault = (id) => {
  setPaymentMethods(paymentMethods.map(method => ({
    ...method,
    isDefault: method.id === id
  })));
  toast({
    title: "Default payment method updated",
    description: "Your default payment method has been updated."
  });
};

const handleAddCard = (e) => {
  e.preventDefault();
  const newCard = {
    id: `pm${paymentMethods.length + 1}`,
    cardNumber: "**** **** **** 1234",
    cardType: "Visa",
    expiryDate: "01/28",
    isDefault: false
  };
  setPaymentMethods([...paymentMethods, newCard]);
  setShowAddCard(false);
  toast({
    title: "Payment method added",
    description: "Your new payment method has been added successfully."
  });
};
return (
  <Layout>
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-gray-600">Manage your payment methods for booking services</p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>
                Your saved payment methods for booking services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      method.isDefault ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-medium">
                          {method.cardType} {method.cardNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires {method.expiryDate}
                        </div>
                        {method.isDefault && (
                          <div className="text-xs font-medium text-primary mt-1 flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Default payment method
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCard(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowAddCard(!showAddCard)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
          
          {showAddCard && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCard}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddCard(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Payment Method
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  </Layout>
);
};

export default CustomerPaymentMethods;
