const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

const fixProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    // Update products without isActive or with isActive: false
    const result = await Product.updateMany(
      { $or: [{ isActive: { $exists: false } }, { isActive: false }] },
      { $set: { isActive: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount} products to isActive: true`);

    // Show all products status
    const allProducts = await Product.find({}).select('name isActive');
    console.log('\n📋 All Products Status:');
    allProducts.forEach(p => {
      console.log(`  - ${p.name}: isActive = ${p.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixProducts();
