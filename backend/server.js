const express = require("express");  //Our Backend Server
const cors = require("cors");  //Allows frontend requests
const nodemailer = require("nodemailer");  //Sends emails from the "contact-Form"
require("dotenv").config(); //Reads environment variables from ".env"

const app = express();

// CORS
app.use(cors());
app.use(express.json());

// Debug
console.log("Backend starting...");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Verify login
transporter.verify((error, success) => {
    if (error) {
        console.log("Transporter Error:", error);
    } else {
        console.log("Email transporter is ready ✔️");
    }
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ✔️");
});

// Contact route
app.post("/contact", (req, res) => {
  console.log("📩 /contact hit. Body:", req.body);

  const { name, email, message } = req.body;

// Required Fields
if (!name || !email || !message) {
    return res.status(400).json({
        message: "All fields are required"
    });
}

// Email Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    return res.status(400).json({
        message: "Invalid email address"
    });
}

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `New Message from ${name}`,
    html: `
    <h2>New Portfolio Message</h2>

    <p><strong>Name:</strong> ${name}</p>

    <p><strong>Email:</strong> ${email}</p>

    <p><strong>Message:</strong></p>

    <p>${message}</p>
`
  };




  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("EMAIL SEND ERROR:", err);
      return res.status(500).json({message: "Failed to send message"});
    }

    console.log("EMAIL SENT SUCCESSFULLY:", info.response);
    return res.status(200).json({message: "Message sent successfully!"});
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
