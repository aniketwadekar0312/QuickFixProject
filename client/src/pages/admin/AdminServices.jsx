import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
import Layout from "../../components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getCategory } from "../../api/adminServices";
import { getServiceById, addService, updateService } from "../../api/servicesApi";
import { Loader2 } from "lucide-react";

const AddService = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceid");
  const isEditMode = Boolean(serviceId);
  
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      image: "",
    },
  });

  // Watch the image field to update preview
  const watchedImage = form.watch("image");
  
  // Update image preview when the image URL changes
  useEffect(() => {
    setImagePreview(watchedImage);
  }, [watchedImage]);

  const fetchServiceById = async () => {
    if (!serviceId) return;
    
    setIsLoading(true);
    try {
      const res = await getServiceById(serviceId);
      if (res.status) {
        form.reset({
          name: res.service.name,
          description: res.service.description,
          category: res.service.category?._id || "",
          image: res.service.image || "",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch service details.",
          variant: "destructive",
        });
        // Navigate back if service not found
        navigate("/admin/services");
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      toast({
        title: "Error",
        description: "Failed to fetch service details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategory();
      if (res.status) {
        setCategories(res.categories || []);
      } else {
        toast({
          title: "Warning",
          description: "Failed to load categories. Please try again.",
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Error getting categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let res;
      // Fixed: Logic was inverted - should call updateService when id exists
      if (isEditMode) {
        res = await updateService(serviceId, data);
      } else {
        res = await addService(data);
      }
      
      if (res.status) {
        toast({
          title: `Service ${isEditMode ? 'updated' : 'added'}`,
          description: `Your service has been ${isEditMode ? 'updated' : 'added'} successfully.`,
        });
        // Navigate back to services list after successful submission
        navigate("/admin/services");
      } else {
        throw new Error(res.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} service:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'add'} service. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServiceById();
  }, [serviceId]);  // Added proper dependency

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
              <p className="text-lg text-gray-600">Loading service details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Service" : "Add New Service"}
            </h1>
            <p className="text-gray-600">
              {isEditMode 
                ? "Update the details of your existing service" 
                : "Create a new service to offer to customers"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Fill in the information below to {isEditMode ? "update your" : "create a new"} service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Service name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Plumbing Repair"
                            {...field}
                            aria-label="Service name"
                          />
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
                            placeholder="Describe the service you offer"
                            rows={4}
                            {...field}
                            aria-label="Service description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              aria-label="Service category"
                            >
                              <option value="" disabled>
                                Select a category
                              </option>
                              {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              aria-label="Service image URL"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                      <div className="h-32 w-32 border rounded-md overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/400x400?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? "Updating..." : "Adding..."}
                        </>
                      ) : (
                        isEditMode ? "Update Service" : "Add Service"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AddService;