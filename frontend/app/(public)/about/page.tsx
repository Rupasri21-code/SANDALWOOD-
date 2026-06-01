'use client';

import Link from 'next/link';
import { ArrowRight, TreePine, Target, Eye, Heart, Users, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'Vijay Kumar',
    title: 'Founder & CEO',
    bio: '25 years in agribusiness and land investment. Former VP at a leading NBFC.',
    image: 'https://images.pexels.com/photos/9623645/pexels-photo-9623645.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Dr. Meena Sharma',
    title: 'Chief Agronomist',
    bio: 'Ph.D. in Forest Sciences. Expert in Santalum album cultivation with 18 years of field experience.',
    image: 'https://images.pexels.com/photos/36733296/pexels-photo-36733296.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Rahul Desai',
    title: 'Head of Investor Relations',
    bio: 'Former wealth manager at a top private bank. Manages relationships with 400+ investors.',
    image: 'https://images.pexels.com/photos/4965009/pexels-photo-4965009.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Sunita Rao',
    title: 'Legal & Compliance Head',
    bio: 'Expert in land acquisition law and investment compliance with 15 years of experience.',
    image: 'https://images.pexels.com/photos/10041264/pexels-photo-10041264.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const values = [
  { icon: Target, title: 'Integrity', description: 'Every land title is clear, every transaction is documented, every promise is kept.' },
  { icon: Eye, title: 'Transparency', description: 'Real-time dashboards, quarterly reports, and open communication at every step.' },
  { icon: Heart, title: 'Sustainability', description: 'We plant trees that heal the earth and generate wealth across generations.' },
  { icon: Globe, title: 'Legacy', description: 'Helping investors create lasting wealth and environmental impact simultaneously.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#0a1f0a]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f0a]/60 to-[#0a1f0a]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-4">About ArborVest</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6">
            Two Decades of Growing <span className="text-gradient-gold">Nature's Wealth</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Founded in 2004, ArborVest pioneered institutionalized sandalwood investment in India,
            combining rigorous agronomy with transparent investor relationships.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-3">Our Story</p>
            <h2 className="font-display text-4xl font-semibold text-[#1a1a1a] mb-6">
              Started with a Single Acre in Karnataka
            </h2>
            <p className="text-[#6b6b6b] text-base leading-relaxed mb-4">
              In 2004, founder Vijay Kumar recognized that the world's most valuable wood — Indian
              sandalwood — was being underutilized as an investment vehicle. With 50 acres of land
              in Hassan district and a team of three, he planted ArborVest's first sandalwood grove.
            </p>
            <p className="text-[#6b6b6b] text-base leading-relaxed mb-4">
              Over two decades, we have expanded to 2,400+ acres across Karnataka, Tamil Nadu, and
              Andhra Pradesh. More than 850 investors trust us to manage their plantation assets with
              full transparency.
            </p>
            <p className="text-[#6b6b6b] text-base leading-relaxed mb-8">
              Our first-generation plantations are now maturing, delivering the 8–15x returns we
              promised. This is the power of patient, nature-backed investing.
            </p>
            <Link href="/contact#inquiry">
              <Button className="bg-[#c8851e] hover:bg-[#a96618] text-white gap-2">
                Join Our Investor Family
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.pexels.com/photos/10971334/pexels-photo-10971334.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Plantation"
              className="rounded-2xl w-full h-56 object-cover"
            />
            <img
              src="https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Forest"
              className="rounded-2xl w-full h-56 object-cover mt-8"
            />
            <img
              src="https://images.pexels.com/photos/10316168/pexels-photo-10316168.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Trees"
              className="rounded-2xl w-full h-56 object-cover"
            />
            <img
              src="https://images.pexels.com/photos/17052523/pexels-photo-17052523.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Land"
              className="rounded-2xl w-full h-56 object-cover mt-8"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-3">Our Principles</p>
            <h2 className="font-display text-4xl font-semibold text-[#1a1a1a]">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-[#faf6f2] border border-[#e8e0d8] hover:border-[#c8851e]/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#c8851e] to-[#e9be55] flex items-center justify-center">
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">{v.title}</h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-3">Leadership</p>
            <h2 className="font-display text-4xl font-semibold text-[#1a1a1a]">The Minds Behind ArborVest</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#e8e0d8] hover:border-[#c8851e]/30 hover:shadow-lg transition-all group">
                <div className="h-48 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="font-semibold text-[#1a1a1a] mb-0.5">{member.name}</div>
                  <div className="text-[#c8851e] text-xs font-medium mb-2">{member.title}</div>
                  <p className="text-[#6b6b6b] text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 bg-[#0a1f0a]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-4">Recognition</p>
          <h2 className="font-display text-4xl font-semibold text-white mb-12">
            Recognized for Excellence
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Best AgriInvestment Platform', year: '2023', body: 'India Agribusiness Awards' },
              { icon: Users, title: 'Top 10 Land Investment Cos.', year: '2022', body: 'Economic Times' },
              { icon: TreePine, title: 'Sustainable Forestry Leader', year: '2021', body: 'Ministry of Environment' },
            ].map((award, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#c8851e]/30 transition-all">
                <award.icon className="w-8 h-8 text-[#e9be55] mx-auto mb-4" />
                <div className="text-white font-semibold mb-1">{award.title}</div>
                <div className="text-[#e9be55] text-sm mb-1">{award.year}</div>
                <div className="text-white/40 text-xs">{award.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
