import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import {getReviews} from "../../api/reviewApi"

// const testimonials = [
//   {
//     id: 1,
//     name: "Priya Sharma",
//     location: "Mumbai",
//     image: "https://i.pravatar.cc/150?img=31",
//     service: "House Cleaning",
//     rating: 5,
//     testimonial:
//       "The cleaning service was exceptional! The cleaner was punctual, thorough, and incredibly professional. My home has never looked better. I've already booked my next appointment.",
//   },
//   {
//     id: 2,
//     name: "Rahul Patel",
//     location: "Delhi",
//     image: "https://i.pravatar.cc/150?img=53",
//     service: "Plumbing",
//     rating: 4,
//     testimonial:
//       "The plumber fixed my leaking faucet quickly and efficiently. He explained the issue clearly and even gave me tips to prevent future problems. Very reasonable pricing too!",
//   },
//   {
//     id: 3,
//     name: "Ananya Desai",
//     location: "Bangalore",
//     image: "https://i.pravatar.cc/150?img=42",
//     service: "Painting",
//     rating: 5,
//     testimonial:
//       "The painters transformed my home! They were detail-oriented, clean, and finished ahead of schedule. The quality of work exceeded my expectations. Highly recommend!",
//   },
//   {
//     id: 4,
//     name: "Vikram Singh",
//     location: "Hyderabad",
//     image: "https://i.pravatar.cc/150?img=60",
//     service: "Electrical Work",
//     rating: 5,
//     testimonial:
//       "Had an electrical issue that was causing frequent power trips. The electrician diagnosed and fixed the problem within an hour. Very knowledgeable and professional service.",
//   },
// ];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([])
  const visibleTestimonials = 3;

  const nextTestimonial = () => {
    if (currentIndex < testimonials.length - visibleTestimonials) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevTestimonial = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const getAllReviews = async() => {
    const res = await getReviews();
    if(res.status){
      setTestimonials(res.reviews)
    }
  };

  useEffect(()=> {getAllReviews()},[])

  return (
    <section className="py-16 bg-brand-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about our services.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.length >0 && testimonials
              .map((testimonial) => (
                <Card key={testimonial._id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial?.customer?.photoUrl}
                        alt={testimonial?.customer?.name}
                        className="h-14 w-14 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial?.customer?.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial?.customer?.email}</p>
                        <p className="text-sm text-gray-500">{testimonial?.customer?.location}</p>
                        <p className="text-sm text-brand-700">{testimonial?.booking?.service?.name || ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "fill-yellow-400 stroke-yellow-400"
                              : "stroke-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">"{testimonial?.comment}"</p>
                  </CardContent>
                </Card>
              ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              disabled={currentIndex === 0}
              aria-label="Previous testimonial"
              className="mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              disabled={currentIndex >= testimonials.length - visibleTestimonials}
              aria-label="Next testimonial"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
