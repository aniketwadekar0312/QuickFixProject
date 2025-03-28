import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Star, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitReview } from "@/api/bookingApi";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getBookingById } from "../../api/bookingApi";

const ReviewForm = ({ bookingId, onSuccess }) => {
  const id = bookingId; // Correcting destructuring
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Booking Details
  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      const data = await getBookingById(id);
      setBooking(data.booking);
    } catch (err) {
      setError("Failed to fetch booking details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]); // Removed fetchBooking from dependencies

  const form = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data) => {
    if (selectedRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit review to backend
      await submitReview({
        bookingId,
        rating: selectedRating,
        comment: data.comment
      });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission failed",
        description: "We couldn't submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormLabel>Your Rating</FormLabel>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                className="focus:outline-none"
                onClick={() => {
                  setSelectedRating(rating);
                  form.setValue("rating", rating);
                }}
              >
                <Star
                  className={`h-8 w-8 ${
                    rating <= selectedRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <FormField
            control={form.control}
            name="comment"
            rules={{ required: "Please provide your feedback" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience with this service..."
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;
