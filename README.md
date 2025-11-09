# UrbanThread E-Commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### Authentication
- ✅ JWT-based authentication
- ✅ Google OAuth integration
- ✅ Secure password hashing
- ✅ Protected routes
- ✅ Role-based access control

### User Features
- User registration and login
- Google Sign-In
- User dashboard
- Profile management
- Order tracking
- Wishlist
- Shopping cart

### Additional Pages
- Contact Us
- Privacy Policy
- Help Center (with Refund Policy)
- Track Order

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Urban-Thread
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Set up environment variables**

**Backend (.env):**
```env
MONGO_URI="your-mongodb-connection-string"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRE="7d"
GOOGLE_CLIENT_ID="your-google-client-id"
PORT=5000
```

**Frontend (.env):**
```env
# Backend API URL - Change this for production deployment
VITE_API_URL=http://localhost:5000/api

# For production, use your deployed backend URL:
# VITE_API_URL=https://your-backend-url.com/api

VITE_GOOGLE_CLIENT_ID="your-google-client-id"
```

> **Note:** Copy `frontend/.env.example` to `frontend/.env` and update the values. The `.env` file is gitignored for security.

4. **Test MongoDB connection**
```bash
cd backend
node testConnection.js
```

5. **Start development servers**

**Option 1: Using the start script (recommended)**
```bash
./start-dev.sh
```

**Option 2: Manual start**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (seller/admin)
- `PUT /api/products/:id` - Update product (seller/admin)
- `DELETE /api/products/:id` - Delete product (seller/admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: 
6. Copy Client ID and update .env files

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed instructions.

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Google Auth Library
- bcryptjs for password hashing

## 📁 Project Structure

```
Urban-Thread/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── .env
├── INTEGRATION_GUIDE.md
└── README.md
```

## 🧪 Testing

### Test MongoDB Connection
```bash
cd backend
node testConnection.js
```

### Test Authentication
1. Register a new user at `/signup`
2. Login at `/signin`
3. Try Google Sign-In
4. Access protected routes

## 📝 Environment Variables

### Backend Required
- `MONGO_URI` - MongoDB connection string ✅ (Already configured)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time

### Backend Optional
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `PORT` - Server port (default: 5000)

### Frontend Required
- `VITE_API_URL` - Backend API URL
- `VITE_GOOGLE_CLIENT_ID` - For Google Sign-In button

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check if MONGO_URI is correct
- Verify IP whitelist in MongoDB Atlas
- Run `node testConnection.js`

### CORS Errors
- Ensure backend CORS allows frontend URL
- Check FRONTEND_URL in backend .env

### Google OAuth Not Working
- Verify Client ID is set in both .env files
- Check authorized origins in Google Console
- Ensure Google+ API is enabled

## 📚 Documentation

- [Integration Guide](./INTEGRATION_GUIDE.md) - Detailed setup instructions
- [API Documentation](./backend/API_DOCUMENTATION.md) - Complete API reference
- [Database Schema](./backend/DATABASE_SCHEMA.md) - Database structure

## 🎉 Status

✅ MongoDB Connected  
✅ JWT Authentication Implemented  
✅ Google OAuth Ready (needs credentials)  
✅ Frontend-Backend Integration Complete  
✅ User Management Working  
✅ Protected Routes Configured  

## 📞 Support

For issues or questions, please check:
1. [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
2. [Troubleshooting section](#-troubleshooting)
3. Backend logs in terminal

## 🚀 Next Steps

1. Set up Google OAuth credentials
2. Test all authentication flows
3. Add products to database
4. Implement payment gateway
5. Deploy to production

---

**Happy Coding! 🎨**
# Urban-Thread
