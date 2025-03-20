import { Check, Search, Calendar, Star } from "lucide-react";
import Layout from "../layout/Layout";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-12 w-12 text-brand-600" />,
      title: "Search Services",
      description:
        "Browse through our wide range of professional home services.",
    },
    {
      icon: <Calendar className="h-12 w-12 text-brand-600" />,
      title: "Book Appointment",
      description: "Select your convenient date and time for the service.",
    },
    {
      icon: <Check className="h-12 w-12 text-brand-600" />,
      title: "Get Service Delivered",
      description: "Our verified professional will arrive at your doorstep.",
    },
    {
      icon: <Star className="h-12 w-12 text-brand-600" />,
      title: "Rate & Review",
      description:
        "Share your experience and help others make informed decisions.",
    },
  ];

  return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've simplified the process of booking home services. Just follow
              these easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default HowItWorks;
