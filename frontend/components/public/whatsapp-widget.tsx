'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, User, Mail, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    investmentInterest: 'Quarter Acre Plot (Sandalwood)',
    message: '',
  });

  const adminWhatsAppNumber = '919063016733'; // Official WhatsApp Contact

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Send inquiry to backend DB so admin also receives lead in dashboard
      await api.post('/inquiries', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        investmentInterest: formData.investmentInterest,
        budgetRange: 'Standard',
        plotSize: formData.investmentInterest,
        message: formData.message || 'Initiated via WhatsApp Lead Widget',
      }).catch((err) => {
        console.warn('Backend inquiry post fallback:', err);
      });
    } catch (error) {
      console.error('Failed to log lead:', error);
    } finally {
      setLoading(false);
    }

    // Format WhatsApp message
    const formattedMessage = 
`🌿 *CHANDHAN NILAYAM - INVESTMENT INQUIRY* 🌿

Hello Team, I would like to inquire about Sandalwood Investment opportunities.

👤 *Name:* ${formData.fullName.trim()}
📞 *Phone:* ${formData.phone.trim()}
✉️ *Email:* ${formData.email.trim()}
🌲 *Investment Interest:* ${formData.investmentInterest}
${formData.message.trim() ? `💬 *Message:* ${formData.message.trim()}\n` : ''}
Please share complete details and plot availability. Thank you!`;

    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(formattedMessage)}`;

    toast.success('Redirecting to WhatsApp Chat...');
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999999] font-sans pointer-events-auto">
      {/* 1. FLOATING WHATSAPP BUTTON */}
      {!isOpen && (
        <div className="relative group flex items-center gap-3">
          {/* Tooltip Popup Bubble */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#0B2F24] border border-[#C49A5A]/40 text-[#F7F0E4] px-4 py-2.5 rounded-full shadow-2xl cursor-pointer hover:border-[#C49A5A] transition-all duration-300 transform hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">Talk to an Expert on WhatsApp</span>
          </div>

          {/* Glowing Circular WhatsApp Trigger Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open WhatsApp Chat"
            className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-110 border-2 border-white/20"
          >
            {/* Pulsing Ripple Effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />
            
            {/* SVG WhatsApp Logo */}
            <svg 
              className="w-7 h-7 md:w-8 md:h-8 fill-current relative z-10" 
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.105 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.117 4.08 4.26-1.127zm11.393-4.996c-.302-.151-1.787-.882-2.062-.982-.276-.1-.477-.151-.678.151-.2.302-.778.982-.954 1.183-.176.201-.352.226-.653.076-.302-.151-1.275-.47-2.428-1.498-.899-.801-1.507-1.791-1.684-2.093-.176-.302-.019-.465.132-.615.136-.135.302-.352.453-.528.151-.176.201-.302.302-.503.1-.201.05-.377-.025-.528-.075-.151-.678-1.634-.929-2.237-.245-.588-.495-.508-.678-.517-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.804.377-.276.302-1.056 1.031-1.056 2.516 0 1.485 1.081 2.918 1.232 3.119.151.201 2.126 3.247 5.15 4.556.719.311 1.281.497 1.719.636.722.23 1.379.197 1.9.12.58-.086 1.787-.73 2.039-1.434.252-.704.252-1.308.176-1.434-.075-.126-.276-.226-.578-.377z" />
            </svg>
          </button>
        </div>
      )}

      {/* 2. INTERACTIVE LEAD FORM MODAL */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] md:w-[420px] rounded-3xl bg-[#07130F] border border-[#C49A5A]/40 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#0B2F24] via-[#12402B] to-[#1E5C43] p-5 text-white border-b border-[#C49A5A]/30">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-[#25D366]/20 border border-[#25D366]/60 flex items-center justify-center text-[#25D366] shrink-0">
                <MessageCircle className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#0B2F24] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#F7F0E4]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Chandhan Nilayam Support
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-[#C49A5A]" />
                </div>
                <p className="text-xs text-[#25D366] font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  Online | Ready to assist you
                </p>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-black/20 border border-white/10 text-[12px] text-[#F7F0E4]/90 leading-snug">
              👋 Welcome! Please enter your details below to instantly connect with our Sandalwood Investment Advisor on WhatsApp.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 bg-[#07130F]">
            {/* Name */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C49A5A] mb-1.5 block">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#C49A5A]/70" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#0E1E18] border border-[#C49A5A]/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#F7F0E4] placeholder-[#F7F0E4]/40 focus:outline-none focus:border-[#C49A5A] transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C49A5A] mb-1.5 block">
                WhatsApp Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#C49A5A]/70" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0E1E18] border border-[#C49A5A]/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#F7F0E4] placeholder-[#F7F0E4]/40 focus:outline-none focus:border-[#C49A5A] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C49A5A] mb-1.5 block">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#C49A5A]/70" />
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0E1E18] border border-[#C49A5A]/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#F7F0E4] placeholder-[#F7F0E4]/40 focus:outline-none focus:border-[#C49A5A] transition-colors"
                />
              </div>
            </div>

            {/* Investment Interest */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C49A5A] mb-1.5 block">
                Investment Interest
              </label>
              <select
                value={formData.investmentInterest}
                onChange={(e) => setFormData({ ...formData, investmentInterest: e.target.value })}
                className="w-full bg-[#0E1E18] border border-[#C49A5A]/30 rounded-xl py-2.5 px-3 text-xs text-[#F7F0E4] focus:outline-none focus:border-[#C49A5A] transition-colors"
              >
                <option value="Quarter Acre Plot (Sandalwood)" className="bg-[#07130F]">Quarter Acre Plot (Sandalwood)</option>
                <option value="Half Acre Plot" className="bg-[#07130F]">Half Acre Plot</option>
                <option value="1 Acre+ Luxury Estate" className="bg-[#07130F]">1 Acre+ Luxury Estate</option>
                <option value="Site Visit & Consultation" className="bg-[#07130F]">Schedule Site Visit</option>
                <option value="General Enquiry" className="bg-[#07130F]">General Enquiry</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:from-[#0E7065] hover:to-[#20BA5A] text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-white/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Initiating Chat...' : 'Start WhatsApp Chat'}
            </button>

            {/* Direct Call & Security Note */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-1 text-[11px] text-[#F7F0E4]/60">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" /> 100% Private & Secure
              </span>
              <a 
                href="tel:+919063016733" 
                className="flex items-center gap-1 text-[#C49A5A] hover:underline font-semibold"
              >
                <Phone className="w-3.5 h-3.5" /> Call Directly
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
