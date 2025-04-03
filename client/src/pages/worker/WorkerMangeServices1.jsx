import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { getWorkerProfile } from "../../api/workerApi";
import { getService } from "../../api/servicesApi";
import { Separator } from "../../components/ui/separator";
import { Edit, Trash2, PlusCircle, IndianRupee, Tag, Clock, IndianRupeeIcon } from "lucide-react";

const WorkerMangeServices1 = () => {
  const [workerServices, setWorkerServices] = useState([]);
  const { currentUser } = useAuth();
  const getServices = async () => {
    const worker = await getWorkerProfile(currentUser?._id);
    const services = await getService();
    const modifiedServices = services?.services.filter((s) => {
      return worker?.data?.services.includes(s?.name);
    });
    setWorkerServices(modifiedServices);
  };

  useEffect(() => {
    getServices();
  }, [currentUser?._id]);
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
                  {workerServices.map((service) => (
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
                                  <span>
                                    {currentUser?.pricing?.[service.name] || 0}
                                  </span>
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
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Services
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerMangeServices1;
