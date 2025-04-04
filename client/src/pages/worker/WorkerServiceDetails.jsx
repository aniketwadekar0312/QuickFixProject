import React, { useState, useEffect } from "react";
import { Form, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/use-toast";
import { Trash2, ArrowLeft  } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Layout from "../../components/layout/Layout";
import { getService } from "../../api/servicesApi";
import {updateWorkerService} from "../../api/workerApi"
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

// Form validation schema
const formSchema = z.object({
  services: z
    .array(
      z.object({
        name: z.string().min(1, "Service name is required"),
        price: z.number().min(1, "Price must be a positive number"),
        image: z.string().optional(),
      })
    )
    .min(1, "At least one service must be added"),
});

const WorkerServiceDetails = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
  });
  const [services, setServices] = useState([]);

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
    },
    mode: "onBlur",
  });

  // Watch services list for UI updates
  const formServices = form.watch("services");

  // Fetch available services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getService();
        setServices(response?.services || []);
      } catch (error) {
        toast({
          title: "Error fetching services",
          description: "Could not load services. Please try again later.",
          variant: "destructive",
        });
      }
    };
    fetchServices();
  }, []);

  // Handle adding a new service
  const handleAddService = () => {
    if (!newService.name || !newService.price) {
      toast({
        title: "Error",
        description: "Service name and price are required",
        variant: "destructive",
      });
      return;
    }

    const updatedServices = [
      ...form.getValues("services"),
      {
        name: newService.name.trim(),
        price: parseFloat(newService.price),
      },
    ];

    form.setValue("services", updatedServices, { shouldValidate: true });
    setNewService({ name: "", price: "" });
  };

  // Handle removing a service
  const handleRemoveService = (index) => {
    const updatedServices = form
      .getValues("services")
      .filter((_, i) => i !== index);
    form.setValue("services", updatedServices, { shouldValidate: true });
  };

  // Handle form submission
  async function onSubmit(values) {
    try {
      setLoading(true);
      console.log("Submitting Data:", values); // Log values to confirm data structure

      const response = await updateWorkerService({ services: values.services });

      if (response?.status) {
        toast({ title: "Services Updated", description: "Your services have been updated successfully." });
        setCurrentUser({ ...currentUser, services: values.services });
        localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, services: values.services }));
        navigate(-1); // Navigate back to the previous page
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Services & Pricing
          </h2>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-3 h-3"/>Back
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium text-sm mb-3 text-gray-600">
                  Add New Service
                </h4>

                <div className="flex flex-col md:flex-row gap-3 ">
                  <Select
                    value={newService.name}
                    onValueChange={(selectedValue) => {
                      setNewService({
                        ...newService,
                        name: selectedValue,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service, index) => (
                        <SelectItem key={index} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({ ...newService, price: e.target.value })
                    }
                    className="w-32"
                  />

                  <Button
                    type="button"
                    onClick={handleAddService}
                    disabled={!newService.name || !newService.price}
                  >
                    Add
                  </Button>
                </div>

                <div className="mt-4">
                  {formServices.length > 0 ? (
                    formServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-md mb-2"
                      >
                        <div className="flex items-center gap-4">
                          <span>{service.name}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span>₹{service.price}</span>
                          <button onClick={() => handleRemoveService(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No services added.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Add Services"}
            </Button>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default WorkerServiceDetails;
