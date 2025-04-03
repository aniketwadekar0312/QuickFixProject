import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReviewsList from "../../components/reviews/ReviewList";
import { getWorkerProfile } from "../../api/workerApi";
import { getCustomerReviews } from "../../api/reviewApi";
import { useEffect, useState } from "react";

const WorkerReviews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [worker, setWorker] = useState([]);
  const [reviews, setReviews] = useState([])

  const getReview = async() => {
    const res = await getCustomerReviews();
    if(res.status){
      setReviews(res.reviews)
    }
  }

  const fetchWorkerByID = async () => {
    try {
      const res = await getWorkerProfile(id);
      setWorker(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getReview()
    fetchWorkerByID();
  }, [id]);

  if (!worker) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              className="mb-6 flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Card className="max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-2">Worker Not Found</h2>
                  <p className="text-gray-600 mb-4">
                    The worker you're looking for doesn't exist.
                  </p>
                  <Button onClick={() => navigate("/workers")}>
                    Browse Workers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate(`/workers/${id}`)}
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Button>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Reviews for {worker.name}
                </CardTitle>
                <p className="text-gray-500 mt-1">
                  See what customers are saying
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ReviewsList reviews={reviews} showFilters={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerReviews;
