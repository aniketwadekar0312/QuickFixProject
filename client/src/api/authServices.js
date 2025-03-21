import axiosInstance from "./api";

// User Authentication APIs
export const loginUser = async (credentials) => {
  return await axiosInstance.post("/v1/login", credentials);
};


export const registerUser = async (userData) => {
  return await axiosInstance.post("/v1/register", userData);
};

export const getUsers = async () => {
  return (await axiosInstance.get("/v1/users")).data; // ✅ Return only .data
};

export const updateUserProfile = async (id,data) => {
  return await axiosInstance.put(`/v1/user/${id}`, data); 
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
