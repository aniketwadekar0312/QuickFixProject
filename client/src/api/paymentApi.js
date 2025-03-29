import axios from './api';

// Get all payment methods for the current user
export const getPaymentMethods = async () => {
  try {
    const response = await axios.get('/v1/payment-methods');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a SetupIntent for adding a new payment method
export const createSetupIntent = async () => {
  try {
    const response = await axios.post('/v1/payment-methods/setup-intent');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Confirm and save the payment method after setup
export const confirmSetupIntent = async (setupIntentId) => {
  try {
    const response = await axios.post('/v1/payment-methods/confirm-setup', {
      setupIntentId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a payment method
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axios.delete(`/v1/payment-methods/${paymentMethodId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    const response = await axios.put(`/v1/payment-methods/${paymentMethodId}/default`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a payment intent for a booking
export const createPaymentIntent = async (bookingId) => {
  try {
    const response = await axios.post('/v1/payment-intent', { bookingId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Process payment for a booking
export const processPayment = async (bookingId, paymentMethodId) => {
  try {
    const response = await axios.post('/v1/payment/process', {
      bookingId,
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 