const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create new order (preorder)
router.post('/', async (req, res) => {
  try {
    const { customerName, email, phone, productId, size, address, paymentMethod } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create order
    const order = new Order({
      customerName,
      email,
      phone,
      productId,
      size,
      address,
      paymentMethod
    });
    
    const savedOrder = await order.save();
    
    // Send confirmation email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Order Confirmation - SecondaryPro',
        html: `
          <h2>Thank you for your preorder!</h2>
          <p>Dear ${customerName},</p>
          <p>We've received your preorder for <strong>${product.name}</strong>.</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            <li>Product: ${product.name}</li>
            <li>Size: ${size}</li>
            <li>Price: $${product.price}</li>
            <li>Payment Method: ${paymentMethod}</li>
            <li>Order ID: ${savedOrder._id}</li>
          </ul>
          <p>We'll contact you soon to confirm your order and arrange delivery.</p>
          <p>Best regards,<br>SecondaryPro Team</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }
    
    res.status(201).json({ 
      message: 'Order placed successfully!', 
      orderId: savedOrder._id 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
