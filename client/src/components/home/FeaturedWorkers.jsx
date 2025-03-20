import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { mockWorkers } from "@/data/mockData";

const FeaturedWorkers = () => {
  // Get only verified workers with high ratings
  const featuredWorkers = mockWorkers
    .filter(worker => worker.verified && worker.rating >= 4.5)
    .slice(0, 4);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Service Providers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our highest-rated service professionals who consistently deliver excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredWorkers.map(worker => (
            <Card key={worker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={worker.photoUrl}
                  alt={worker.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center text-white">
                    <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                    <span>{worker.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{worker.name}</h3>
                <p className="text-gray-500 text-sm">{worker.services.join(", ")}</p>
                <p className="text-sm mt-2">{worker.description.substring(0, 80)}...</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-sm text-gray-500">{worker.location}</span>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/workers/${worker.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/workers">View All Service Providers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkers;
