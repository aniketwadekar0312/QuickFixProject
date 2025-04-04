import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../hooks/use-toast";
import { updateUserProfile } from "../../api/authServices";
import * as z from "zod";
import { useState } from "react";

// ✅ Zod schema for validation
const passwordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .nonempty("New Password is required")
      .min(6, "Confirm Password must be at least 6 characters")
      .nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.newPassword, {
    message: "Passwords do not match",
    path: ["newPassword"], // Apply error to the confirm password field
  });

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const userForgot = location.state?.forgotUser || null;
  const email = userForgot?.email || currentUser?.email || "";
  const createPasswordForm = useForm({
    resolver: zodResolver(passwordSchema), // ✅ Apply Zod validation
    defaultValues: {
      password: "",
      newPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const updatedUser = await updateUserProfile(currentUser._id, data);

      if (updatedUser.status) {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        });
        createPasswordForm.reset();
        if (userForgot) {
          navigate("/login");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      toast({
        title: "failed",
        description: "Password update failed",
        variant: "destructive",
      });
      console.error("Password update failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back button */}
          <Button
            variant="ghost"
            disabled={isLoading}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate("/profile")}
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <h1 className="text-3xl font-bold mb-8">Create a New Password</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>You can create a new password</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...createPasswordForm}>
                <form
                  onSubmit={createPasswordForm.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={email}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* New Password Field */}
                    <FormField
                      control={createPasswordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="password">New Password</Label>
                          <FormControl>
                            <Input id="password" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm New Password Field */}
                    <FormField
                      control={createPasswordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="newPassword">
                            Confirm New Password
                          </Label>
                          <FormControl>
                            <Input
                              id="newPassword"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                    <Button
                      type="button"
                      disabled={isLoading}
                      onClick={() => navigate(-1)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin hidden" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
