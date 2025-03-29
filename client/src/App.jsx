import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Workers from "./pages/Workers";
import WorkerProfile from "./pages/WorkerProfile";
import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BookService from "./pages/BookingService";
import HowItWorks from "./components/home/HowItWorks";
import Layout from "./components/layout/Layout";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import CustomerPaymentMethods from "./pages/CustomerPaymentMethods";
import WorkerManageServices from "./pages/worker/WorkerManageServices";
import WorkerAccountSettings from "./pages/worker/WorkerAccountSettings";
import WorkerEarnings from "./pages/worker/WorkerEarnings";
import WorkerRegister from "./pages/WorkerRegister";
import BookingDetails from "./components/booking/BookingDetails";
import WorkerDetails from "./pages/admin/WorkerDetails";
import CustomerDetails from "./pages/admin/CustomerDetails";
import SubmitReview from "./pages/SubmitReview";
import WorkerReviews from "./pages/worker/WorkerReview";
import BookingConfirmation from "./components/booking/BookingConfirmation ";

const queryClient = new QueryClient();

const App = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, [storedUser, navigate]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/worker-register" element={<WorkerRegister />} />
            <Route path="/login" element={<Login />} />
            <Route path="/services" element={<Services />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/:id" element={<WorkerProfile />} />
            <Route path="/workers/:id/reviews" element={<WorkerReviews />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/worker/:id" element={<WorkerDetails />} />
            <Route path="/admin/customer/:id" element={<CustomerDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking/:id" element={<BookingDetails />} />
            <Route path="/booking/:id/review" element={<SubmitReview />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/how-it-works"
              element={
                <Layout>
                  <HowItWorks />
                </Layout>
              }
            />
            <Route path="/book-service/:id?" element={<BookService />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/customer/payment-methods"
              element={<CustomerPaymentMethods />}
            />
            <Route path="/worker/services" element={<WorkerManageServices />} />
            <Route
              path="/worker/settings"
              element={<WorkerAccountSettings />}
            />
            <Route path="/worker/earnings" element={<WorkerEarnings />} />
            <Route path="/return" element={<BookingConfirmation />} />
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
