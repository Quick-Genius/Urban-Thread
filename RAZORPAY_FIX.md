# Razorpay Payment Fix

## Issues Fixed

1. **Cross-Origin-Opener-Policy (COOP) Error** - Blocking Razorpay popup communication
2. **500 Server Error** - Payment endpoint failing
3. **CORS Configuration** - Missing Razorpay domain allowance

## Changes Made

### Frontend (Vercel)

1. **vercel.json** - Added COOP headers:
   ```json
   {
     "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
     "Cross-Origin-Embedder-Policy": "unsafe-none"
   }
   ```

2. **frontend/.env** - Switched to production API URL

### Backend (Render)

1. **backend/.env** - Added Vercel domain to ALLOWED_ORIGINS:
   ```
   ALLOWED_ORIGINS="http://localhost:3000,https://urban-thread.vercel.app"
   ```

2. **backend/server.js** - Enhanced CORS to allow Razorpay domains

3. **backend/routes/paymentRoutes.js** - Added:
   - Better error handling
   - Razorpay initialization checks
   - Detailed logging
   - Amount validation

## Deployment Steps

### 1. Deploy Backend to Render

```bash
cd backend
git add .
git commit -m "Fix Razorpay payment and CORS issues"
git push
```

**Important:** Update environment variables on Render:
- Go to your Render dashboard
- Navigate to your backend service
- Go to Environment tab
- Update `ALLOWED_ORIGINS` to include your Vercel domain:
  ```
  http://localhost:3000,https://urban-thread.vercel.app
  ```
- Save and wait for auto-redeploy

### 2. Deploy Frontend to Vercel

```bash
cd frontend
git add .
git commit -m "Fix COOP headers for Razorpay"
git push
```

Vercel will auto-deploy. The new headers will be applied.

### 3. Verify Razorpay Credentials

Make sure your backend has valid Razorpay credentials:
- `RAZORPAY_KEY_ID` - Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET` - Your Razorpay Key Secret

Check the backend logs after deployment to see:
```
✅ Razorpay initialized successfully
```

If you see an error, your credentials are missing or invalid.

## Testing

1. Go to your deployed site
2. Add items to cart
3. Go to checkout
4. Select "Pay Online" payment method
5. Click "Place Order"
6. Razorpay popup should open without COOP errors
7. Complete test payment

## Troubleshooting

### Still getting COOP errors?
- Clear browser cache
- Try incognito/private mode
- Wait 5-10 minutes for Vercel CDN to update

### Still getting 500 errors?
- Check backend logs on Render
- Verify Razorpay credentials are set
- Check if ALLOWED_ORIGINS includes your Vercel domain
- Look for "Razorpay initialized successfully" in logs

### Payment popup not opening?
- Check browser console for errors
- Verify Razorpay script is loading (check Network tab)
- Ensure you're using HTTPS (Razorpay requires secure context)

## Additional Notes

- Razorpay requires HTTPS in production
- Test mode keys work on localhost
- Live mode keys only work on HTTPS domains
- COOP header must be "same-origin-allow-popups" for payment popups to work
