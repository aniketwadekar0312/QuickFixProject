import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Loader2 } from "lucide-react";
import { verifyOtp, generateOtp, registerUser } from "../../api/authServices";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/use-toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const otpType = location.state?.OtpType || "";
  const userData = location.state?.user || null;
  const userForgot = location.state?.forgotUser || null;

  const headings = {
    verifyAccount: "Verify Your Account",
    resetPassword: "Reset Your Password",
  };

  const handleOtpChange = (value) => {
    setOtp(value.replace(/\D/g, "")); // Keep only numeric values
  };

  const handleSendOtp = async () => {
    // Determine email and name based on otpType
    const email =
      otpType === "resetPassword" ? currentUser?.email : userData?.email;
    const name =
      otpType === "resetPassword" ? currentUser?.name : userData?.name;
    if (!email) {
      return toast({
        title: "Error",
        description: "User email is missing. Please try again.",
        variant: "destructive",
      });
    }

    try {
      setOtp("");
      const data = { email, name, OtpType: otpType };
      const res = await generateOtp(data);

      if (res.status) {
        toast({ title: "Success", description: "OTP sent successfully." });
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to generate OTP. Please try again.",
        variant: "destructive",
      });
      console.error("Error in handleSendOtp:", error);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      });
    }

    setIsVerifying(true);
    try {
      let email =
        otpType === "resetPassword" ? currentUser?.email : userData?.email;

      if (userForgot !== null) {
        email = userForgot;
      }
 console.log(email)
      if (!email) {
        toast({
          title: "Error",
          description: "User email is missing. Please try again.",
          variant: "destructive",
        });
        return;
      }
      const data = { email, otp };
      const res = await verifyOtp(data);

      if (res.status) {
        toast({ title: "Success", description: "OTP verified successfully." });

        if (otpType === "verifyAccount") {
          try {
            const response = await registerUser(userData);
            if (response?.data?.status && response?.data?.newuser) {
              toast({
                title: "Registration Successful",
                description: `Welcome, ${response.data.newuser.name}!`,
              });
              navigate("/login");
            }
          } catch (error) {
            console.log(error);
            toast({
              title: "Registration Failed",
              description: error.message || `Someting went wrong`,
            });
          }
        } else if (otpType === "resetPassword") {
          navigate("/create-password", {
            state: { forgotUser: email },
          });
        } else {
          toast({
            title: "Unexpected OTP Type",
            description: "Invalid OTP verification type. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Incorrect OTP. Please try again.",
        variant: "destructive",
      });
      console.error("Error in handleVerify:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-indigo-700 to-indigo-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {headings[otpType] || "Enter OTP"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <div className="flex justify-center my-8">
          <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
            <InputOTPGroup className="gap-3">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={isVerifying || otp.length !== 6}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>

        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={handleSendOtp}
          >
            Didn't receive a code? Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
