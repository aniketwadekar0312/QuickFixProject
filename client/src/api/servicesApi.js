import axiosInstance from "./api";

export const addService = async (data) => {
  return await axiosInstance.post("/v1/service", data);
};

export const getService = async (query) => {
  if(query){
    return (await axiosInstance.get(`/v1/service?search=${query}`)).data;
  }else{
    return (await axiosInstance.get(`/v1/service`)).data;
  }
};

export const getServiceById = async (id) => {
  return (await axiosInstance.get(`/v1/service/${id}`)).data;
};

export const updateService = async (id, data) => {
  return await axiosInstance.put(`/v1/service/${id}`, data);
};

export const deleteService = async (id) => {
  return await axiosInstance.delete(`/v1/service/${id}`);
};
