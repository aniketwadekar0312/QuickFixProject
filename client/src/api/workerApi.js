import axios from "./api";

// Get worker's bookings
export const getWorkerBookings = async () => {
  try {
    const response = await axios.get("/v1/worker/bookings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update worker's availability
export const updateWorkerAvailability = async (isAvailable) => {
  try {
    const response = await axios.put("/v1/worker/availability", { isAvailable });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update booking status (accept/reject/complete)
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axios.put(`/v1/worker/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get worker's profile
export const getWorkerProfile = async (id) => {
  try {
    const response = await axios.get(`/v1/worker/profile/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get worker's earnings
export const getWorkerEarnings = async () => {
  try {
    const response = await axios.get("/v1/worker/earnings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get worker's services
export const getWorkerServices = async () => {
  try {
    const response = await axios.get("/v1/worker/services");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new service
export const createService = async (serviceData) => {
  try {
    const response = await axios.post("/v1/worker/services", serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a service
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await axios.put(`/v1/worker/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a service
export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(`/v1/worker/services/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const getWorkerReviewAndUpdate = async (workerId) => {
  try {
    const response = await axios.get(`/v1/worker/review/${workerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const featuredWorker = async() => {
  try {
    const response = await axios.get(`/v1/worker/featured-worker`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWorkerService = async(data) => {
  try {
    const response = await axios.put(`/v1/worker/service`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkerService = async(name) => {
  try {
    const response = await axios.delete(`/v1/worker/service/${name}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}