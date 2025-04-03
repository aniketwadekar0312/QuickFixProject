import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Phone, Mail, Clock, Check } from "lucide-react";
import { getUsers } from "../api/authServices";
import { getService } from "../api/servicesApi";
import { getReviewByWorkerId } from "../api/reviewApi";

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await getService();
      // console.log(res.services);
      setServices(res.services);
    } catch (error) {
      console.log("error fetching Services", error);
    }
  };

  const reviewByWorkerId = async () => {
    const res = await getReviewByWorkerId(id);
    if (res.status) {
      setReviews(res.reviews);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchUsers = async () => {
      try {
        const res = await getUsers(); // Use API function
        const allUsers = res; // API now correctly returns an array
        // Filter only workers
        const workerUsers = allUsers.filter((user) => user.role === "worker");
        setWorkers(workerUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchServices();
    fetchUsers();
    reviewByWorkerId();
  }, []);
  const worker = workers.find((w) => w._id === id);

  if (!worker) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Worker Not Found</h1>
            <p className="mb-6">
              The service provider you're looking for doesn't exist or has been
              removed.
            </p>
            <Button asChild>
              <Link to="/workers">View All Service Providers</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleBooking = (servicename) => {
    const serviceId = services.find(
      (service) => service.name == servicename
    )?._id;
    navigate(`/book-service/${serviceId}`);
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Worker profile header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={worker.photoUrl}
                  alt={worker.name}
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{worker.name}</h1>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center mr-4">
                        <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400 mr-1" />
                        <span className="font-medium">
                          {worker.rating.toFixed(1)}
                        </span>
                        <Link
                          to={`/workers/${id}/reviews`}
                          className="ml-2 text-sm text-blue-600 hover:underline"
                        >
                          ({reviews.length} reviews)
                        </Link>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-1" />
                        <span>{worker.location}</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      {worker.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-block bg-brand-100 text-brand-800 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div
                      className={`flex items-center mb-2 ${
                        worker.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <Clock className="h-5 w-5 mr-1" />
                      <span className="font-medium">
                        {worker.available
                          ? "Available Now"
                          : "Currently Unavailable"}
                      </span>
                    </div>
                    {worker.verified && (
                      <div className="flex items-center text-green-600 mb-4">
                        <Check className="h-5 w-5 mr-1" />
                        <span className="font-medium">Verified Provider</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{worker.description}</p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex flex-wrap justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Contact Information
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{worker.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{worker.email}</span>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="services">Services & Pricing</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Services Offered
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(worker.pricing).map(([service, price]) => (
                      <div key={service} className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{service}</h4>
                          <span className="text-lg font-semibold">
                            ₹{price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {worker.services.includes(service) &&
                            "Professional service with expert care and quality materials."}
                        </p>
                        {/* Button placed in a separate div and aligned properly */}
                        <div className="mt-2 flex justify-end">
                          <Button
                            size="sm"
                            disabled={!worker.available}
                            onClick={() => handleBooking(service)}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Work Portfolio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {worker.documents.workImages.map((image, index) => (
                      <div
                        key={index}
                        className="rounded-md overflow-hidden aspect-square"
                      >
                        <img
                          src={image}
                          alt={`Work sample ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button asChild variant="outline">
                      <Link to={`/workers/${id}/reviews`}>See All Reviews</Link>
                    </Button>
                  </div>

                  {/* Preview of reviews */}
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div className="space-y-6">
                        <div key={review._id} className="border-b pb-4">
                          <div className="flex items-start mb-2">
                            <img
                              src={review?.customer?.photoUrl}
                              alt={review?.customer?.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h4 className="font-medium">
                                {review?.customer?.name}
                              </h4>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 stroke-yellow-400"
                                        : "stroke-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-500">
                                  {review.createdAt instanceof Date
                                    ? review.createdAt.toLocaleDateString()
                                    : new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review?.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No reviews yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerProfile;
