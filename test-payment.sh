#!/bin/bash

# Test script for Razorpay payment endpoint
# This tests if the backend payment endpoint is working

echo "Testing Razorpay Key Endpoint..."
curl -X GET http://localhost:5001/api/payment/razorpay-key
echo -e "\n"

echo "Testing Health Endpoint..."
curl -X GET http://localhost:5001/api/health
echo -e "\n"

echo "Note: To test create-order endpoint, you need to:"
echo "1. Login to your app"
echo "2. Open browser DevTools > Network tab"
echo "3. Look for the Authorization header in any API request"
echo "4. Copy the token and run:"
echo "   curl -X POST http://localhost:5001/api/payment/create-order \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Authorization: Bearer YOUR_TOKEN_HERE' \\"
echo "     -d '{\"amount\": 100}'"
