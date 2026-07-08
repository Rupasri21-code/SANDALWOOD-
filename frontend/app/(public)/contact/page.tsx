'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Leaf, ShieldCheck, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const contactDetails = [
  { icon: Phone, label: 'Phone', value: '+91 733 733 1000', sub: 'Mon–Sat, 9am–6pm IST' },
  { icon: Mail, label: 'Email', value: 'invest@dornalasandalwood.com', sub: 'Reply within 24 hours' },
  { icon: MapPin, label: 'Office Address', value: 'Level 4, Sandalwood Tower, Jubilee Hills', sub: 'Hyderabad, Telangana – 500 033' },
  { icon: MapPin, label: 'Land Location', value: 'Dornala Mandal, Prakasam District', sub: 'Andhra Pradesh, India' },
];

const faqs = [
  {
    q: 'Can I visit the plantation in Dornala?',
    a: 'Yes, we arrange guided site visits for prospective investors every Saturday. We provide transportation from Hyderabad and guided agronomy tours on-site. Contact our team to book your slot.'
  },
  {
    q: 'How is the land ownership registered?',
    a: 'Each plot is individually surveyed and registered directly under the investor\'s name at the local sub-registrar office. You receive a registered sale deed granting 100% legal ownership.'
  },
  {
    q: 'What is the minimum investment size?',
    a: 'Our investment plots start from 0.25 acres (30 sandalwood trees) with a starting budget of ₹10 Lakhs, making it highly accessible for retail wealth seekers.'
  },
  {
    q: 'Who manages the sandalwood trees?',
    a: 'Our experienced agronomy team, led by forestry scientists, handles the complete maintenance including host-plant setup, drip irrigation, organic composting, and security.'
  }
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.interest) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/inquiries', {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        investmentInterest: form.interest,
        budgetRange: 'Select Range',
        plotSize: 'Select Size',
        message: form.message || '',
      });
      setSubmitted(true);
      toast.success('Inquiry submitted successfully! Our team will contact you shortly.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F7F0E4] min-h-screen text-[#1E1E1A] font-sans overflow-x-hidden relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden w-full h-[55vh] min-h-[400px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Forest Green Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0B2F24]/80 to-[#0B2F24]/90" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 mb-6 shadow-md border"
            style={{
              background: 'rgba(247, 240, 228, 0.85)',
              borderColor: '#C49A5A',
            }}
          >
            <Leaf className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-[10px] font-bold tracking-[2px] uppercase text-[#8B5E3C]">
              Get In Touch
            </span>
          </div>

          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
            }}
          >
            Start Your Investment Journey
          </h1>
          <p className="text-[#E6D3B3] text-base md:text-lg max-w-2xl leading-relaxed font-serif" style={{ fontFamily: "'Lora', serif" }}>
            Connect with our agronomy and wealth management experts to secure your premium sandalwood plot.
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* 2. CONTACT GRID: Forms & Details */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Col - Contact Details */}
            <div className="lg:col-span-5 text-left">
              <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">CONTACT CHANNELS</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#12372A] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Speak to Our Team
              </h2>
              <p className="text-[#2F3E2F] text-sm leading-relaxed mb-8">
                Our wealth advisors are on hand to clarify land registry details, explain agronomy practices, or schedule guided farm tours.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {contactDetails.map((detail, idx) => (
                  <div key={idx} className="bg-[#F3E8D2] border border-[#C49A5A]/30 p-5 rounded-2xl flex flex-col items-start shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 border border-[#8B5E3C]/30 flex items-center justify-center text-[#8B5E3C] mb-4">
                      <detail.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E3C] mb-1">{detail.label}</span>
                    <h4 className="text-[#12372A] text-xs font-bold leading-tight mb-0.5">{detail.value}</h4>
                    <span className="text-[#2F3E2F]/80 text-[10px]">{detail.sub}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#0B2F24] border border-[#C49A5A]/45 rounded-3xl p-6 text-white shadow-md">
                <h3 className="font-serif text-lg font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Guided Farm Inspections</h3>
                <p className="text-[#E6D3B3] text-xs leading-relaxed mb-4">
                  We schedule guided tours to our 50-acre Dornala estate every Saturday. Witness soil structures and irrigation maps.
                </p>
                <a href="tel:+917337331000" className="text-[#C49A5A] font-bold text-xs hover:underline uppercase tracking-wide">Call +91 733 733 1000 to Book</a>
              </div>
            </div>

            {/* Right Col - Contact Form */}
            <div className="lg:col-span-7" id="inquiry">
              <div className="bg-[#F3E8D2] border border-[#C49A5A]/35 rounded-[3rem] p-8 md:p-10 shadow-sm text-left">
                {submitted ? (
                  <div className="text-center py-16 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#0B2F24]/10 border border-[#0B2F24]/30 flex items-center justify-center text-[#0B2F24] mb-6 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#12372A] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Inquiry Submitted!</h3>
                    <p className="text-[#2F3E2F] text-sm max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting Chandan Nilayam. An investment advisor will contact you within 24 business hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-2xl font-bold text-[#12372A] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Send Us a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Full Name *</Label>
                          <Input
                            placeholder="Full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] focus:ring-0 rounded-xl h-11 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Phone Number *</Label>
                          <Input
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] focus:ring-0 rounded-xl h-11 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Email Address *</Label>
                        <Input
                          type="email"
                          placeholder="Your email address"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] focus:ring-0 rounded-xl h-11 text-xs"
                        />
                      </div>

                      <div>
                        <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Investment Interest *</Label>
                        <select
                          className="w-full h-11 px-3 rounded-xl border border-[#C49A5A]/30 bg-white/80 text-xs focus:outline-none focus:ring-0 text-[#2F3E2F]"
                          value={form.interest}
                          onChange={(e) => setForm({ ...form, interest: e.target.value })}
                        >
                          <option value="">Select interest type</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="0.25 Acre Plot">0.25 Acre Plot (30 Trees)</option>
                          <option value="0.5 Acre Plot">0.5 Acre Plot (60 Trees)</option>
                          <option value="1.0 Acre Plot">1.0 Acre Plot (120 Trees)</option>
                          <option value="Partnership / Institutional">Partnership / Institutional</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-[#2F3E2F] text-xs font-bold mb-1 block uppercase tracking-wide">Message</Label>
                        <Textarea
                          placeholder="Type your message here..."
                          rows={4}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="bg-white/80 border-[#C49A5A]/30 focus:border-[#C49A5A] focus:ring-0 rounded-xl text-xs resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0B2F24] hover:bg-[#12372A] text-white rounded-xl py-6 text-xs font-bold uppercase tracking-wider transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Sending...' : 'Send Message'} <Send className="w-3.5 h-3.5" />
                      </Button>

                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MAP SECTION */}
      <section className="h-[400px] w-full bg-[#E6D3B3]/40 border-y border-[#C49A5A]/30 relative flex items-center justify-center">
        {/* Placeholder Map Visual */}
        <div className="absolute inset-0 bg-cover bg-center filter grayscale opacity-45" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920")' }} />
        <div className="relative z-10 bg-[#F3E8D2] border border-[#C49A5A]/45 rounded-3xl p-8 max-w-sm text-center shadow-lg mx-6">
          <MapPin className="w-10 h-10 text-[#8B5E3C] mx-auto mb-4" />
          <h4 className="font-serif text-lg font-bold text-[#12372A] mb-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dornala Plantation Site</h4>
          <p className="text-[#2F3E2F] text-xs leading-relaxed">
            Dornala Mandal, Prakasam District, Andhra Pradesh, India.
          </p>
          <a 
            href="https://maps.google.com/?q=Dornala,+Andhra+Pradesh,+India" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-[#0B2F24] text-white text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#12372A] transition-colors"
          >
            Get Directions
          </a>
        </div>
      </section>

      {/* 4. MINI FAQ SECTION */}
      <section className="py-24 bg-[#F7F0E4]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#8B5E3C] text-xs font-bold tracking-[0.2em] uppercase block mb-3">FAQ HELPDESK</span>
            <h2 className="font-serif text-3xl font-bold text-[#12372A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-[#F3E8D2] border border-[#C49A5A]/30 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-serif text-[#12372A] font-bold text-sm md:text-base"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#8B5E3C] transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFaq === i && (
                  <div className="px-6 pb-5 text-xs md:text-sm text-[#2F3E2F] leading-relaxed border-t border-[#C49A5A]/10 pt-4 bg-[#F7F0E4]/30 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="relative py-28 bg-[#0B2F24] overflow-hidden text-center text-white">
        {/* Top curved wave */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-[0] fill-[#F7F0E4] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] rotate-180">
            <path d="M0,35 C300,105 600,15 900,105 L1200,55 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6 py-4 flex flex-col items-center">
          <span className="text-[#C49A5A] text-xs font-bold tracking-[0.2em] uppercase block mb-4">WE HAVE ANSWERS</span>
          <h2 
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Speak to Our Wealth Team
          </h2>
          <p className="text-[#E6D3B3] text-sm md:text-base leading-relaxed max-w-xl mb-10 font-sans">
            Whether you want custom quotes, group booking rates, or corporate layout details, our support line is open.
          </p>
          <a href="tel:+917337331000">
            <Button 
              size="lg"
              className="bg-[#C49A5A] hover:bg-[#8B5E3C] text-white hover:opacity-90 px-10 py-6 text-sm font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 border border-white/10 shadow-lg"
            >
              CALL +91 733 733 1000 <Phone className="w-4 h-4 fill-white" />
            </Button>
          </a>
        </div>
      </section>

    </div>
  );
}
