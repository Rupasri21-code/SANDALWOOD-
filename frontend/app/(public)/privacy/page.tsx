import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F7F0E4] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#12372A] transition-colors font-medium text-[15px] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#12372A] mb-8 font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Privacy Policy
        </h1>
        
        <div className="prose prose-[#3B2416] max-w-none font-sans">
          <p className="text-sm text-[#8B5E3C] mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4 leading-relaxed">
            Welcome to Chandan Nilayam Investments ("Company," "we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy governs the manner in which we collect, use, maintain, and disclose information collected from users (each, a "User") of our website and investment portal.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">2. Information We Collect</h2>
          <p className="mb-4 leading-relaxed">
            We collect personal information that you voluntarily provide to us when expressing an interest in our sandalwood plantation plots. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Identity & Contact Data:</strong> Name, email address, phone number, and physical address for land registration purposes.</li>
            <li><strong>Financial & Investment Data:</strong> Budget preferences, plot size interests, and transaction history related to your sandalwood investments and profit-sharing agreements.</li>
            <li><strong>Lifestyle & Booking Data:</strong> Information required to coordinate complimentary Srisailam VIP Darshanam tickets and to manage exclusive Clubhouse / Resort memberships associated with your investment tier.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="mb-4 leading-relaxed">
            We use the personal information collected via our website for various professional and operational purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Land Registration & Profit Sharing:</strong> To legally register the agricultural plots in your name and maintain accurate records for the 12-year sandalwood harvest. Upon completion of the crop cycle and successful timber sale, the net profits are divided strictly on a 50:50 basis (50% to the Investor and 50% to the Company/Management). We use your financial data exclusively to execute and document this equal profit distribution.</li>
            <li><strong>Clubhouse & Amenities:</strong> To process and manage your membership access to the Chandan Nilayam luxury clubhouse, eco-resort, and wellness facilities.</li>
            <li><strong>VIP Darshanam Bookings:</strong> To accurately book and coordinate your complimentary Srisailam temple Darshanam tickets as part of your site visit or investor privileges.</li>
            <li><strong>Investor Portal Updates:</strong> To provide secure access to your digital dashboard for real-time plantation monitoring, soil reports, and financial tracking.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">4. Sharing Your Information</h2>
          <p className="mb-4 leading-relaxed">
            We strictly protect your data and only share it with third parties under the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Government Authorities:</strong> With local land registry offices and agricultural departments strictly for the legal transfer and registration of your plot.</li>
            <li><strong>Temple Authorities:</strong> With the Srisailam Temple board exclusively for the issuance of your VIP Darshanam tickets.</li>
            <li><strong>Legal & Compliance:</strong> When required by law to investigate, prevent, or take action regarding potential fraud, illegal activities, or violations of our terms.</li>
          </ul>
          <p className="mb-4 leading-relaxed font-semibold">
            We will never sell, rent, or trade your personal information to third-party marketers or advertisers under any circumstances.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">5. Data Security</h2>
          <p className="mb-4 leading-relaxed">
            We adopt industry-standard data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, investment records, and transaction data stored on our digital portal.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-4 leading-relaxed">
            If you have questions or comments about this privacy policy, your investment data, or our clubhouse and darshanam booking procedures, please email our dedicated support team at <a href="mailto:chandhannilayam@gmail.com" className="text-[#C49A5A] hover:underline">chandhannilayam@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
