import axiosInstance from "./api";

// User Authentication APIs
export const loginUser = async (credentials) => {
  return await axiosInstance.post("/v1/login", credentials);
};

export const registerUser = async (userData) => {
  return await axiosInstance.post("/v1/register", userData);
};

// Fetch User Profile
export const getUserProfile = async () => {
  return await axiosInstance.get("/v1/profile");
};

// Logout (Optional, can be handled in AuthContext)
export const logoutUser = async () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
};
