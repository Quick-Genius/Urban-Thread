import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#FF3B30] rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: November 4, 2025</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-10">
          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed">
              At UrbanThread, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or make a purchase from us.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
              <Eye className="w-7 h-7 text-[#FF3B30] mr-3" />
              1. Information We Collect
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect personal information that you voluntarily provide to us when you register on the website, make a purchase, or contact us. This may include:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700 list-disc ml-6">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (credit card numbers, billing information)</li>
                  <li>Account credentials (username and password)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you visit our website, we automatically collect certain information about your device, including:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700 list-disc ml-6">
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
              <UserCheck className="w-7 h-7 text-[#FF3B30] mr-3" />
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect or receive to:
            </p>
            <ul className="space-y-3 text-gray-700 list-disc ml-6">
              <li><span className="font-semibold">Process and fulfill orders:</span> To process your transactions and deliver products to you</li>
              <li><span className="font-semibold">Communicate with you:</span> To send order confirmations, shipping updates, and respond to inquiries</li>
              <li><span className="font-semibold">Marketing communications:</span> To send promotional emails about new products and special offers (you can opt-out at any time)</li>
              <li><span className="font-semibold">Improve our services:</span> To analyze usage patterns and enhance user experience</li>
              <li><span className="font-semibold">Prevent fraud:</span> To detect and prevent fraudulent transactions and protect against security threats</li>
              <li><span className="font-semibold">Legal compliance:</span> To comply with applicable laws and regulations</li>
            </ul>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
              <Lock className="w-7 h-7 text-[#FF3B30] mr-3" />
              3. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="space-y-2 text-gray-700 list-disc ml-6 mb-4">
              <li>SSL encryption for all payment transactions</li>
              <li>Secure servers and encrypted databases</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to personal information</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              However, please note that no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-bold">We do not sell, trade, or rent your personal information to third parties.</span> We may share your information only in the following circumstances:
            </p>
            <ul className="space-y-3 text-gray-700 list-disc ml-6">
              <li><span className="font-semibold">Service providers:</span> With trusted third-party service providers who assist us in operating our website, processing payments, and delivering orders (e.g., shipping companies, payment processors)</li>
              <li><span className="font-semibold">Legal requirements:</span> When required by law or to respond to legal processes, court orders, or government requests</li>
              <li><span className="font-semibold">Business transfers:</span> In connection with a merger, acquisition, or sale of assets</li>
              <li><span className="font-semibold">With your consent:</span> When you explicitly agree to share your information with third parties</li>
            </ul>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              5. Your Privacy Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="space-y-3 text-gray-700 list-disc ml-6">
              <li><span className="font-semibold">Right to access:</span> Request a copy of the personal information we hold about you</li>
              <li><span className="font-semibold">Right to rectification:</span> Request correction of inaccurate or incomplete information</li>
              <li><span className="font-semibold">Right to erasure:</span> Request deletion of your personal data under certain circumstances</li>
              <li><span className="font-semibold">Right to restrict processing:</span> Request limitation of how we use your information</li>
              <li><span className="font-semibold">Right to data portability:</span> Request transfer of your data to another service</li>
              <li><span className="font-semibold">Right to object:</span> Object to processing of your personal information</li>
              <li><span className="font-semibold">Right to withdraw consent:</span> Withdraw consent for marketing communications at any time</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us using the information provided at the end of this policy.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. Cookies are small data files stored on your device.
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Types of Cookies We Use:</h3>
                <ul className="space-y-2 text-gray-700 list-disc ml-6">
                  <li><span className="font-semibold">Essential cookies:</span> Required for website functionality</li>
                  <li><span className="font-semibold">Performance cookies:</span> Help us understand how visitors use our site</li>
                  <li><span className="font-semibold">Functional cookies:</span> Remember your preferences and settings</li>
                  <li><span className="font-semibold">Marketing cookies:</span> Track your activity to deliver relevant advertisements</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control and manage cookies through your browser settings. Please note that disabling cookies may affect the functionality of our website.
              </p>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              7. Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our website, you consent to the transfer of your information to our facilities and service providers located around the world.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              10. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective immediately upon posting the updated policy on this page. We will update the "Last updated" date at the top of this policy. We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </div>

          <div className="border-t pt-8 bg-gray-50 -mx-8 md:-mx-12 px-8 md:px-12 py-8 -mb-8 md:-mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Email:</span> kumharnaveen902@gmail.com</p>
              <p><span className="font-semibold">Phone:</span> +91 90240 70654</p>
              <p><span className="font-semibold">Address:</span> 123 Fashion Avenue, New York, NY 10001, United States</p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-6">
              We will respond to your inquiry within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
