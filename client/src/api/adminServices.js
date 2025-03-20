import axiosInstance from "./api";

export const addCategory = async (data) => {
  return await axiosInstance.post("/v1/category", data);
};

export const getCategory = async () => {
  return (await axiosInstance.get("/v1/category")).data;
};
