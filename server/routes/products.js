const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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

// Get all products
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && !Number.isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !Number.isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    if (sort === 'price_desc') sortQuery = { price: -1 };
    if (sort === 'name_asc') sortQuery = { name: 1 };
    if (sort === 'name_desc') sortQuery = { name: -1 };
    
    const products = await Product.find(query)
      .sort(sortQuery)
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

module.exports = router;
