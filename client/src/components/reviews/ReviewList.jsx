import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockUsers } from "@/data/mockData";
import { getUsers } from "../../api/authServices";

const ReviewsList = ({ reviews, showFilters = false }) => {
  const [customers, setCustomers] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);

  const filteredReviews = ratingFilter
    ? reviews.filter((review) => review.rating === ratingFilter)
    : reviews;

  const averageRating = reviews?.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews?.filter((r) => r.rating === rating)?.length,
    percentage: reviews?.length
      ? Math.round(
          (reviews.filter((r) => r.rating === rating).length / reviews.length) *
            100
        )
      : 0,
  }));

  const getCustomers = async () => {
    try {
      const res = await getUsers();
      const customers = res.filter((user) => user.role === "customer");
      setCustomers(customers);
    } catch (error) {
      console.log("error in getCustomers", error);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getCustomers();
  }, []);

  return (
    <div>
      {showFilters && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-brand-50 text-brand-700 text-2xl font-bold rounded-lg py-2 px-4 mr-4 flex items-center">
                {averageRating}
                <Star className="h-5 w-5 ml-1 fill-brand-500 text-brand-500" />
              </div>
              <div>
                <p className="font-medium">{reviews?.length} reviews</p>
                <p className="text-sm text-gray-500">Overall rating</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ratingFilter === null
                    ? "bg-brand-100 text-brand-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setRatingFilter(null)}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                    ratingFilter === rating
                      ? "bg-brand-100 text-brand-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setRatingFilter(rating)}
                >
                  {rating} <Star className="h-3 w-3 ml-0.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center">
                <div className="w-16 flex items-center text-sm">
                  {rating} <Star className="h-3 w-3 ml-0.5" />
                </div>
                <div className="w-full mx-4 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-brand-500 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-gray-500">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredReviews?.length > 0 ? (
          filteredReviews?.map((review) => {
            return (
              <Card key={review._id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <div className="w-15 h-15 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        <img
                          className="w-12 h-12 rounded-full"
                          src={review?.customer?.photoUrl}
                          alt={review?.customer?.name}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{review?.customer?.name}</p>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {review.createdAt instanceof Date
                            ? review.createdAt.toLocaleDateString()
                            : new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
