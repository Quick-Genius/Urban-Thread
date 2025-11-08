# UrbanThread Backend API

Node.js/Express backend for UrbanThread E-commerce Platform with MVC architecture.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Customer, Seller, Admin)
- **User Management**: Profile management, password updates
- **Product Management**: CRUD operations with filtering, sorting, and search
- **Shopping Cart**: Add, update, remove items
- **Wishlist**: Save favorite products
- **Orders**: Create and track orders with status updates
- **Reviews**: Product reviews and ratings
- **Addresses**: Multiple shipping addresses management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Project Structure

```
backend/
├── controllers/        # Request handlers
├── models/            # Mongoose schemas
├── routes/            # API routes
├── middleware/        # Custom middleware (auth, etc.)
├── server.js          # Entry point
├── package.json       # Dependencies
└── .env.example       # Environment variables template
```

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/urbanthread
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

4. Start MongoDB (if running locally)

5. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)
- `PUT /api/users/password` - Update password (Protected)
- `DELETE /api/users/:id` - Delete user (Admin)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product (Seller/Admin)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/:itemId` - Remove from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Wishlist
- `GET /api/wishlist` - Get wishlist (Protected)
- `POST /api/wishlist/:productId` - Add to wishlist (Protected)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/my-orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews/:productId` - Create review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

### Addresses
- `GET /api/addresses` - Get user addresses (Protected)
- `POST /api/addresses` - Create address (Protected)
- `PUT /api/addresses/:id` - Update address (Protected)
- `DELETE /api/addresses/:id` - Delete address (Protected)

## Database Models

### User
- name, email, password, phone, role, avatar, isActive

### Product
- name, description, price, originalPrice, category, sizes, images, stock, sold, rating, numReviews, features, seller

### Order
- user, items, shippingAddress, paymentMethod, paymentDetails, subtotal, shippingCost, discount, total, status

### Cart
- user, items (product, quantity, size)

### Wishlist
- user, products

### Review
- product, user, rating, comment

### Address
- user, name, fullName, phone, addressLine1, addressLine2, city, state, pinCode, isDefault

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer <token>
```

## User Roles

- **customer**: Can browse, purchase, review products
- **seller**: Can manage their own products
- **admin**: Full access to all resources

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Success Response

```json
{
  "success": true,
  "data": {}
}
```
