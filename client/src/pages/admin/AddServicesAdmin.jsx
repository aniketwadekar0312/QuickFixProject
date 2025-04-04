import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, PlusCircle, DollarSign, Tag, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkerServices, createService, updateService, deleteService } from "@/api/workerApi";
import { getService } from "@/api/servicesApi";

const AddServicesAdmin = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [categories, setCategories] = useState([]);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      responseTime: "Within 24 hours",
      active: true,
      image: "",
    },
  });

  // Fetch service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getService();
        const uniqueCategories = [...new Set(res.services.map(s => s.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch worker services
  const { data: workerServices, isLoading } = useQuery({
    queryKey: ["workerServices"],
    queryFn: getWorkerServices,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries(["workerServices"]);
      setShowAddService(false);
      form.reset();
      toast({
        title: "Success",
        description: "Service added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add service",
        variant: "destructive",
      });
    },
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: ({ serviceId, serviceData }) => updateService(serviceId, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries(["workerServices"]);
      setEditingService(null);
      form.reset();
      toast({
        title: "Success",
        description: "Service updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    },
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries(["workerServices"]);
      toast({
        title: "Success",
        description: "Service deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    if (editingService) {
      updateServiceMutation.mutate({
        serviceId: editingService._id,
        serviceData: data,
      });
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      responseTime: service.responseTime,
      active: service.active,
      image: service.image || "",
    });
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(serviceId);
    }
  };

  const handleCancel = () => {
    setEditingService(null);
    setShowAddService(false);
    form.reset();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Services</h1>
          {!showAddService && !editingService && (
            <Button onClick={() => setShowAddService(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
            </Button>
          )}
        </div>

        {(showAddService || editingService) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Service name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter service name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your service"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      rules={{ required: "Price is required", min: { value: 0, message: "Price must be positive" } }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="responseTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select response time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Within 1 hour">Within 1 hour</SelectItem>
                            <SelectItem value="Within 3 hours">Within 3 hours</SelectItem>
                            <SelectItem value="Within 6 hours">Within 6 hours</SelectItem>
                            <SelectItem value="Within 12 hours">Within 12 hours</SelectItem>
                            <SelectItem value="Within 24 hours">Within 24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    rules={{ required: "Service image is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Image</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            {...field}
                            placeholder="Enter image URL"
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a URL for your service image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Toggle to show/hide this service from customers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createServiceMutation.isLoading || updateServiceMutation.isLoading}>
                      {editingService ? "Update Service" : "Add Service"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workerServices?.services?.map((service) => (
            <Card key={service._id}>
              <CardHeader>
                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <Switch checked={service.active} disabled />
                </CardTitle>
                <CardDescription>{service.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>₹{service.price}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span>{service.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{service.responseTime}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(service)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(service._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AddServicesAdmin;
