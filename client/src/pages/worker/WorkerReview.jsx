import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReviewsList from "../../components/reviews/ReviewList";
import { mockWorkers } from "@/data/mockData";

// Mock reviews data (in a real app, this would come from an API)
const mockReviews = [
  {
    id: "rev1",
    customerId: "user1",
    workerId: "worker1",
    bookingId: "booking1",
    rating: 5,
    comment: "Excellent service! Very professional and completed the job quickly. Would definitely hire again for future needs.",
    createdAt: new Date(2023, 10, 15)
  },
  {
    id: "rev2",
    customerId: "user2",
    workerId: "worker1",
    bookingId: "booking2",
    rating: 4,
    comment: "Good work overall. Arrived on time and fixed the issue, though the price was a bit higher than expected.",
    createdAt: new Date(2023, 9, 22)
  },
  {
    id: "rev3",
    customerId: "user3",
    workerId: "worker1",
    bookingId: "booking3",
    rating: 5,
    comment: "Top notch service! Very knowledgeable and explained everything clearly. The work was done perfectly and they cleaned up after themselves. Highly recommend!",
    createdAt: new Date(2023, 8, 5)
  }
];

const WorkerReviews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // In a real app, we would fetch the worker's reviews from an API
  const worker = mockWorkers.find(w => w.id === id);
  const workerReviews = mockReviews.filter(r => r.workerId === id);
  
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
                  <Button onClick={() => navigate('/workers')}>
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
                <CardTitle className="text-2xl">Reviews for {worker.name}</CardTitle>
                <p className="text-gray-500 mt-1">See what customers are saying</p>
              </div>
            </CardHeader>
            <CardContent>
              <ReviewsList reviews={workerReviews} showFilters={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default WorkerReviews;