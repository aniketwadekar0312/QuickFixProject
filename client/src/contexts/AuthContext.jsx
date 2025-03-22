import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../api/authServices";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("currentUser");
      
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          
          // Optionally verify token validity with backend
          try {
            await getUserById(storedUser._id);
          } catch (error) {
            // If token is invalid, logout
            console.error("Invalid token:", error);
            logout();
          }
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/v1/login", {
        email,
        password,
        role,
      });

      if (response.data.status && response.data && response.data.token) {
        const { user, token } = response.data;

        // Save user & token in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("token", token);

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        setCurrentUser(user);

        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${user.name}!`,
        });
        navigate(`/${role}/dashboard`);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/v1/register", userData);
      const { newuser } = response.data;
      if (response.data.status && response.data) {
        toast({
          title: "Registration successful",
          description: `Welcome, ${newuser.name}!`,
        });
        navigate(`/login`);
      }
    } catch (error) {
      setError(error.response?.data?.message);
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id,data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/v1/user/${id}`, data); // Use PUT instead of POST
      const { user } = response.data;
  
      if (response.data.status && user) {
        // Update the current user in context
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user)); // Persist user update

        toast({
          title: "Profile Updated",
          description: `Your profile has been successfully updated.`,
        });
  
      }
    } catch (error) {
      setError(error.response?.data?.message);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");

    delete axiosInstance.defaults.headers.common["Authorization"];

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // console.log(currentUser);
  const value = {
    currentUser,
    setCurrentUser,
    setError,
    toast,
    navigate,
    getUserById,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
