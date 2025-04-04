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
import { Edit, Trash2, PlusCircle, IndianRupee, Tag, Clock, IndianRupeeIcon, Plus, X  } from "lucide-react";
import { mockServices } from "@/data/mockData";
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
import { getService } from "../../api/servicesApi";
import {
  updateUserProfile,
  getUsers,
  getUserById,
} from "../../api/authServices";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { getWorkerServices } from "../../api/workerApi";

const WorkerManageServices = () => {
  const { toast } = useToast();
  const { currentUser, setCurrentUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);

  const [showAddService, setShowAddService] = useState(false);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [specialization, setSpecialization] = useState("");
  const [workSampleLink, setWorkSampleLink] = useState("");
  const [servicePrices, setServicePrices] = useState({});
  // console.log("setCurrentUser:", setCurrentUser);

  // const getUser = async () => {
  //     try {
  //       const response = await getUserById(currentUser?._id);
  //       // const storedUser = localStorage.getItem("currentUser");;
  //       console.log(currentUser._id);

  //       if (response.data.status) {
  //         try {
  //           // const user = JSON.parse(storedUser);
  //           setUser(response.data.user);
  //         } catch (error) {
  //           console.error("Failed to parse stored user:", error);
  //           localStorage.removeItem("currentUser");
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   useEffect(() => {
  //     if (currentUser?._id) {
  //       getUser();
  //     }
  //   }, [currentUser]);

  // console.log(user);

  const fetchServices = async () => {
    try {
      const res = await getService();
      console.log(res.services);

      setServices(res.services);
    } catch (error) {
      console.log("error fetching Services", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);
  // console.log(currentUser);
  // console.log(currentUser?.location);

  const form = useForm({
    defaultValues: {
      location: currentUser?.location || "",
      description: currentUser?.description || "",
      services: currentUser?.services || [],
      pricing: currentUser?.pricing || {},
      specializations: currentUser?.specializations || [],
      available: currentUser?.available ?? true,
      aadhaarLink: currentUser?.documents?.aadhaarCard || "", // Ensure Aadhaar link is set
      photoUrl: currentUser?.photoUrl || "",
      workSamplesLinks: currentUser?.documents?.workImages || [], // Ensure work samples are set
    },
    mode: "onBlur",
  });

  // console.log(form.defaultValues?.aadhaarLink);
  // console.log(form.defaultValues?.location);

  const handleAddSpecialization = () => {
    if (!specialization.trim()) return;

    const currentSpecializations = form.getValues("specializations") || [];
    if (!currentSpecializations.includes(specialization)) {
      form.setValue(
        "specializations",
        [...currentSpecializations, specialization],
        { shouldDirty: true }
      );
      setSpecialization("");
    }
  };

  const handleRemoveSpecialization = (item) => {
    const currentSpecializations = form.getValues("specializations") || [];
    const updatedSpecializations = currentSpecializations.filter(
      (s) => s !== item
    );
    form.setValue("specializations", updatedSpecializations, {
      shouldDirty: true,
    });
  };

  // const workSamples = form.watch("workSamplesLinks") || [];

  const handleAddWorkSample  = () => {
    if (!workSampleLink.trim()) return; // Ignore empty input
  
    const currentWorkImages = form.getValues("workSamplesLinks") || [];
    if (!currentWorkImages.includes(workSampleLink)) {
      form.setValue(
        "workSamplesLinks",
        [...currentWorkImages, workSampleLink],
        { shouldDirty: true }
      );
      setWorkSampleLink(""); // Clear input after adding
    }
  };
  
  const handleRemoveWorkSample   = (link) => {
    const currentWorkImages = form.getValues("workSamplesLinks") || [];
    const updatedWorkImages = currentWorkImages.filter((s) => s !== link);
  
    form.setValue("workSamplesLinks", updatedWorkImages, { shouldDirty: true });
  
    // If removing the current input, reset to the latest available image
    if (workSampleLink  === link) {
      setWorkSampleLink(
        updatedWorkImages.length > 0
          ? updatedWorkImages[updatedWorkImages.length - 1]
          : ""
      );
    }
  };
  // const handleServiceChange = (service, checked) => {
  //   const currentServices = form.getValues("services") || [];
  //   const currentPricing = form.getValues("pricing") || {};

  //   let updatedServices = [...currentServices];
  //   let updatedPricing = { ...currentPricing };

  //   if (checked) {
  //     if (!currentServices.includes(service)) {
  //       updatedServices.push(service);
  //       updatedPricing[service] = servicePrices[service] || 0; // Default price to 0 if not set
  //     }
  //   } else {
  //     updatedServices = updatedServices.filter((s) => s !== service);
  //     delete updatedPricing[service];
  //   }

  //   form.setValue("services", updatedServices, { shouldDirty: true });
  //   form.setValue("pricing", updatedPricing, { shouldDirty: true });
  //   setServicePrices(updatedPricing);
  // };

  // const handlePriceChange = (service, price) => {
  //   const updatedPricing = { ...servicePrices, [service]: price };

  //   setServicePrices(updatedPricing);
  //   form.setValue("pricing", updatedPricing, { shouldDirty: true });
  // };

  const handleServiceChange = (service, checked) => {
    const currentServices = form.getValues("services") || [];
    const currentPricing = form.getValues("pricing") || {};

    if (checked && !currentServices.includes(service)) {
      form.setValue("services", [...currentServices, service]);

      // Keep existing price or initialize it to 0 if it's new
      setServicePrices({
        ...servicePrices,
        [service]: currentPricing[service] ?? 0,
      });

      form.setValue("pricing", {
        ...currentPricing,
        [service]: currentPricing[service] ?? 0,
      });
    } else if (!checked && currentServices.includes(service)) {
      form.setValue(
        "services",
        currentServices.filter((s) => s !== service)
      );

      // Remove the service from pricing
      const { [service]: _, ...remainingPrices } = servicePrices;
      setServicePrices(remainingPrices);

      const { [service]: __, ...remainingFormPrices } = currentPricing;
      form.setValue("pricing", remainingFormPrices);
    }
  };

  const handlePriceChange = (service, price) => {
    const currentPricing = form.getValues("pricing") || {};

    setServicePrices({
      ...servicePrices,
      [service]: price,
    });

    form.setValue("pricing", {
      ...currentPricing,
      [service]: price,
    });
  };

  useEffect(() => {
    form.reset({
      location: currentUser?.location || "",
      description: currentUser?.description || "",
      services: currentUser?.services || [],
      pricing: currentUser?.pricing || {},
      specializations: currentUser?.specializations || [],
      available: currentUser?.available ?? true,
      aadhaarLink: currentUser?.documents?.aadhaarCard || "",
      photoUrl: currentUser?.photoUrl || "",
      workSamplesLinks: currentUser?.documents?.workImages || [],
    });
  }, [currentUser]);

  // useEffect(() => {
  //   form.reset((prevValues) => ({
  //     location: currentUser?.location || prevValues.location,
  //     description: currentUser?.description ?? prevValues.description,
  //     services: currentUser?.services ?? prevValues.services,
  //     pricing: currentUser?.pricing ?? prevValues.pricing,
  //     specializations:
  //       currentUser?.specializations ?? prevValues.specializations,
  //     available: currentUser?.available ?? prevValues.available,
  //     aadhaarLink: currentUser?.aadhaarLink ?? prevValues.aadhaarLink,
  //     workSamplesLinks:
  //       currentUser?.workSamplesLinks ?? prevValues.workSamplesLinks,
  //   }));
  // }, [currentUser]);
  async function onSubmit(values) {
    try {
      const updatedFields = {};

      // Compare top-level fields
      Object.keys(values).forEach((key) => {
        if (
          key !== "aadhaarLink" && // Aadhaar is inside documents
          key !== "workSamplesLinks" // Work images are inside documents
        ) {
          if (
            JSON.stringify(values[key]) !== JSON.stringify(currentUser[key])
          ) {
            updatedFields[key] = values[key];
          }
        }
      });

      // ✅ Handle Aadhaar, Work Images, and Specializations
      const updatedDocuments = {
        aadhaarCard: values.aadhaarLink, // ✅ Update Aadhaar
        workImages: values.workSamplesLinks, // ✅ Update work images
      };
      // console.log(aadhaarLink);

      // Check if `documents` changed
      if (
        JSON.stringify(updatedDocuments) !==
        JSON.stringify(currentUser.documents)
      ) {
        updatedFields.documents = updatedDocuments;
      }

      console.log("Updated Fields:", updatedFields);

      if (Object.keys(updatedFields).length === 0) {
        toast({
          title: "No changes detected",
          description: "You haven't made any updates.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      await updateUser(currentUser._id, updatedFields);

      // console.log(updatedUser);

      // if (updatedUser.data.status) {
      //   toast({
      //     title: "Profile updated",
      //     description: "Your profile has been updated successfully.",
      //   });
      // }

      // setCurrentUser(updatedUser.data.user);
      // localStorage.setItem("currentUser", JSON.stringify(updatedUser.data.user));
      // console.log(updatedUser);

      setShowAddService(false);
    } catch (error) {
      // toast({
      //   title: "Update failed",
      //   description: "Failed to update profile. Please try again.",
      //   variant: "destructive",
      // });
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch worker's services
  const [workerServices, setWorkerServices] = useState([]);

  useEffect(() => {
    const fetchWorkerServices = async () => {
      try {
        const response = await getWorkerServices();
        if (response.status) {
          setWorkerServices(response.services.map(service => ({
            ...service,
            id: service._id,
            prices: service.price || 0,
            responseTime: service.responseTime || 'Within 24 hours',
            active: service.active || true
          })));
        }
      } catch (error) {
        console.error('Error fetching worker services:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch services. Please try again.',
          variant: 'destructive'
        });
      }
    };
    fetchWorkerServices();
  }, []);

  const handleToggleService = (id) => {
    setWorkerServices(
      workerServices.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
    const service = workerServices.find((s) => s.id === id);
    toast({
      title: `Service ${service?.active ? "deactivated" : "activated"}`,
      description: `${service?.name} has been ${
        service?.active ? "deactivated" : "activated"
      } successfully.`,
    });
  };

  const handleDeleteService = (id) => {
    setWorkerServices(workerServices.filter((service) => service.id !== id));
    toast({
      title: "Service removed",
      description: "The service has been removed from your offerings.",
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
      prices: 600,
    };
    setWorkerServices([...workerServices, newService]);
    setShowAddService(false);
    toast({
      title: "Service added",
      description: "The new service has been added to your offerings.",
    });
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-20">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Manage Services</h1>
            <p className="text-gray-600">
              Add, edit or remove services you offer to customers
            </p>
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
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-40 bg-gray-100 flex-shrink-0">
                          <img
                            src={service?.image || "/placeholder.svg"}
                            alt={service?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {service.name}
                              </h3>
                              <p className="text-gray-600 mt-1">
                                {service.description}
                              </p>

                              <div className="flex flex-wrap gap-3 mt-3">
                                <div className="flex items-center text-sm">
                                  <Tag className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{service?.category?.name}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <IndianRupeeIcon className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{currentUser?.pricing?.[service.name] ||0}</span>
                                </div>
                                {/* <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{service.responseTime || 'Within 24 hours'}</span>
                                </div> */}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {/* <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button> */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteService(service._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div className="flex items-center justify-between">
                            {/* <div className="flex items-center space-x-2">
                              <Switch
                                id={`active-${service._id}`}
                                checked={currentUser?.services?.includes(service.name)}
                                onCheckedChange={(checked) => handleServiceChange(service.name, checked)}
                              />
                              <Label
                                htmlFor={`active-${service._id}`}
                                className="cursor-pointer"
                              >
                                {currentUser?.services?.includes(service.name) ? "Active" : "Inactive"}
                              </Label>
                            </div> */}
                            <div className="text-sm text-gray-500">
                              {currentUser?.services?.includes(service.name)
                                ? "Customers can book this service"
                                : "Service not available for booking"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {workerServices.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        You don't have any services yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setShowAddService(!showAddService)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Services
                </Button>
              </CardFooter>
            </Card>

            {showAddService && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Basic Fields */}

                  <div className="space-y-6 border border-gray-200 rounded-md p-4 mt-6">
                    <h3 className="font-medium text-lg">
                      Professional Details
                    </h3>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your service area (City, State)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your experience, skills, and services you provide..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tell customers about your experience and expertise.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <FormLabel>Services Offered & Pricing</FormLabel>
                      <div className="mt-2">
                        {services.map((service) => {
                          const isChecked = form
                            .watch("services")
                            ?.includes(service.name);
                          const price =
                            form.watch("pricing")[service.name] ??
                            currentUser?.pricing?.[service.name] ??
                            0;

                          return (
                            <div
                              key={service._id}
                              className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100"
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                <input
                                  type="checkbox"
                                  id={`service-${service._id}`}
                                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleServiceChange(
                                      service.name,
                                      e.target.checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`service-${service._id}`}
                                  className="text-sm"
                                >
                                  {service.name}
                                </label>
                              </div>

                              {isChecked && (
                                <div className="flex items-center">
                                  <span className="text-gray-500 mr-2">₹</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    className="w-24 h-8 text-sm"
                                    placeholder="Price"
                                    value={price}
                                    onChange={(e) =>
                                      handlePriceChange(
                                        service.name,
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {form.formState.errors.services && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.services.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <FormLabel>Specializations</FormLabel>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          placeholder="Add a specialization"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddSpecialization}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.watch("specializations")?.map((item, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialization(item)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {form.formState.errors.specializations && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.specializations.message}
                        </p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="available"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Available for Work</FormLabel>
                            <FormDescription>
                              Customers can book your services immediately.
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

                    <div>
                      <FormLabel>Identity Verification</FormLabel>
                      <FormDescription className="mt-1">
                        These document links are required for verification and
                        will be reviewed by our team.
                      </FormDescription>

                      <div className="space-y-4 mt-3">
                        <FormField
                          control={form.control}
                          name="aadhaarLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Aadhaar Card Link</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter URL for your Aadhaar card"
                                  {...field}
                                  defaultValue={currentUser?.documents?.aadhaarCard || ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a cloud storage link where your Aadhaar
                                card is stored.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="photoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Photo Link</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter URL for your profile photo"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a cloud storage link where your profile
                                photo is stored.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <FormLabel>Work Samples Links</FormLabel>
                          <div className="flex items-center space-x-2 mt-2">
                            <Input
                              placeholder="Add a work sample link"
                              value={workSampleLink}
                              onChange={(e) =>
                                setWorkSampleLink(e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddWorkSample}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Display added work sample links */}
                          <div className="flex flex-col gap-2 mt-3">
                            {(form.watch("workSamplesLinks") || currentUser?.documents?.workImages || []).map((link, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-100 rounded-md px-3 py-2 text-sm flex items-center justify-between"
                                >
                                  <span
                                    className="truncate flex-1 cursor-pointer"
                                    onClick={() => setWorkSampleLink(link)}
                                  >
                                    {link}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveWorkSample(link)}
                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                          </div>

                          {/* Show error messages if there are validation errors */}
                          {form.formState.errors.workSamplesLinks && (
                            <p className="text-sm font-medium text-destructive mt-2">
                              <span className="break-all">
                                {form.formState.errors.workSamplesLinks.message}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-center">
                      <Button
                        type="submit"
                        className="w-1/5"
                        disabled={loading}
                      >
                        {loading ? "Updating Services..." : "Update Service"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerManageServices;
