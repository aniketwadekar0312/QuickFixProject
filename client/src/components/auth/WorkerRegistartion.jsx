import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { mockServices } from "@/data/mockData";
import { getService } from "../../api/servicesApi";

const WorkerRegistrationForm = () => {
  const [services, setServices] = useState([]);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const [specialization, setSpecialization] = useState("");
  const [workSampleLink, setWorkSampleLink] = useState("");
  const [servicePrices, setServicePrices] = useState({});

  const fetchServices = async () => {
      try {
        const res = await getService();
        // console.log(res.services);
        
        setServices(res.services);
      } catch (error) {
        console.log("error fetching Services", error);
      }
    };
  
    useEffect(() => {
      fetchServices();
    }, []);

  const form = useForm({
    defaultValues: {
      name: "worker1",
      email: "worker1@gmail.com",
      phone: "9326321022",
      password: "12345678",
      confirmPassword: "12345678",
      role: "worker",
      photoUrl:"",
      location: "mumbai",
      description: "worker",
      services: [],
      pricing: {},
      specializations: [],
      available: true,
      aadhaarLink: "",
      workSamplesLinks: [],
    },
  });
  const handleAddSpecialization = () => {
    if (!specialization.trim()) return;
    
    const currentSpecializations = form.getValues("specializations") || [];
    if (!currentSpecializations.includes(specialization)) {
      form.setValue("specializations", [...currentSpecializations, specialization]);
      setSpecialization("");
    }
  };

  const handleRemoveSpecialization = (item) => {
    const currentSpecializations = form.getValues("specializations") || [];
    form.setValue(
      "specializations",
      currentSpecializations.filter(s => s !== item)
    );
  };

  const handleAddWorkSample = () => {
    if (!workSampleLink.trim()) return;
    
    const currentWorkSamples = form.getValues("workSamplesLinks") || [];
    if (!currentWorkSamples.includes(workSampleLink)) {
      form.setValue("workSamplesLinks", [...currentWorkSamples, workSampleLink]);
      setWorkSampleLink("");
    }
  };

  const handleRemoveWorkSample = (link) => {
    const currentWorkSamples = form.getValues("workSamplesLinks") || [];
    form.setValue(
      "workSamplesLinks",
      currentWorkSamples.filter(s => s !== link)
    );
  };

  const handleServiceChange = (service, checked) => {
    const currentServices = form.getValues("services") || [];
    
    const currentPricing = form.getValues("pricing") || {};
    
    if (checked && !currentServices.includes(service)) {
      form.setValue("services", [...currentServices, service]);
      // Initialize price to 0 for the new service
      setServicePrices({
        ...servicePrices,
        [service]: 0
      });
      form.setValue("pricing", {
        ...currentPricing,
        [service]: 0
      });
    } else if (!checked && currentServices.includes(service)) {
      form.setValue(
        "services",
        currentServices.filter(s => s !== service)
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
      [service]: price
    });
    form.setValue("pricing", {
      ...currentPricing,
      [service]: price
    });
  };

  async function onSubmit(values) {
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
        photoUrl: values.photoUrl,
        location: values.location,
        description: values.description,
        services: values.services,
        pricing: values.pricing || {},
        specializations: values.specializations,
        available: values.available,
        documents: {
          aadhaarCard: values.aadhaarLink,
          workImages: values.workSamplesLinks,
        },
      };
      console.log(userData);
      
      await register(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create your Service Provider Account</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Fields */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Create a password" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm your password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-6 border border-gray-200 rounded-md p-4 mt-6">
            <h3 className="font-medium text-lg">Professional Details</h3>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your service area (City, State)" {...field} />
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
                {services.map((service) => (
                  <div key={service._id} className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="checkbox" 
                        id={`service-${service._id}`}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        onChange={(e) => handleServiceChange(service.name, e.target.checked)}
                      />
                      <label htmlFor={`service-${service._id}`} className="text-sm">
                        {service.name}
                      </label>
                    </div>
                    
                    {form.watch("services")?.includes(service.name) && (
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">₹</span>
                        <Input
                          type="number"
                          min="0"
                          className="w-24 h-8 text-sm"
                          placeholder="Price"
                          value={servicePrices[service.name] || 0}
                          onChange={(e) => handlePriceChange(service.name, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    )}
                  </div>
                ))}
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
                {form.watch("specializations")?.map((item,index) => (
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
                These document links are required for verification and will be reviewed by our team.
              </FormDescription>
              
              <div className="space-y-4 mt-3">
                <FormField
                  control={form.control}
                  name="aadhaarLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Card Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter URL for your Aadhaar card" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a cloud storage link where your Aadhaar card is stored.
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
                        <Input placeholder="Enter URL for your profile photo" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a cloud storage link where your profile photo is stored.
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
                      onChange={(e) => setWorkSampleLink(e.target.value)}
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
                  
                  <div className="flex flex-col gap-2 mt-3">
                    {form.watch("workSamplesLinks")?.map((link,index) => (
                      <div 
                        key={index} 
                        className="bg-gray-100 rounded-md px-3 py-2 text-sm flex items-center justify-between"
                      >
                        <span className="truncate flex-1">{link}</span>
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
                  
                  {form.formState.errors.workSamplesLinks && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.workSamplesLinks.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register as Service Provider"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center text-sm">
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-brand-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default WorkerRegistrationForm;
