import api from "./api";

// Bookings API functions
export const createBooking = async ( bookingData ) => {
  try {
    const response = await api.post("/v1/book", bookingData);
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

export const getUserBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
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
    },
  ];
};
