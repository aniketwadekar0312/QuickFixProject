import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { featuredWorker, getWorkerReviewAndUpdate } from "../../api/workerApi";
import { useEffect, useState } from "react";

const FeaturedWorkers = () => {
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured workers
  const getWorker = async () => {
    setLoading(true);
    const res = await featuredWorker();
    console.log(res)
    if (res.status) {
      const workersWithRating = await Promise.all(
        res.workers.map(async (worker) => {
          // const ratingRes = await getWorkerReviewAndUpdate(worker._id);
          // return { ...worker, rating: ratingRes.averageRating || 0 };
        })
      );
      setFeaturedWorkers(res.workers);
    }
    setLoading(false);
  };

  useEffect(() => {
    getWorker();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Service Providers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our highest-rated service professionals who consistently
            deliver excellence.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredWorkers.length > 0 &&
              featuredWorkers.map((worker) => (
                <Card
                  key={worker._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={worker?.photoUrl}
                      alt={worker?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <div className="flex items-center text-white">
                        <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
                        <span>{worker?.rating || 0.0}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{worker.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {worker?.services.join(", ")}
                    </p>
                    <p className="text-sm mt-2">
                      {worker?.description.substring(0, 80)}...
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {worker?.location}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/workers/${worker._id}`}>View Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        )}

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
