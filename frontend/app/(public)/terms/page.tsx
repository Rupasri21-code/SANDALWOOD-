import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#F7F0E4] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#12372A] transition-colors font-medium text-[15px] mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#12372A] mb-8 font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Terms & Conditions
        </h1>
        
        <div className="prose prose-[#3B2416] max-w-none font-sans">
          <p className="text-sm text-[#8B5E3C] mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="mb-4 leading-relaxed">
            By accessing our website and participating in the Chandhan Nilayam Investments program, you agree to be bound by these Terms and Conditions. 
            These terms constitute a legally binding agreement between you ("Investor") and Chandhan Nilayam Investments ("Company") regarding your purchase of agricultural land and participation in our sandalwood plantation management.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">2. Land Registration & Ownership</h2>
          <p className="mb-4 leading-relaxed">
            Upon full payment of the investment amount, the Company will execute a registered Sale Deed in the name of the Investor for the designated plot(s). 
            The Investor becomes the absolute owner of the land. The Company acts as the exclusive agricultural manager of the plantation on the Investor's behalf for the agreed tenure (typically 12 years).
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">3. Plantation Management & Profit Sharing</h2>
          <p className="mb-4 leading-relaxed">
            The Company guarantees expert cultivation, security, and maintenance of the sandalwood trees. Upon maturity and legal harvest of the sandalwood crop, the net profits generated from the sale of the timber will be shared between the Investor and the Company as per the specific ratio outlined in your formal registered Agreement of Sale and Plantation Management Agreement. 
            The Investor is strictly prohibited from privately harvesting or felling the sandalwood trees without the Company's consent, as red sandalwood is a highly regulated commodity under government law.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">4. Investor Privileges (Clubhouse & Darshanam)</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Clubhouse & Resort Access:</strong> Investors are granted membership access to the Chandhan Nilayam Clubhouse and eco-resort facilities, subject to advance booking, availability, and specific tier-based usage limits as outlined in your welcome kit.</li>
            <li><strong>VIP Srisailam Darshanam:</strong> The Company provides complimentary VIP Srisailam Darshanam tickets. These must be requested through our portal or support team at least 15 days in advance and are subject to temple authority availability and schedules.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">5. Investment Risks & Projections</h2>
          <p className="mb-4 leading-relaxed">
            While red sandalwood has historically shown strong appreciation, all agricultural investments carry inherent risks, including natural calamities, disease, and market price fluctuations. 
            Financial projections provided on our website are estimates based on current market rates and optimal growth conditions, and do not constitute a legal guarantee of exact returns.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">6. Transfer of Ownership</h2>
          <p className="mb-4 leading-relaxed">
            The Investor may sell or transfer the land to a third party at any time. However, the subsequent buyer must agree to be bound by the existing Plantation Management Agreement with Chandhan Nilayam Investments for the remainder of the crop's lifecycle.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">7. Governing Law</h2>
          <p className="mb-4 leading-relaxed">
            These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of this agreement shall be subject to the exclusive jurisdiction of the courts located in Andhra Pradesh, India.
          </p>
        </div>
      </div>
    </div>
  );
}
