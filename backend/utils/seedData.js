const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@urbanthread.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create seller user
    const seller = await User.create({
      name: 'Seller User',
      email: 'seller@urbanthread.com',
      password: 'seller123',
      role: 'seller',
    });

    // Create customer user
    const customer = await User.create({
      name: 'John Doe',
      email: 'customer@urbanthread.com',
      password: 'customer123',
      role: 'customer',
    });

    console.log('✅ Users created');

    // Create sample products
    const products = [
      {
        name: 'Marvel Avengers Graphic Tee',
        description: 'Show your love for the Avengers with this premium graphic tee. Made with 100% cotton for maximum comfort and durability.',
        price: 899,
        originalPrice: 1299,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: [
          'https://images.unsplash.com/photo-1643387848945-da63360662f4?w=800',
          'https://images.unsplash.com/photo-1643387848945-da63360662f4?w=800',
        ],
        stock: 245,
        sold: 234,
        rating: 4.5,
        numReviews: 234,
        features: ['100% Premium Cotton', 'Vibrant Print', 'Regular Fit', 'Machine Washable'],
        seller: seller._id,
      },
      {
        name: 'Anime Collection Hoodie',
        description: 'Premium quality hoodie featuring exclusive anime designs. Perfect for casual wear.',
        price: 1499,
        originalPrice: 1999,
        category: 'men',
        sizes: ['M', 'L', 'XL', 'XXL'],
        images: [
          'https://images.unsplash.com/photo-1760509370980-d201b9bc327e?w=800',
        ],
        stock: 143,
        sold: 189,
        rating: 4.8,
        numReviews: 189,
        features: ['Premium Fabric', 'Comfortable Fit', 'Durable Print'],
        seller: seller._id,
      },
      {
        name: 'Urban Streetwear Jacket',
        description: 'Stylish streetwear jacket perfect for urban fashion enthusiasts.',
        price: 1999,
        originalPrice: 2999,
        category: 'men',
        sizes: ['S', 'M', 'L'],
        images: [
          'https://images.unsplash.com/photo-1716827172706-9f4c36b039eb?w=800',
        ],
        stock: 89,
        sold: 156,
        rating: 4.7,
        numReviews: 156,
        features: ['Water Resistant', 'Multiple Pockets', 'Premium Quality'],
        seller: seller._id,
      },
      {
        name: 'Casual Oversized Tee',
        description: 'Comfortable oversized t-shirt for a relaxed casual look.',
        price: 799,
        originalPrice: 1099,
        category: 'men',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: [
          'https://images.unsplash.com/photo-1516442443906-71605254b628?w=800',
        ],
        stock: 312,
        sold: 312,
        rating: 4.6,
        numReviews: 312,
        features: ['Oversized Fit', 'Soft Cotton', 'Breathable'],
        seller: seller._id,
      },
      {
        name: 'Women Trendy Top',
        description: 'Fashionable top for modern women. Perfect for any occasion.',
        price: 999,
        originalPrice: 1499,
        category: 'women',
        sizes: ['XS', 'S', 'M', 'L'],
        images: [
          'https://images.unsplash.com/photo-1702678839327-761d359c3c7d?w=800',
        ],
        stock: 198,
        sold: 198,
        rating: 4.4,
        numReviews: 198,
        features: ['Trendy Design', 'Comfortable Fabric', 'Easy Care'],
        seller: seller._id,
      },
      {
        name: 'Kids Playful Tee',
        description: 'Fun and colorful t-shirt for kids. Made with soft, skin-friendly fabric.',
        price: 599,
        originalPrice: 899,
        category: 'kids',
        sizes: ['4-6Y', '6-8Y', '8-10Y'],
        images: [
          'https://images.unsplash.com/photo-1759313560190-d160c3567170?w=800',
        ],
        stock: 267,
        sold: 267,
        rating: 4.9,
        numReviews: 267,
        features: ['Soft Fabric', 'Vibrant Colors', 'Durable'],
        seller: seller._id,
      },
    ];

    await Product.insertMany(products);
    console.log('✅ Products created');

    console.log('\n📊 Seed Data Summary:');
    console.log('-------------------');
    console.log('Admin: admin@urbanthread.com / admin123');
    console.log('Seller: seller@urbanthread.com / seller123');
    console.log('Customer: customer@urbanthread.com / customer123');
    console.log(`Products: ${products.length} items created`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
