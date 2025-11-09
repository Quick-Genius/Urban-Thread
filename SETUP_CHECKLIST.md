# Razorpay Integration Setup Checklist

## ✅ Pre-Integration (Already Done)

- [x] Install Razorpay SDK in backend
- [x] Create payment routes
- [x] Update Order model
- [x] Create payment service in frontend
- [x] Update Checkout component
- [x] Add environment variable placeholders

## 📋 Your Action Items

### 1. Get Razorpay Account & Keys

- [ ] Sign up at https://razorpay.com
- [ ] Verify your email
- [ ] Go to Settings → API Keys
- [ ] Generate Test Mode keys
- [ ] Copy Key ID (starts with `rzp_test_`)
- [ ] Copy Key Secret (keep secure!)

### 2. Configure Backend

- [ ] Open `backend/.env`
- [ ] Replace `RAZORPAY_KEY_ID="your_razorpay_key_id"` with your actual Key ID
- [ ] Replace `RAZORPAY_KEY_SECRET="your_razorpay_key_secret"` with your actual Key Secret
- [ ] Save the file

### 3. Start Servers

- [ ] Open Terminal 1
- [ ] Run: `cd backend && npm run dev`
- [ ] Verify backend starts without errors
- [ ] Open Terminal 2
- [ ] Run: `cd frontend && npm run dev`
- [ ] Verify frontend starts without errors

### 4. Test Payment Flow

- [ ] Open http://localhost:3000 in browser
- [ ] Browse products
- [ ] Add items to cart
- [ ] Go to cart
- [ ] Click "Proceed to Checkout"
- [ ] Select or add delivery address
- [ ] Select "Pay Online" payment method
- [ ] Click "Place Order"
- [ ] Verify Razorpay modal opens
- [ ] Enter test card: 4111 1111 1111 1111
- [ ] Enter CVV: 123
- [ ] Enter Expiry: 12/25
- [ ] Complete payment
- [ ] Verify success message
- [ ] Check order in dashboard
- [ ] Verify order status is "paid"
- [ ] Verify cart is empty

### 5. Test COD Flow

- [ ] Add items to cart again
- [ ] Go to checkout
- [ ] Select "Cash on Delivery"
- [ ] Click "Place Order"
- [ ] Verify order is created
- [ ] Check order in dashboard
- [ ] Verify payment status is "pending"

### 6. Test Error Scenarios

- [ ] Try payment with test failure card: 4111 1111 1111 1234
- [ ] Verify error message is shown
- [ ] Try canceling payment
- [ ] Verify order remains in pending state

### 7. Check Backend Logs

- [ ] Check backend terminal for payment logs
- [ ] Verify order creation logs
- [ ] Verify payment verification logs
- [ ] Check for any errors

### 8. Verify Database

- [ ] Check MongoDB for created orders
- [ ] Verify payment details are saved
- [ ] Verify payment status is correct

## 🚀 Going to Production

### When Ready for Live Mode:

- [ ] Complete KYC verification in Razorpay
- [ ] Wait for approval (usually 24-48 hours)
- [ ] Generate Live Mode API keys
- [ ] Update production `.env` with live keys
- [ ] Test thoroughly in staging
- [ ] Enable required payment methods in Razorpay Dashboard
- [ ] Set up webhooks (optional but recommended)
- [ ] Deploy to production
- [ ] Test with real small amount
- [ ] Monitor first few transactions

## 📚 Documentation Reference

- `QUICK_START_RAZORPAY.md` - Quick 5-minute setup guide
- `RAZORPAY_SETUP.md` - Detailed setup instructions
- `PAYMENT_FLOW.md` - Visual payment flow diagram
- `INTEGRATION_SUMMARY.md` - Technical implementation details

## 🆘 Troubleshooting

If something doesn't work:

1. Check `RAZORPAY_SETUP.md` → Troubleshooting section
2. Verify API keys are correct
3. Check browser console for errors
4. Check backend terminal for errors
5. Restart both servers
6. Clear browser cache
7. Try in incognito mode

## ✨ Success Indicators

You'll know it's working when:

- ✅ Razorpay modal opens smoothly
- ✅ Test payment completes successfully
- ✅ Order appears in dashboard immediately
- ✅ Order shows "paid" status
- ✅ Cart clears after payment
- ✅ No errors in console
- ✅ Backend logs show successful verification

## 📞 Support Resources

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

**Current Status**: Integration code is complete ✅  
**Next Step**: Get Razorpay API keys and configure backend/.env

Good luck! 🎉
