'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const contactDetails = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon–Sat, 9am–6pm IST' },
  { icon: Mail, label: 'Email', value: 'invest@chandannilayam.com', sub: 'Reply within 24 hours' },
  { icon: MapPin, label: 'Address', value: '42, Green Valley Estate, Mysore Road', sub: 'Bangalore – 560 026, Karnataka' },
  { icon: Clock, label: 'Office Hours', value: 'Monday – Saturday', sub: '9:00 AM – 6:00 PM IST' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', investmentBudget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/inquiries', {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        investmentInterest: 'General Inquiry',
        budgetRange: form.investmentBudget || 'N/A',
        plotSize: 'N/A',
        message: form.message || '',
      });
      setSubmitted(true);
      toast.success('Inquiry submitted! Our team will contact you within 24 hours.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#0a1f0a]">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-4">Contact Us</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-4">
            Start Your <span className="text-gradient-gold">Investment Journey</span>
          </h1>
          <p className="text-white/60 text-lg">Speak with our dedicated investment advisors today.</p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-3xl font-semibold text-[#1a1a1a] mb-6">Get in Touch</h2>
            <p className="text-[#6b6b6b] leading-relaxed mb-8">
              Our investment advisors are available to answer your questions, schedule a site visit,
              or help you choose the right investment plan for your goals.
            </p>
            <div className="space-y-5 mb-10">
              {contactDetails.map((c, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#e8e0d8]">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c8851e] to-[#e9be55] flex items-center justify-center shrink-0">
                    <c.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#c8851e] uppercase tracking-wide mb-0.5">{c.label}</div>
                    <div className="font-semibold text-[#1a1a1a] text-sm">{c.value}</div>
                    <div className="text-[#6b6b6b] text-xs">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#0a1f0a] to-[#1a4a1a] rounded-2xl p-6 text-white">
              <h3 className="font-display text-xl font-semibold mb-2">Request a Site Visit</h3>
              <p className="text-white/60 text-sm mb-4">
                Experience our plantations first-hand. We arrange guided farm tours for prospective investors
                every Saturday. Accommodation can be arranged.
              </p>
              <div className="text-[#e9be55] font-medium text-sm">Call +91 98765 43210 to book</div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div id="inquiry">
            <div className="bg-white rounded-2xl p-8 border border-[#e8e0d8] shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#c8851e]/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#c8851e]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#1a1a1a] mb-2">Inquiry Received!</h3>
                  <p className="text-[#6b6b6b] text-sm">
                    Our investment advisor will call you within 24 hours to discuss your requirements.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-semibold text-[#1a1a1a] mb-6">Investor Inquiry</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#4a4a4a] text-sm mb-1.5">Full Name *</Label>
                        <Input
                          placeholder="Your full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="border-[#e8e0d8] focus-visible:ring-[#c8851e]"
                        />
                      </div>
                      <div>
                        <Label className="text-[#4a4a4a] text-sm mb-1.5">Phone Number *</Label>
                        <Input
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="border-[#e8e0d8] focus-visible:ring-[#c8851e]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[#4a4a4a] text-sm mb-1.5">Email Address *</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border-[#e8e0d8] focus-visible:ring-[#c8851e]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#4a4a4a] text-sm mb-1.5">Investment Budget</Label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-[#e8e0d8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8851e] text-[#4a4a4a]"
                        value={form.investmentBudget}
                        onChange={(e) => setForm({ ...form, investmentBudget: e.target.value })}
                      >
                        <option value="">Select a range</option>
                        <option>₹10–25 Lakhs</option>
                        <option>₹25–50 Lakhs</option>
                        <option>₹50 Lakhs – 1 Crore</option>
                        <option>₹1 Crore+</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-[#4a4a4a] text-sm mb-1.5">Message</Label>
                      <Textarea
                        placeholder="Tell us about your investment goals or any specific questions..."
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="border-[#e8e0d8] focus-visible:ring-[#c8851e] resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#c8851e] to-[#e0a63a] hover:from-[#a96618] hover:to-[#c8851e] text-white gap-2 py-6 shadow-lg"
                    >
                      {loading ? 'Submitting...' : 'Submit Inquiry'}
                      <Send className="w-4 h-4" />
                    </Button>
                    <p className="text-[#6b6b6b] text-xs text-center">
                      By submitting, you agree to our Privacy Policy. No spam, ever.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
