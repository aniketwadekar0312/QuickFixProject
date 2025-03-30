import axiosInstance from "./api";

export const addCategory = async (data) => {
  return (await axiosInstance.post("/v1/category", data)).data;
};

export const getCategory = async () => {
  return (await axiosInstance.get("/v1/category")).data;
};

export const updateCategory = async (data, id) => {
  return (await axiosInstance.put(`/v1/category/${id}`, data)).data;
};

export const deleteCategory  = async (id) => {
  return (await axiosInstance.delete(`/v1/category/${id}`)).data;
};

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/v1/admin/stats");
  return response.data;
}

export const getAllBookings = async () => {
  const response = await axiosInstance.get("/v1/admin/bookings");
  return response.data;
};

export const getCustomers = async () => {
  const response = await axiosInstance.get("/v1/admin/customers");
  return response.data;
};

export const getWorkers = async () => {
  const response = await axiosInstance.get("/v1/admin/workers");
  return response.data;
};

export const updateWorkerStatus = async (data) => {
  const response = await axiosInstance.put("/v1/admin/workers", data);
  return response.data;
}
