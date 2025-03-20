import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-brand-800 to-brand-600 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Home Services, Delivered to Your Doorstep
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Find trusted professionals for all your home service needs.
            Book services with just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
              <Link to="/services">Book a Service</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-700">
              <Link to="/register?role=worker">Join as Service Provider</Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg p-4 flex flex-col sm:flex-row gap-2 shadow-lg">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="What service do you need?"
                className="w-full p-2 outline-none text-gray-800"
              />
            </div>
            <div className="flex-grow sm:flex-grow-0">
              <Button className="w-full bg-accent-500 hover:bg-accent-600">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white opacity-10"></div>
    </div>
  );
};

export default HeroBanner;
