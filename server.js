// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User'); // Assuming you have a User model

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const productRoutes = require('./routes/product');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Menu data
const menuItems = [
  { id: 1, name: 'Rice', description: 'Steamed white rice', price: 5.99, image: 'rice.jpg' },
  { id: 2, name: 'Pasta', description: 'Creamy Alfredo pasta', price: 7.49, image: 'pasta.jpg' },
  { id: 3, name: 'Beans', description: 'Nutritious cooked beans', price: 4.99, image: 'beans.jpg' },
  { id: 4, name: 'Spaghetti', description: 'Tomato-based spaghetti', price: 6.99, image: 'spaghetti.jpg' },
  { id: 5, name: 'Noodles', description: 'Spicy stir-fried noodles', price: 5.49, image: 'noodles.jpg' },
  { id: 6, name: 'Cheese', description: 'Fresh and creamy cheese', price: 3.99, image: 'cheese.jpg' },
  { id: 7, name: 'Curry-Sauce', description: 'Savory curry sauce', price: 4.49, image: 'curry-sauce.jpg' },
  { id: 8, name: 'Stew', description: 'Rich beef stew', price: 6.49, image: 'stew.jpg' },
  { id: 9, name: 'Turkey', description: 'Juicy roasted turkey', price: 8.99, image: 'turkey.jpg' },
];

//API to test if all routes are working
app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// API route to fetch menu items
app.get('/api/menu', (req, res) => {
  console.log('GET /api/menu endpoint hit');
  res.json(menuItems);
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

// Import your routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Ensure you have set this in your .env file
  },
});

// Function to send a confirmation email
const sendConfirmationEmail = (email, token) => {
  const confirmationUrl = `${process.env.FRONTEND_URL}/confirm?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirm Your Registration',
    html: `
      <p>Hi,</p>
      <p>Thank you for registering on our platform. Please confirm your email by clicking the link below:</p>
      <a href="${confirmationUrl}">${confirmationUrl}</a>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
    } else {
      console.log('Confirmation email sent:', info.response);
    }
  });
};

// User registration route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user in the database with `confirmed` flag set to false
    const newUser = await User.create({ name, email, password, confirmed: false });

    // Generate confirmation token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the confirmation email
    sendConfirmationEmail(email, token);

    res.status(201).json({
      message: 'Registration successful. Please check your email to confirm your registration.',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Email confirmation route
app.get('/api/auth/confirm', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Find and update user confirmation status
    const user = await User.findOneAndUpdate({ email }, { confirmed: true }, { new: true });

    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user not found' });
    }

    res.status(200).json({ message: 'Email confirmed successfully!' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token', error });
  }
});

// Serve static files (e.g., images)
app.use('/images', express.static('public/images'));

// Test email route
app.get('/test-email', (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'test@example.com', // Replace with a test email
    subject: 'Test Email',
    text: 'This is a test email from your server.',
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info);
      res.status(200).send('Test email sent successfully');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
