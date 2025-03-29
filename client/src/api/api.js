import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Backend API URL

// const token = localStorage.getItem("token");


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",

    // "Authorization": `Bearer ${token}`,

  },
  withCredentials: true
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async(error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized! Redirecting to login...");
      await axiosInstance.post("/v1/logout");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
