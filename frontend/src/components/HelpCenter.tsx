import { HelpCircle, Package, CreditCard, RefreshCw, Truck, Shield, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function HelpCenter() {
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. You can pay using credit/debit cards or other available payment methods.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery.'
    },
    {
      question: 'Can I change or cancel my order?',
      answer: 'You can modify or cancel your order within 2 hours of placing it. After that, please contact our support team for assistance.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-gray-600">Find answers to your questions and get support</p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/track-order" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#FF3B30] rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Track Order</h3>
                <p className="text-sm text-gray-600">Check your order status</p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => setActiveTab('refund')}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#007AFF] rounded-lg">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Refund Policy</h3>
                <p className="text-sm text-gray-600">Learn about returns</p>
              </div>
            </div>
          </button>

          <Link to="/contact" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#34C759] rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Contact Support</h3>
                <p className="text-sm text-gray-600">Get in touch with us</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <div className="flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'faq'
                    ? 'border-[#FF3B30] text-[#FF3B30]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                FAQs
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-[#FF3B30] text-[#FF3B30]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Shipping
              </button>
              <button
                onClick={() => setActiveTab('refund')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'refund'
                    ? 'border-[#FF3B30] text-[#FF3B30]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Refund Policy
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* FAQs Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <h3 className="font-semibold text-lg mb-2 flex items-start">
                      <HelpCircle className="w-5 h-5 text-[#FF3B30] mr-2 flex-shrink-0 mt-1" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 ml-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'shipping' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <Truck className="w-5 h-5 text-[#FF3B30] mr-2" />
                      Shipping Methods
                    </h3>
                    <div className="ml-7 space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold">Standard Shipping (5-7 business days)</p>
                        <p className="text-gray-600">Free on orders over $50, otherwise $5.99</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold">Express Shipping (2-3 business days)</p>
                        <p className="text-gray-600">$12.99 flat rate</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold">Next Day Delivery</p>
                        <p className="text-gray-600">$24.99 (order before 2 PM)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Processing Time</h3>
                    <p className="text-gray-600 ml-7">
                      Orders are typically processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">International Shipping</h3>
                    <p className="text-gray-600 ml-7">
                      We ship to most countries worldwide. International shipping takes 10-15 business days. Customs fees and import duties may apply and are the responsibility of the customer.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Refund Policy Tab */}
            {activeTab === 'refund' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Refund & Return Policy</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <RefreshCw className="w-5 h-5 text-[#FF3B30] mr-2" />
                      12-Day Return Policy
                    </h3>
                    <p className="text-gray-600 ml-7 mb-3">
                      We offer a 12-day return policy from the date of delivery. Items must be unworn, unwashed, and in original condition with all tags attached.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">How to Return</h3>
                    <ol className="list-decimal ml-12 space-y-2 text-gray-600">
                      <li>Log in to your account and go to Order History</li>
                      <li>Select the order and click "Return Items"</li>
                      <li>Choose the items you want to return and reason</li>
                      <li>Print the prepaid return label</li>
                      <li>Pack items securely and attach the label</li>
                      <li>Drop off at any authorized shipping location</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <CreditCard className="w-5 h-5 text-[#FF3B30] mr-2" />
                      Refund Process
                    </h3>
                    <p className="text-gray-600 ml-7 mb-3">
                      Once we receive your return, we'll inspect the items and process your refund within 5-7 business days. Refunds are issued to the original payment method.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Non-Returnable Items</h3>
                    <ul className="list-disc ml-12 space-y-1 text-gray-600">
                      <li>Underwear and intimate apparel</li>
                      <li>Swimwear (if hygiene seal is broken)</li>
                      <li>Earrings and body jewelry</li>
                      <li>Final sale items</li>
                      <li>Gift cards</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Exchanges</h3>
                    <p className="text-gray-600 ml-7">
                      We currently don't offer direct exchanges. Please return the item for a refund and place a new order for the desired item.
                    </p>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-[#007AFF] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Quality Guarantee</h4>
                      <p className="text-sm text-gray-600">
                        If you receive a defective or damaged item, contact us within 7 days for a free return and full refund or replacement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">Our support team is here to assist you</p>
          <Link
            to="/contact"
            className="inline-block bg-[#FF3B30] text-white px-8 py-3 rounded-lg hover:bg-[#007AFF] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
