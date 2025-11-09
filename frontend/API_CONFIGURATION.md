# API Configuration Guide

## Overview
All API calls in the frontend now go through a centralized configuration using environment variables. This makes it easy to switch between development and production backends.

## Environment Variables

### Development
```env
VITE_API_URL=http://localhost:5000/api
```

### Production
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the backend URL:**
   - For local development: `VITE_API_URL=http://localhost:5000/api`
   - For production: `VITE_API_URL=https://your-deployed-backend.com/api`

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## How It Works

### Centralized API Instance
All API calls use a centralized axios instance (`src/services/api.ts`) that:
- Automatically adds the base URL from environment variables
- Includes authentication tokens in requests
- Handles 401 errors (auto-logout)
- Sets proper headers

### Service Files
All service files now import and use the centralized `api` instance:

```typescript
import api from './api';

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};
```

### Updated Services
- ✅ `adminService.ts` - Admin operations
- ✅ `productService.ts` - Product operations
- ✅ `userService.ts` - User profile operations
- ✅ `reviewService.ts` - Review operations
- ✅ `uploadService.ts` - Image upload operations
- ✅ `addressService.ts` - Address management
- ✅ `cartService.ts` - Shopping cart operations
- ✅ `wishlistService.ts` - Wishlist operations
- ✅ `orderService.ts` - Order operations
- ✅ `authService.ts` - Authentication (already configured)
- ✅ `Checkout.tsx` - Checkout component

## Deployment

### Vercel (Frontend)
Add environment variable in Vercel dashboard:
- Key: `VITE_API_URL`
- Value: `https://your-backend-url.com/api`

### Render (Backend)
Make sure your backend is deployed and accessible at the URL you set in `VITE_API_URL`.

## Benefits

1. **Easy Configuration**: Change backend URL in one place (.env file)
2. **Security**: .env file is gitignored, keeping sensitive URLs private
3. **Consistency**: All API calls use the same configuration
4. **Auto-Authentication**: Tokens are automatically added to requests
5. **Error Handling**: Centralized error handling for all API calls

## Troubleshooting

### API calls failing
1. Check if backend is running
2. Verify `VITE_API_URL` in `.env` file
3. Restart the dev server after changing `.env`
4. Check browser console for CORS errors

### Environment variable not working
- Make sure the variable starts with `VITE_`
- Restart the dev server after changes
- Check if `.env` file is in the `frontend` directory

### CORS errors
- Ensure backend allows requests from your frontend URL
- Check backend CORS configuration
