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

export const getUserById = async (id) => {
 const response =  await axiosInstance.get(`/v1/user/${id}`); // ✅ Return only .data
  return response.data
};

export const updateUserProfile = async (id, data) => {
    const response = await axiosInstance.put(`/v1/user/${id}`, data);
    return response.data;
};

// Fetch User Profile
export const getUserProfile = async () => {
  return await axiosInstance.get("/v1/profile");
};

// Logout (Optional, can be handled in AuthContext)
export const logoutUser = async () => {
  return await axiosInstance.post("/v1/logout")
};

export const generateOtp = async(data) => {
  const res = await axiosInstance.post("/v1/otp", data);
  return res.data
}

export const verifyOtp = async(data) => {
  const res = await axiosInstance.post("/v1/verify-otp", data);
  return res.data
}