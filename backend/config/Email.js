const nodemailer = require("nodemailer");

const sendEmail = async (Name, toEmail, OTP, isforgotPassword) => {
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
            padding: 0;
            background: #f4f4f4; /* Light grey background */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            width: 100%;
            max-width: 600px;
            background: linear-gradient(to right, #4338ca, #4f46e5); /* Gradient inside the container */
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
            color: white; /* Text color for contrast */
        }
        .header {
            padding: 0px 0;
            background: white;
        }
        .logo {
            
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 1.8rem;
            font-weight: 700;
            color: #4338ca;
        }
        .content {
            margin: 10px 0;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            background: white;
            color: #4CAF50;
            padding: 10px;
            display: inline-block;
            border-radius: 5px;
        }
        .footer {
            font-size: 12px;
            color: #ddd;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">QuikFix</div>
        </div>
        <div class="content">
            <h2>Secure OTP Verification</h2>
            <p>${Name},</p>
            <p>Your OTP code is</p>
            <p class="otp-code">${OTP}</p>
            <p>This OTP is valid for 5 min</p>
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
      user: "gulsanvarma2589@gmail.com", // Your Gmail email
      pass: "ouer chxa wreq kgec", // Use the generated App Password
    },
  });

  let text = "";
  if (isforgotPassword) {
    text = `Hi, ${Name} Please Enter the belwo OTP on QuikFix website to reset your Password`;
  } else {
    text = `Hi, ${Name} Welcome to QuickFix`;
  }

  const mailOptions = {
    from: '"Quik Fix" gulsanvarma2589@gmail.com',
    to: toEmail,
    subject: "Your OTP Code for Verification",
    text: text,
    html: emailTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
