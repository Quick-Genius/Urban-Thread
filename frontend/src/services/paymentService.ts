import api from './api';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface CreateOrderResponse {
  success: boolean;
  order: RazorpayOrder;
}

interface RazorpayKeyResponse {
  success: boolean;
  key: string;
}

const paymentService = {
  // Create Razorpay order
  createRazorpayOrder: async (amount: number): Promise<CreateOrderResponse> => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => {
    const response = await api.post('/payment/verify-payment', paymentData);
    return response.data;
  },

  // Get Razorpay key
  getRazorpayKey: async (): Promise<string> => {
    const response = await api.get<RazorpayKeyResponse>('/payment/razorpay-key');
    return response.data.key;
  },
};

export default paymentService;
