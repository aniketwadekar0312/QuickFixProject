import axiosInstance from "./api";

export const sendEmail = async (data) => {
  return await axiosInstance.post("/v1/send-email", data);
};

