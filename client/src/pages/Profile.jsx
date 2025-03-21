import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WorkerRegistrationForm from "../components/auth/WorkerRegistartion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
});

const Profile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password form schema
  const passwordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
      newPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Setup profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || "",
      phone: currentUser?.phone || "",
    },
  });

  // Update form values if user data changes
  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name,
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser, profileForm]);

  // Setup password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Redirect to the appropriate dashboard based on role
  const handleBackToDashboard = () => {
    if (!currentUser) return;

    switch (currentUser.role) {
      case "customer":
        navigate("/customer/dashboard");
        break;
      case "worker":
        navigate("/worker/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

// Handle profile update
const onProfileSubmit = async (data) => {
  setIsUpdating(true);

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  } catch (error) {
    toast({
      title: "Update failed",
      description: "Failed to update profile. Please try again.",
      variant: "destructive",
    });
    console.error("Failed to update profile:", error);
  } finally {
    setIsUpdating(false);
  }
};

// Handle password update
const onPasswordSubmit = async (data) => {
  setIsChangingPassword(true);

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    });

    // Reset password form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    toast({
      title: "Update failed",
      description: "Failed to update password. Please try again.",
      variant: "destructive",
    });
    console.error("Failed to update password:", error);
  } finally {
    setIsChangingPassword(false);
  }
};

const handleDeleteAccount = () => {
  toast({
    title: "Feature not implemented",
    description: "Account deletion is not implemented in this demo.",
    variant: "destructive",
  });
};

if (!isAuthenticated || !currentUser) {
  return null; // Will redirect via useEffect
}

return (
  <Layout>
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={currentUser.photoUrl}
                        alt={currentUser.name}
                      />
                      <AvatarFallback className="text-4xl">
                        <User className="h-16 w-16" />
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" type="button">
                      Change Photo
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={currentUser.email}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={
                            currentUser.role.charAt(0).toUpperCase() +
                            currentUser.role.slice(1)
                          }
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                      <Button
                        type="button"
                        onClick={handleBackToDashboard}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        </div>

        <div className="mt-6 flex justify-between">
          <Button onClick={handleBackToDashboard} variant="outline">
            Back to Dashboard
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  </Layout>
);
};
export default Profile;
