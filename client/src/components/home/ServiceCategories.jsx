import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getService } from "../../api/servicesApi";
import { serviceCategories as allCategories } from "@/data/mockData"; // Import all predefined categories

const ServiceCategories = () => {
  const [serviceCategories, setServiceCategories] = useState(allCategories); // Start with all categories
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getService();
        // console.log(res);

        setServices(res.services);

        // Extract unique categories from the service list
        const fetchedCategories = [...new Set(res.services.map(service => service.category))];

        // Merge with predefined categories to ensure all are included
        const mergedCategories = [...new Set([...allCategories, ...fetchedCategories])];

        setServiceCategories(mergedCategories);
      } catch (error) {
        console.log("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []); // Runs once on mount

  // Precompute service count per category (include 0 counts)
  const categoryCounts = serviceCategories.map(category => ({
    name: category,
    count: services.filter(service => service.category === category).length || 0, // Default to 0
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of professional home services designed to make your life easier.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryCounts.map((category, index) => (
            <Link 
              to={`/services?category=${encodeURIComponent(category.name)}`} 
              key={index}
              className="block"
              aria-label={`View ${category.name} services`}
            >
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="rounded-full bg-brand-100 p-4 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    <img 
                      src={`/icons/${category.name.toLowerCase().replace(/\s+/g, "-")}.svg`} 
                      alt={`${category.name} icon`} 
                      className="w-8 h-8 object-contain" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    {category.count} services
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services">
            <button className="text-brand-600 font-semibold hover:text-brand-700 underline">
              View All Services
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
