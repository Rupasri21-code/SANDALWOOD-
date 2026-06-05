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
            By accessing our website, you agree to be bound by these Terms and Conditions and agree that you are 
            responsible for the agreement with any applicable local laws. If you disagree with any of these terms, 
            you are prohibited from accessing this site. The materials contained in this Website are protected by 
            copyright and trade mark law.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">2. Investment Risks</h2>
          <p className="mb-4 leading-relaxed">
            All investments carry risks, including the possible loss of principal. Past performance of our plantations 
            or similar agricultural investments does not guarantee future results. Investors should carefully consider 
            their financial situation and risk tolerance before investing.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">3. Use License</h2>
          <p className="mb-4 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials on Chandan Nilayam's Website for 
            personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
            and under this license you may not:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display;</li>
              <li>attempt to reverse engineer any software contained on Chandan Nilayam's Website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">4. Limitations</h2>
          <p className="mb-4 leading-relaxed">
            Chandan Nilayam or its suppliers will not be hold accountable for any damages that will arise with the use or 
            inability to use the materials on Chandan Nilayam's Website, even if Chandan Nilayam or an authorize 
            representative of this Website has been notified, orally or written, of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-semibold text-[#12372A] mt-8 mb-4">5. Governing Law</h2>
          <p className="mb-4 leading-relaxed">
            Any claim related to Chandan Nilayam's Website shall be governed by the laws of India without regards to its 
            conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
}
