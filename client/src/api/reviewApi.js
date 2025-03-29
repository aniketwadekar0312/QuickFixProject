import api from "./api";

// Get all reviews for the current customer
export const getCustomerReviews = async () => {
  try {
    const response = await api.get('/v1/reviews/customer');
    return response.data;
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    throw error;
  }
};

// Get reviews for a specific booking
export const getBookingReviews = async (bookingId) => {
  try {
    const response = await api.get(`/v1/reviews/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking reviews:', error);
    throw error;
  }
};

// Create a new review
export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/v1/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/v1/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/v1/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Get reviews for a specific worker
export const getWorkerReviews = async (workerId) => {
  try {
    const response = await api.get(`/v1/reviews/worker/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker reviews:', error);
    throw error;
  }
}; 