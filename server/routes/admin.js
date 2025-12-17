const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

// Simple admin authentication middleware
const adminAuth = (req, res, next) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin password' });
  }
  next();
};

// Admin login
router.post('/login', adminAuth, (req, res) => {
  res.json({ message: 'Admin authenticated successfully' });
});

// Create product (admin only)
router.post('/products', adminAuth, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, sizeRange, featured } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
      sizeRange,
      featured: featured || false
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.post('/orders', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.body;
    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .populate('productId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    ).populate('productId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dashboard stats (admin only)
router.post('/stats', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    
    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      shippedOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
