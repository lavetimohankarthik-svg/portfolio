const express = require("express");  //Our Backend Server
const cors = require("cors");  //Allows frontend requests
const { Resend } = require("resend");  //Sends emails from the "contact-Form"
require("dotenv").config(); //Reads environment variables from ".env"

const app = express();

// CORS
app.use(cors());
app.use(express.json());

// Debug
console.log("Backend starting...");

// RESEND transporter
const resend = new Resend(process.env.RESEND_API_KEY);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ✔️");
});

// Contact route
app.post("/contact", async (req, res) => {
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






try {
    const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "mohankarthiklaveti@gmail.com",
    subject: `New Message from ${name}`,
    html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `,
});

console.log("DATA:", data);
console.log("ERROR:", error);

if (error) {
    return res.status(500).json({
        message: error.message,
    });
}

    return res.status(200).json({
        message: "Message sent successfully!",
    });

} catch (err) {
    console.error("CATCH ERROR:", err);

    return res.status(500).json({
        message: err.message,
    });
}
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
