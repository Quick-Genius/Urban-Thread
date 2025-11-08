const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection String:', process.env.MONGO_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('\n✅ MongoDB Connection Successful!');
    console.log('📦 Database Name:', conn.connection.name);
    console.log('🌐 Host:', conn.connection.host);
    console.log('🔌 Port:', conn.connection.port);
    console.log('📊 Ready State:', conn.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    if (collections.length === 0) {
      console.log('   No collections found (database is empty)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testConnection();
