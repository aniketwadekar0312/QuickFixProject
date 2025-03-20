import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, PlusCircle, DollarSign, Tag, Clock } from "lucide-react";
import { mockServices } from "@/data/mockData";

const WorkerManageServices = () => {

  const { toast } = useToast();
const [showAddService, setShowAddService] = useState(false);

// Get a subset of mock services
const [workerServices, setWorkerServices] = useState([
  {
    ...mockServices[0],
    active: true,
    responseTime: "Within 1 hour",
    customPrice: 550
  },
  {
    ...mockServices[1],
    active: true,
    responseTime: "Within 2 hours",
    customPrice: 650
  },
  {
    ...mockServices[5],
    active: false,
    responseTime: "Same day",
    customPrice: 850
  }
]);

const handleToggleService = (id) => {
  setWorkerServices(workerServices.map(service => 
    service.id === id ? { ...service, active: !service.active } : service
  ));
  const service = workerServices.find(s => s.id === id);
  toast({
    title: `Service ${service?.active ? 'deactivated' : 'activated'}`,
    description: `${service?.name} has been ${service?.active ? 'deactivated' : 'activated'} successfully.`
  });
};

const handleDeleteService = (id) => {
  setWorkerServices(workerServices.filter(service => service.id !== id));
  toast({
    title: "Service removed",
    description: "The service has been removed from your offerings."
  });
};

const handleAddService = (e) => {
  e.preventDefault();
  // For demo, add a fixed service
  const newService = {
    ...mockServices[3],
    id: `service${workerServices.length + 10}`,
    active: true,
    responseTime: "Within 1 day",
    customPrice: 600
  };
  setWorkerServices([...workerServices, newService]);
  setShowAddService(false);
  toast({
    title: "Service added",
    description: "The new service has been added to your offerings."
  });
};

return (
  <Layout>
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Manage Services</h1>
          <p className="text-gray-600">Add, edit or remove services you offer to customers</p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Services</CardTitle>
              <CardDescription>
                Services you currently offer to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workerServices.map((service) => (
                  <div 
                    key={service.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-48 h-40 bg-gray-100 flex-shrink-0">
                        <img 
                          src={service.imageUrl || "/placeholder.svg"} 
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-gray-600 mt-1">{service.description}</p>
                            
                            <div className="flex flex-wrap gap-3 mt-3">
                              <div className="flex items-center text-sm">
                                <Tag className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{service.category}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                                <span>₹{service.customPrice}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                <span>{service.responseTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`active-${service.id}`}
                              checked={service.active}
                              onCheckedChange={() => handleToggleService(service.id)}
                            />
                            <Label htmlFor={`active-${service.id}`} className="cursor-pointer">
                              {service.active ? 'Active' : 'Inactive'}
                            </Label>
                          </div>
                          <div className="text-sm text-gray-500">
                            {service.active ? 'Customers can book this service' : 'Service not available for booking'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {workerServices.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You don't have any services yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setShowAddService(!showAddService)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </CardFooter>
          </Card>
          
          {showAddService && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddService}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="serviceName">Service Name</Label>
                      <Input
                        id="serviceName"
                        placeholder="e.g. Plumbing Repair"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="serviceDescription">Description</Label>
                      <Textarea
                        id="serviceDescription"
                        placeholder="Describe the service you offer"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="serviceCategory">Category</Label>
                        <Input
                          id="serviceCategory"
                          placeholder="e.g. Home Repair"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="servicePrice">Price (₹)</Label>
                        <Input
                          id="servicePrice"
                          type="number"
                          placeholder="e.g. 500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="responseTime">Response Time</Label>
                      <Input
                        id="responseTime"
                        placeholder="e.g. Within 2 hours"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddService(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Service
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

export default WorkerManageServices;