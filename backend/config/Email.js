const nodemailer = require("nodemailer");

const sendEmail = async (
  Name,
  toEmail,
  OTP,
  OtpType
) => {
  const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 4px;
            background: #f4f7fc;
            /* Light blue-gray background */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 600px;
            background: white;
            /* White background for the card */
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            padding: 20px;
        }

        .header {
            padding: 15px 0;
            background: #4338CA;
            /* Deep blue */
            border-radius: 8px 8px 0 0;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
        }

        .content {
            margin: 20px 0;
            color: #333;
            /* Darker text for readability */
        }

        .otp-code {
            font-size: 24px;
            font-weight: bold;
            background: #1e40af;
            /* Deep blue background */
            color: white;
            padding: 12px 20px;
            display: inline-block;
            border-radius: 5px;
            letter-spacing: 3px;
        }

        .footer {
            font-size: 12px;
            color: #666;
            margin-top: 20px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 15px;
                margin: 10px;
            }
        }

        @media (max-width: 480px) {
            .container {
                padding: 10px;
                margin: 5px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo">QuikFix</div>
        </div>
        <div class="content">
            <h2 style="color: #4338CA;">Secure OTP Verification</h2>
            <p style="font-size: 16px;">Hello <strong>${Name}</strong>,</p>
            <p>Your OTP code is:</p>
            <p class="otp-code">${OTP}</p>
            <p style="color: #555;">This OTP is valid for 5 minutes.</p>
            <p>Please use this code to complete your verification.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 QuikFix. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aniketwadekar0312@gmail.com", // Your Gmail email
      pass: "vjqo vewj fzoy jufg", // Use the generated App Password
    },
  });

  let text = "";
  if (OtpType === "resetPassword") {
    text = `Hi ${Name},\n\nPlease use the OTP below on the QuikFix website to reset your password:\n\nOTP: ${OTP}`;
  } else if (OtpType === "verifyAccount") {
    text = `Hi ${Name},\n\nWelcome to QuickFix! Your OTP for account verification is:\n\nOTP: ${OTP}`;
  }

  const mailOptions = {
    from: '"QuickFix" aniketwadekar0312@gmail.com',
    to: toEmail,
    subject: "Your OTP Code for Verification",
    text: text,
    html: emailTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
module.exports = sendEmail;
