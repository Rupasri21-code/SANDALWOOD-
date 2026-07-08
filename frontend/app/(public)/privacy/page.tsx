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
            Welcome to Chandan Nilayam Investments. We are committed to protecting your personal information and your right to privacy. 
            If you have any questions or concerns about our policy, or our practices with regards to your personal information, 
            please contact us.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">2. Information We Collect</h2>
          <p className="mb-4 leading-relaxed">
            We collect personal information that you voluntarily provide to us when expressing an interest in obtaining 
            information about us or our products and services. The personal information that we collect depends on the 
            context of your interactions with us, the choices you make, and the products and features you use.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="mb-4 leading-relaxed">
            We use personal information collected via our website for a variety of business purposes described below. 
            We process your personal information for these purposes in reliance on our legitimate business interests, 
            in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">4. Sharing Your Information</h2>
          <p className="mb-4 leading-relaxed">
            We only share and disclose your information in the following situations:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Compliance with Laws: We may disclose your information where we are legally required to do so.</li>
              <li>Vital Interests and Legal Rights: We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities.</li>
              <li>Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4 leading-relaxed">
            If you have questions or comments about this policy, you may email us at invest@dornalasandalwood.com.
          </p>
        </div>
      </div>
    </div>
  );
}
