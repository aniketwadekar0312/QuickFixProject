import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { getService, deleteService } from "../../api/servicesApi";
import { Pencil, Image, CircleAlert, Trash2, RefreshCw } from "lucide-react";

const AdminServiceTable = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch services
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await getService();
      if (res.status) {
        setServices(res.services);
      }
    } catch (error) {
      console.error("Error getting services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle edit service
  const handleEditService = (serviceId) => {
    navigate(`/admin/service?serviceid=${serviceId}`);
  };

  // Handle delete service
  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Service?")) return;
    
    try {
      const res = await deleteService(id);
      if (res.status) {
        toast({
          title: "Service Deleted",
          description: "The service was removed successfully!",
        });
        fetchServices(); // Correctly calling fetchServices instead of fetchCategories
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete the service",
        variant: "destructive",
      });
    }
  };

  // Image component with fallback
  const ServiceImage = ({ src, alt }) => {
    if (!src) {
      return <Image className="h-10 w-10 text-gray-400" />;
    }
    
    return (
      <img
        src={src}
        alt={alt}
        className="h-10 w-10 rounded-md object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = "none";
          e.target.nextElementSibling.style.display = "block";
        }}
      />
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Services Table */}
            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>
                    Overview of services across the platform
                  </CardDescription>
                  <Button className="mt-2"onClick={() =>  { navigate(`/admin/service`)}}>Add Service</Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchServices}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.length > 0 ? (
                      services.map((service, index) => (
                        <TableRow key={service._id || index} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <ServiceImage src={service.image} alt={service.name} />
                              <span className="font-medium">{service.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {service.category && (
                                <>
                                  <ServiceImage 
                                    src={service.category.imageUrl} 
                                    alt={service.category.name} 
                                  />
                                  <span>{service.category.name}</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditService(service._id)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteService(service._id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CircleAlert className="h-12 w-12 text-gray-400 mb-2" />
                            <h3 className="text-lg font-semibold mb-2">
                              No Services Found
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                              There are no services available at this moment.
                              {isLoading ? " Loading..." : ""}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminServiceTable;