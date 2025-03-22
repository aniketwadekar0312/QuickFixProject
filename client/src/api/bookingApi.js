import api from "./api";

// Bookings API functions
export const createBooking = async ({bookingData}) => {
  try {
    // Make API call to create booking
   const response = await axios.post("/bookings", bookingData, {
  headers: { "Content-Type": "application/json" },
});
    
    // If payment method is online, create payment intent
    if (bookingData.paymentMethod === 'online') {
      // Return booking data and client secret for Stripe
      return {
        booking: response.data.booking,
        clientSecret: response.data.clientSecret
      };
    }
    
    // If COD, just return booking data
    return {
      booking: response.data.booking
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const confirmPayment = async (bookingId, paymentIntentId) => {
  try {
    const response = await api.post(`/bookings/${bookingId}/payment-confirm`, {
      paymentIntentId
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    throw error;
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
    }
  ];
};