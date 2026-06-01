'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Patel',
    title: 'Entrepreneur',
    location: 'Ahmedabad, Gujarat',
    investment: '25 Lakhs – 2017',
    text: 'I was skeptical about alternative investments, but ArborVest\'s transparency completely won me over. The investor portal shows real-time plantation photos and professional reports. Seven years in, and the numbers exceed my projections.',
    rating: 5,
    image: 'https://images.pexels.com/photos/8937582/pexels-photo-8937582.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Priya Krishnamurthy',
    title: 'Senior IT Executive',
    location: 'Chennai, Tamil Nadu',
    investment: '50 Lakhs – 2019',
    text: 'The dashboard experience is remarkable — I can see photos of my plantation taken last week. The quarterly reports are detailed and honest. This is what premium investing should look like.',
    rating: 5,
    image: 'https://images.pexels.com/photos/3777567/pexels-photo-3777567.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Arjun Nair',
    title: 'Chartered Accountant',
    location: 'Kochi, Kerala',
    investment: '75 Lakhs – 2016',
    text: 'As a CA, I analyzed the financial model thoroughly before investing. Eight years later, I can confirm the ROI projections were conservative. I\'ve referred 6 colleagues and all are extremely satisfied.',
    rating: 5,
    image: 'https://images.pexels.com/photos/9363120/pexels-photo-9363120.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Sunita Rao',
    title: 'Retired Bank Manager',
    location: 'Pune, Maharashtra',
    investment: '20 Lakhs – 2018',
    text: 'After retirement, I wanted safe, long-term growth for my savings. ArborVest gave me land ownership, professional management, and peace of mind. My children will inherit a genuinely valuable asset.',
    rating: 5,
    image: 'https://images.pexels.com/photos/10041264/pexels-photo-10041264.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Dr. Vikram Singh',
    title: 'Physician & Investor',
    location: 'Delhi, NCR',
    investment: '1 Crore – 2015',
    text: 'A decade-long association with ArborVest has been outstanding. The heartwood development on my plantation exceeds expectations. The estate management service makes this completely hands-free.',
    rating: 5,
    image: 'https://images.pexels.com/photos/9623645/pexels-photo-9623645.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Ananya Mehta',
    title: 'Business Owner',
    location: 'Hyderabad, Telangana',
    investment: '40 Lakhs – 2020',
    text: 'The legal documentation process was seamless — title registered in my name, everything verified. The team\'s professionalism and responsiveness are exceptional. A truly premium investment experience.',
    rating: 5,
    image: 'https://images.pexels.com/photos/36733295/pexels-photo-36733295.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export default function TestimonialsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#0a1f0a]">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-4">Investor Stories</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6">
            Heard From Our <span className="text-gradient-gold">Investors</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Real experiences from over 850 investors who have trusted us with their wealth
            creation journey.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#c8851e] py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="font-display text-3xl font-bold text-white">850+</div>
            <div className="text-white/80 text-sm">Satisfied Investors</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white">4.9/5</div>
            <div className="text-white/80 text-sm">Average Rating</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-white">92%</div>
            <div className="text-white/80 text-sm">Repeat Investment Rate</div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-[#e8e0d8] hover:border-[#c8851e]/30 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <Quote className="w-8 h-8 text-[#e8d4b0] mb-4 shrink-0" />
              <p className="text-[#4a4a4a] text-sm leading-relaxed flex-1 mb-6 font-display italic">
                "{t.text}"
              </p>
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-[#e9be55] text-[#e9be55]" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#e8e0d8]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#c8851e]/30"
                />
                <div>
                  <div className="font-semibold text-[#1a1a1a] text-sm">{t.name}</div>
                  <div className="text-[#6b6b6b] text-xs">{t.title}</div>
                  <div className="text-[#c8851e] text-xs">{t.investment}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
