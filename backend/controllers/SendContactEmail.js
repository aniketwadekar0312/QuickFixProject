const nodemailer = require("nodemailer");

const sendConatctEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const contactEmailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4f46e5;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
    }
    .message-box {
      background-color: #f5f5f5;
      border-left: 4px solid #4f46e5;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
    }
    .details {
      margin-bottom: 20px;
    }
    .details p {
      margin: 5px 0;
    }
    .details strong {
      display: inline-block;
      width: 100px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
      <p>You have received a new message from the HomeServe contact form.</p>
      
      <div class="details">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
      </div>
      
      <h3>Message:</h3>
      <div class="message-box">
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
      
      <p>Please respond to this inquiry as soon as possible.</p>
    </div>
    <div class="footer">
      <p>This email was sent from HomeServe contact form on ${new Date().toLocaleDateString()}</p>
      <p>&copy; ${new Date().getFullYear()} HomeServe. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aniketwadekar0312@gmail.com", // Your Gmail email
      pass: "vjqo vewj fzoy jufg", // Use the generated App Password
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "help.quickfix1@gmail.com",
    subject: subject,
    text: "New Contact Form Submission",
    html: contactEmailTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return res.status(200).json({status: true, message: "Email sent successfully!"});
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({status: false, message: "Error sending Email!"});
  }
};

module.exports = sendConatctEmail;
