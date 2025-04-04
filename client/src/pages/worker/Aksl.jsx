import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../components/ui/use-toast";
import { Trash2, Tag, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Layout from "../../components/layout/Layout";
import { getService } from "../../api/servicesApi";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

// Form validation schema
const formSchema = z.object({
  services: z
    .array(
      z.object({
        name: z.string().min(1, "Service name is required"),
        price: z.number().min(0, "Price must be a positive number")
      })
    )
    .min(1, "At least one service must be added"),
  specializations: z.array(z.string()),
});

const WorkerServiceDetails = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState({ service: {name: "", image: ""}, price: "" });
  const [services, setServices] = useState([]);

  // Initialize form with current user data
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
    },
    mode: "onBlur",
  });

  // Service management functions
  const handleAddService = () => {
    if (!newService.service || !newService.price) {
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
        service: {name: newService.service.name.trim(), image: newService.service.image},
        price: parseFloat(newService.price)
      },
    ];

    form.setValue("services", updatedServices);
    setNewService({ service: {}, price: "" });
  };

  const handleRemoveService = (index) => {
    const updatedServices = form
      .getValues("services")
      .filter((_, i) => i !== index);
    form.setValue("services", updatedServices);
  };

  // Form submission handler
  async function onSubmit(values) {
    try {
      const updatedFields = {
        services: values.services
      };

      setLoading(true);
      console.log(updatedFields)
      //const response = await updateUser(currentUser._id, updatedFields);

      // if (response.data && response.data.status) {
      //   toast({
      //     title: "Service updated",
      //     description: "Your profile has been updated successfully.",
      //   });

      //   // Update current user in context and local storage
      //   const updatedUser = { ...currentUser, ...updatedFields };
      //   setCurrentUser(updatedUser);
      //   localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      // }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const getServices = async () => {
    const services = await getService();
    setServices(services?.services);
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Services & Pricing
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Services Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-sm mb-3 text-gray-600">
                    Add New Service
                  </h4>
                </div>

                {/* Add Service Form */}

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <Select
                      value={newService.name}
                      onValueChange={(selectedValue) => setNewService({
                        ...newService,
                        service: {name: selectedValue, image: services.find(service => service.name === selectedValue)?.image},
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Services" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Select Services">
                          Select Services
                        </SelectItem>
                        {services?.length > 0 ? (
                          services.map((service, index) => (
                            <SelectItem key={index} value={service.name}>
                              {service.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled value="No Services Available">
                            No Services Available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Price"
                          value={newService.price}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              price: e.target.value,
                            })
                          }
                          className="pl-8 w-32"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleAddService}
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-2">
                  {form.getValues("services")?.length > 0 ? (
                    form.getValues("services").map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex-col items-center space-x-4 flex-1">
                          <img
                          src={service?.service.image}
                          alt={service?.service.name} className="w-44 h-32 rounded-md"/>
                          <label
                            htmlFor={`service-${index}`}
                            className="flex-1 font-medium"
                          >
                            {service.service.name}
                          </label>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-900 font-medium">
                            ₹{service.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(index)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No services added yet. Add your first service to continue.
                    </div>
                  )}
                </div>
                <FormMessage>
                  {form.formState.errors.services?.message}
                </FormMessage>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" className="px-8 py-2" disabled={loading}>
                {loading ? "Saving..." : "Add Services"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default WorkerServiceDetails;