import axiosInstance from "./api";

export const addCategory = async (data) => {
  return await axiosInstance.post("/v1/category", data);
};

export const getCategory = async () => {
  return (await axiosInstance.get("/v1/category")).data;
};

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/v1/admin/stats");
  return response.data;
}

export const getAllBookings = async () => {
  const response = await axiosInstance.get("/v1/admin/bookings");
  return response.data;
}
