import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockWorkers, mockServices } from "@/data/mockData";
import { Search, Star, MapPin, Clock } from "lucide-react";
import { getUsers } from "../api/authServices";

const Workers = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "all-services";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedLocation, setSelectedLocation] = useState("all-locations");
  const [mockWorkers, setMockWorkers] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers(); // Use API function
        const allUsers = res; // API now correctly returns an array

        // Filter only workers
        const workerUsers = allUsers.filter((user) => user.role === "worker");

        setMockWorkers(workerUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Extract unique locations from workers
  const locations = Array.from(
    new Set(mockWorkers.map((worker) => worker.location))
  );

  // Get unique services from all workers
  const services = Array.from(
    new Set(mockWorkers.flatMap((worker) => worker.services))
  ).sort();

  const filteredWorkers = mockWorkers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService =
      selectedService === "all-services" ||
      worker.services.includes(selectedService);

    const matchesLocation =
      selectedLocation === "all-locations" ||
      worker.location === selectedLocation;

    return (
      matchesSearch && matchesService && matchesLocation
      // worker.status === "approved"
    );
  });

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Find Service Providers
          </h1>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search service providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-services">All Services</SelectItem>
                    {services.map((service, index) => (
                      <SelectItem key={index} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-locations">All Locations</SelectItem>
                    {locations.map((location, index) => (
                      <SelectItem key={index} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkers.map((worker) => (
              <Card
                key={worker._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56">
                  <img
                    src={worker.photoUrl}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full p-1">
                    <div className="flex items-center px-2 py-1">
                      <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                      <span className="text-sm font-medium">
                        {worker.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {!worker.available && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Currently Unavailable
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{worker.name}</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm capitalize">
                      {worker.location}
                    </span>
                  </div>
                  <div className="mb-4">
                    {worker.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-block bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded mr-2 mb-2"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {worker.description}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex flex-col">
                  <div className="flex justify-between items-center w-full mb-4">
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {worker.available ? "Available Now" : "Unavailable"}
                      </span>
                    </div>
                    <div className="text-brand-700 font-semibold">
                      {worker.pricing &&
                      Object.keys(worker.pricing).length > 0 ? (
                        <>₹{Math.min(...Object.values(worker.pricing))}+</>
                      ) : (
                        <>Not Available</>
                      )}
                      
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/workers/${worker._id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredWorkers.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">
                No service providers found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Workers;
