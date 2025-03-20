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
import { getCategory } from "../api/adminServices";
import { getService } from "../api/servicesApi";
import { mockServices } from "@/data/mockData";
import { Search } from "lucide-react";

const Services = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all-categories";

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const fetchCategory = async () => {
    try {
      const res = await getCategory();

      const categoryNames = res.categories.flatMap((category) => category.name);

      setCategories(categoryNames);
    } catch (error) {
      console.log("error fetching Category", error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await getService();
      setServices(res.services);
    } catch (error) {
      console.log("error fetching Services", error);
    }
  };



  useEffect(() => {
    fetchCategory();
    fetchServices();
  }, []);

  const filteredServices = services?.filter((service) => {
    const matchesSearch =
      service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service?.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all-categories" ||
      service?.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">
                      All Categories
                    </SelectItem>
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <SelectItem key={index} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="No Categories Available">
                        No Categories Available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card
                key={service._id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="inline-block bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
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

export default Services;
