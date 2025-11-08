const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@urbanthread.com',
      password: 'admin123456',
      role: 'admin',
      isEmailVerified: true,
      authProvider: 'local',
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', adminData.email);
      console.log('Updating role to admin...');
      
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      
      console.log('✅ Admin role updated successfully!');
    } else {
      // Create new admin user
      const admin = await User.create(adminData);
      console.log('✅ Admin user created successfully!');
      console.log('\n📧 Admin Credentials:');
      console.log('Email:', adminData.email);
      console.log('Password:', adminData.password);
      console.log('\n⚠️  Please change the password after first login!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
