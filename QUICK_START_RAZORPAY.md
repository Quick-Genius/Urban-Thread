# Quick Start - Razorpay Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Get Razorpay Test Keys (2 min)

1. Go to https://razorpay.com/
2. Click "Sign Up" (use your email)
3. After login, go to **Settings** → **API Keys**
4. Click "Generate Test Keys"
5. Copy both:
   - Key ID (starts with `rzp_test_`)
   - Key Secret

### Step 2: Update Backend Environment (1 min)

Open `backend/.env` and replace:

```env
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

With your actual keys:

```env
RAZORPAY_KEY_ID="rzp_test_ABC123XYZ456"
RAZORPAY_KEY_SECRET="your_actual_secret_here"
```

### Step 3: Start Your Servers (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Test Payment (1 min)

1. Open http://localhost:3000
2. Add products to cart
3. Go to checkout
4. Select "Pay Online" (Razorpay)
5. Click "Place Order"
6. Use test card: **4111 1111 1111 1111**
7. CVV: **123**, Expiry: **12/25**
8. Complete payment

✅ Done! Your payment integration is working!

## 🧪 Test Credentials

### Test Cards
- **Success**: 4111 1111 1111 1111
- **Failure**: 4111 1111 1111 1234
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI
- **Success**: success@razorpay
- **Failure**: failure@razorpay

## 🎯 What Happens During Payment?

1. User clicks "Place Order"
2. Order is created in database
3. Razorpay modal opens
4. User enters payment details
5. Payment is processed
6. Backend verifies payment
7. Order status → "paid"
8. Cart is cleared
9. User sees success message

## 🔍 Verify It's Working

Check these:
- ✅ Razorpay modal opens
- ✅ Payment completes successfully
- ✅ Order appears in dashboard
- ✅ Order status shows "paid"
- ✅ Cart is empty after payment

## 🐛 Common Issues

**Modal doesn't open?**
- Check browser console for errors
- Verify Razorpay script loaded
- Check API keys are correct

**Payment fails?**
- Use test card: 4111 1111 1111 1111
- Check backend logs
- Verify Key Secret is correct

**"Payment verification failed"?**
- Check Key Secret in .env
- Restart backend server
- Check backend console logs

## 📚 Need More Help?

- Full Setup Guide: `RAZORPAY_SETUP.md`
- Integration Details: `INTEGRATION_SUMMARY.md`
- Razorpay Docs: https://razorpay.com/docs/

## 🎉 Ready for Production?

When you're ready to go live:
1. Complete KYC in Razorpay Dashboard
2. Generate Live Mode keys
3. Update `.env` with live keys
4. Test thoroughly
5. Deploy!

---

**Note**: Never commit your `.env` file to Git! Keep your keys secure.
