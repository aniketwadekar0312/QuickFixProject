import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  updateUserProfile,
  loginUser,
  registerUser,
  logoutUser,
} from "../api/authServices";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if(storedUser) {
          const response = await getUserById(storedUser._id);
          if(response.status && response.user) {
            setCurrentUser(response.user);
          }
        }else{
          setCurrentUser(null);
          navigate("/login");
        };
      } catch (error) {
        console.error("Authentication check failed:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password, role });

      if (response.data.status && response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${response.data.user.name}!`,
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
      const response = await registerUser(userData);
      if (response.data.status && response.data.newuser) {
        toast({
          title: "Registration successful",
          description: `Welcome, ${response.data.newuser.name}!`,
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

  const updateUser = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserProfile(id, data);
      if (response.data.status && response.data.user) {
        setCurrentUser(response.data.user);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      setError(error.response?.data?.message);
      toast({
        title: "Update Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await logoutUser();
      if (response.data.status) {
        setCurrentUser(null);
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
