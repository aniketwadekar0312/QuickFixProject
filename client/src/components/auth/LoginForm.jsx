import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateOtp } from "../../api/authServices";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [message, setMessage] = useState("");

  const defaultRole = searchParams.get("role") || "customer";

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: defaultRole,
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      await login(values.email, values.password, values.role);
      setMessage("Signing in...");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = async () => {
    const email = form.getValues("email");
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email to reset the password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setOtpLoading(true);
      const data = {
        email,
        name: email,
        OtpType: "resetPassword",
      };

      const res = await generateOtp(data);
      if (res.status) {
        toast({
          title: "Success",
          description: "OTP sent successfully. Check your email.",
        });

        setMessage("Proceed to reset password");
        navigate("/otp-verification", {
          state: { OtpType: data.OtpType, forgotUser: email },
        });
      } else {
        toast({
          title: "Failed",
          description: res.message || "Failed to generate OTP. Try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate OTP. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating OTP:", error);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="worker">Service Provider</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of account you want to create.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-end text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-brand-600 hover:underline"
              disabled={otpLoading}
            >
              {otpLoading ? "Sending OTP..." : "Forgot Password?"}
            </button>
          </p>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? message : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center text-sm">
        <p>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-brand-600 hover:underline"
          >
            Register now
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
