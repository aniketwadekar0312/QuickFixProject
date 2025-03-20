import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/api";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post("/v1/login", { email, password, role });

      if (response.data && response.data.token) {
        const { user, token } = response.data;

        // Save user & token in localStorage        
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("token", token);
        
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        setCurrentUser(user);

        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        throw new Error("Invalid response from server");
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
      console.log(response.data);
      
      if (response.data) {
        const { newuser } = response.data;
        console.log(newuser);
        
        // Save user & token in localStorage
        localStorage.setItem("currentUser", JSON.stringify(newuser));

        setCurrentUser(newuser);
        // console.log(user.name); 
        toast({
          title: "Registration successful",
          description: `Welcome, ${newuser.name}!`,
        });

      } else {
        throw new Error("Invalid response from server");
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

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
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
