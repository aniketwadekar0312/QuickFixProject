import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getCategory } from "../../api/adminServices";

const ServiceCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.categories);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Fetch categories on mount

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of professional home services designed to
            make your life easier.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              to={`/services?category=${encodeURIComponent(category?.name)}`}
              key={index}
              className="block"
              aria-label={`View ${category?.name} services`}
            >
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                <div className="rounded-full bg-brand-100 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                    <img
                      src={category?.imageUrl}
                      alt={category?.name}
                      className="w-16 h-16 object-cover rounded-full "
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center">
                    {category?.name}
                  </h3>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    {category?.services.length} services
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
