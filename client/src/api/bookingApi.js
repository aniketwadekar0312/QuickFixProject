import api from "./api";

export const intiatePayment = async (data) => {
  try {
    const response = await api.post(`/v1/create-checkout-session`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const verifyPayment = async (sessionId) => {
  try {
    const response = await api.post(`/v1/verify-payment`, sessionId);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

// Bookings API functions
export const createBooking = async ( bookingData, sessionId ) => {
  try {
    const response = await api.post(`/v1/book`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const createPaymentIntent = async (amount) => {
  try {
    const response = await api.post(`/v1/payment-intent`, amount);
    return response.data;
  } catch (error) {
    console.error("Error confirming payment:", error);
    throw error;
  }
};

export const getUserBookings = async (id) => {
  try {
    const response = await api.get(`/v1/booking/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/v1/booking/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    throw error;
  }
};

export const getBookingByCustomerId = async () => {
  try {
    const response = await api.get(`/v1/customer/bookings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error?.response?.data || error);
    // throw error;
  }
};


export const updateBookingStatus = async (id, status) => {
  try {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating booking status for id ${id}:`, error);
    throw error;
  }
};

export const getBookingReviews = async (bookingId) => {
  try {
    const response = await api.get(`/v1/reviews/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for booking ${bookingId}:`, error);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post('/v1/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getUserReviews = async () => {
  try {
    const response = await api.get('/reviews/customer');
    return response.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

// Get saved payment methods (in a real app, this would call an API)
export const getSavedPaymentMethods = async () => {
  // This is a mock implementation
  return [
    {
      id: "pm1",
      cardNumber: "**** **** **** 4242",
      cardType: "Visa",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "pm2",
      cardNumber: "**** **** **** 5555",
      cardType: "Mastercard",
      expiryDate: "08/24",
      isDefault: false,
    },
  ];
};
