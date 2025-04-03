import react from "react";
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
import WorkerManageServices from "./pages/worker/WorkerMangeServices1";
import WorkerAccountSettings from "./pages/worker/WorkerAccountSettings";
import WorkerEarnings from "./pages/worker/WorkerEarnings";
import WorkerRegister from "./pages/WorkerRegister";
import BookingDetails from "./components/booking/BookingDetails";
import WorkerDetails from "./pages/admin/WorkerDetails";
import CustomerDetails from "./pages/admin/CustomerDetails";
import SubmitReview from "./pages/SubmitReview";
import WorkerReviews from "./pages/worker/WorkerReview";
import BookingConfirmation from "./components/booking/BookingConfirmation ";
import ProtectedRoute from "./pages/ProtectedRoute";
import Categories from "./pages/admin/Categories";
import OTP from "./components/auth/OTP";
import ForgotPassword from "./components/auth/ForgotPassword";
import {useAuth} from "./contexts/AuthContext"
const queryClient = new QueryClient();
import {Loader2} from "lucide-react"

// Create a separate component for the routes that will be wrapped by AuthProvider
const AppRoutes = () => {
  // Now useAuth can be safely used here because this component is rendered inside AuthProvider
  const { loading } = useAuth();
  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 z-50">
    <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 font-medium">Loading...</p>
    </div>
  </div>;
  };

  return (
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
        <Route path="/contact" element={<Contact />} />
        <Route path="/otp-verification" element={<OTP />} />
        <Route path="/create-password" element={<ForgotPassword />} />
        <Route
          path="/how-it-works"
          element={
            <Layout>
              <HowItWorks />
            </Layout>
          }
        />

        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />
          <Route
            path="/customer/payment-methods"
            element={<CustomerPaymentMethods />}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route
            path="/worker/services"
            element={<WorkerManageServices />}
          />
          <Route
            path="/worker/settings"
            element={<WorkerAccountSettings />}
          />
          <Route path="/worker/earnings" element={<WorkerEarnings />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/category" element={<Categories />} />
          <Route path="/admin/worker/:id" element={<WorkerDetails />} />
          <Route
            path="/admin/customer/:id"
            element={<CustomerDetails />}
          />
        </Route>

        <Route path="/about" element={<About />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/booking/:id/review" element={<SubmitReview />} />

        <Route path="/book-service/:id?" element={<BookService />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/return" element={<BookingConfirmation />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;