import bodyParser from "body-parser";
import express from "express";
import nodemailer from "nodemailer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Construct __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'yahoo', etc.
  auth: {
    user: process.env.GMAIL_USER, // Use environment variables
    pass: process.env.GMAIL_PASS // Use environment variables
  }
});

// Routes
app.post('/send', (req, res) => {
  console.log("API Hit");

  // Extract data from req.body
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'info@utonenergia.com', // Replace with the recipient's email
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error.message);
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
