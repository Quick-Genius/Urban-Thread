const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const testProductCreation = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin user found');
      process.exit(1);
    }
    console.log(`✅ Found admin: ${admin.email}`);

    // Create test product
    const testProduct = {
      name: 'Test Product ' + Date.now(),
      description: 'This is a test product created by admin',
      price: 999,
      category: 'men',
      stock: 50,
      sku: 'TEST-' + Date.now(),
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
      seller: admin._id,
      isActive: true,
    };

    console.log('\n📦 Creating test product...');
    const product = await Product.create(testProduct);
    console.log('✅ Product created successfully!');
    console.log('   ID:', product._id);
    console.log('   Name:', product.name);
    console.log('   SKU:', product.sku);
    console.log('   isActive:', product.isActive);

    // Verify it appears in public listing
    console.log('\n🔍 Checking if product appears in public listing...');
    const publicProducts = await Product.find({ isActive: true });
    const foundInPublic = publicProducts.find(p => p._id.toString() === product._id.toString());
    
    if (foundInPublic) {
      console.log('✅ Product FOUND in public listing!');
    } else {
      console.log('❌ Product NOT FOUND in public listing');
    }

    console.log(`\n📊 Total active products: ${publicProducts.length}`);
    console.log('Active products:');
    publicProducts.forEach(p => {
      console.log(`  - ${p.name} (${p.sku})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testProductCreation();
