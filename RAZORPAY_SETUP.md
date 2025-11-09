# Razorpay Integration Setup Guide

## Overview
This project uses Razorpay as the primary payment gateway for processing online payments including credit/debit cards, UPI, wallets, and net banking.

## Prerequisites
- Razorpay account (Sign up at https://razorpay.com)
- Node.js and npm installed
- Backend and frontend running

## Setup Instructions

### 1. Create Razorpay Account
1. Go to https://razorpay.com and sign up
2. Complete the KYC verification (required for live mode)
3. Navigate to Settings → API Keys

### 2. Get API Keys
1. In Razorpay Dashboard, go to **Settings** → **API Keys**
2. Generate keys for Test Mode (for development)
3. You'll get:
   - **Key ID** (starts with `rzp_test_` for test mode)
   - **Key Secret** (keep this secure)

### 3. Configure Backend

Update `backend/.env` file with your Razorpay credentials:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 4. Install Dependencies

Backend dependencies are already installed. If needed:
```bash
cd backend
npm install razorpay
```

### 5. Test the Integration

#### Test Mode Cards (for development):
- **Success**: 4111 1111 1111 1111
- **Failure**: 4111 1111 1111 1234
- CVV: Any 3 digits
- Expiry: Any future date

#### Test UPI IDs:
- **Success**: success@razorpay
- **Failure**: failure@razorpay

### 6. Payment Flow

1. User selects items and proceeds to checkout
2. User selects "Pay Online" payment method
3. User clicks "Place Order"
4. Backend creates a Razorpay order
5. Frontend opens Razorpay checkout modal
6. User completes payment
7. Backend verifies payment signature
8. Order status is updated to "paid"
9. User is redirected to dashboard

### 7. Go Live

When ready for production:

1. Complete KYC verification in Razorpay Dashboard
2. Generate **Live Mode** API keys
3. Update `.env` with live keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_your_live_key_id
   RAZORPAY_KEY_SECRET=your_live_key_secret
   ```
4. Test thoroughly before going live
5. Enable required payment methods in Razorpay Dashboard

### 8. Security Best Practices

- ✅ Never expose Key Secret in frontend
- ✅ Always verify payment signature on backend
- ✅ Use HTTPS in production
- ✅ Store keys in environment variables
- ✅ Implement proper error handling
- ✅ Log all transactions for audit

### 9. Webhook Setup (Optional but Recommended)

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Save webhook secret in `.env`

### 10. Features Implemented

- ✅ Multiple payment methods (Cards, UPI, Wallets, Net Banking)
- ✅ Secure payment verification
- ✅ Order tracking with payment status
- ✅ Cash on Delivery option
- ✅ Responsive checkout UI
- ✅ Error handling and user feedback

## API Endpoints

### Create Razorpay Order
```
POST /api/payment/create-order
Body: { amount: number }
Response: { success: true, order: {...} }
```

### Verify Payment
```
POST /api/payment/verify-payment
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  orderId: string
}
Response: { success: true, message: "Payment verified" }
```

### Get Razorpay Key
```
GET /api/payment/razorpay-key
Response: { success: true, key: "rzp_test_..." }
```

## Troubleshooting

### Payment Modal Not Opening
- Check if Razorpay script is loaded
- Verify API keys are correct
- Check browser console for errors

### Payment Verification Failed
- Ensure Key Secret is correct
- Check signature generation logic
- Verify order ID matches

### Amount Mismatch
- Razorpay expects amount in paise (multiply by 100)
- Ensure currency is set to INR

## Support

- Razorpay Docs: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

## Notes

- Test mode has no transaction limits
- Live mode requires KYC completion
- Settlement happens T+2 days for live transactions
- Keep your Key Secret secure and never commit to Git
