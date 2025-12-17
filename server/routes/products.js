const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, featured, page = 1, limit = 12 } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products for homepage
router.get('/featured/homepage', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, inStock: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
