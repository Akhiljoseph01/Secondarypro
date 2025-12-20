const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { startMemoryDB } = require('./db-setup');
const Product = require('./models/Product');
const sampleData = require('../sample-data.json');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'SecondaryPro API is running!' });
});

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // If no MongoDB URI is provided or it's the default localhost, use memory server
    if (!mongoUri || mongoUri.includes('localhost:27017')) {
      console.log('🔧 Starting MongoDB Memory Server for development...');
      mongoUri = await startMemoryDB();
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const seedProductsIfEmpty = async () => {
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) return;

  const products = Array.isArray(sampleData?.products) ? sampleData.products : [];
  if (products.length === 0) return;

  await Product.insertMany(products);
  console.log(`🌱 Seeded ${products.length} products into MongoDB`);
};

// Start server after database connection
connectToDatabase().then(() => {
  seedProductsIfEmpty().catch((error) => {
    console.error('❌ Failed to seed products:', error);
  });
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
