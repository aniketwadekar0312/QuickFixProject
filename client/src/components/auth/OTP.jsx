import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");

  const handleChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = () => {
    if (otp.length === 6) {
      alert(`OTP Submitted: ${otp}`);
    } else {
      alert("Please enter all 6 digits");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-700 to-indigo-500 text-white p-6">
      {/* OTP Container */}
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800">OTP Verification</h2>
        <p className="text-gray-600 my-2">Enter the 6-digit code sent to your email</p>

        {/* OTP Input using your existing components */}
        <InputOTP length={6} value={otp} onChange={handleChange}>
        </InputOTP>

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md mt-4 hover:bg-indigo-700 transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
