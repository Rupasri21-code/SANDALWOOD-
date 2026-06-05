'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Clock, BarChart3, Leaf, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Exceptional ROI',
    value: '8–18%',
    label: 'Annual Appreciation',
    description: 'Sandalwood prices have consistently outperformed equity indices over 15-year periods.',
  },
  {
    icon: Shield,
    title: 'Tangible Asset Security',
    value: '100%',
    label: 'Title Clear Guarantee',
    description: 'Your investment is backed by physical land with registered ownership in your name.',
  },
  {
    icon: Clock,
    title: 'Long-Term Wealth',
    value: '8–15x',
    label: 'Capital Appreciation',
    description: 'Patient investors who hold for 15 years see extraordinary wealth multiplication.',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Diversification',
    value: 'Zero',
    label: 'Correlation to Markets',
    description: 'Sandalwood returns are uncorrelated with stock markets, hedging portfolio risk.',
  },
];

const plans = [
  {
    name: 'Seedling',
    minInvestment: '₹10 Lakhs',
    area: '0.5 Acres',
    plants: 60,
    features: [
      'Legal land ownership certificate',
      'Quarterly plantation reports',
      'Investor portal access',
      'Annual physical site visit',
      'Dedicated relationship manager',
    ],
    highlighted: false,
  },
  {
    name: 'Sapling',
    minInvestment: '₹25 Lakhs',
    area: '1.25 Acres',
    plants: 150,
    features: [
      'Everything in Seedling',
      'Premium plantation plot selection',
      'Priority harvest allocation',
      'Bi-annual site visits',
      'Insurance coverage',
      'Resale assistance',
    ],
    highlighted: true,
  },
  {
    name: 'Grove',
    minInvestment: '₹1 Crore+',
    area: '5+ Acres',
    plants: 600,
    features: [
      'Everything in Sapling',
      'Dedicated plantation zone',
      'Customized plantation design',
      'Monthly reports & updates',
      'Priority harvest & export',
      'Family inheritance planning',
      'Legal estate management',
    ],
    highlighted: false,
  },
];

export default function InvestmentPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-[#0a1f0a]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0a1f0a]/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-4">Investment Benefits</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6">
            Why Smart Investors Choose <span className="text-gradient-gold">Sandalwood</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A rare combination of tangible assets, consistent appreciation, and environmental impact
            that no financial product can replicate.
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-[#e8e0d8] hover:border-[#c8851e]/30 hover:shadow-lg transition-all text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#c8851e] to-[#e9be55] flex items-center justify-center mb-5">
                <b.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-display text-3xl font-bold text-[#1a1a1a] mb-0.5">{b.value}</div>
              <div className="text-[#c8851e] text-xs font-semibold tracking-widest uppercase mb-3">{b.label}</div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">{b.title}</h3>
              <p className="text-[#6b6b6b] text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-3">Asset Comparison</p>
            <h2 className="font-display text-4xl font-semibold text-[#1a1a1a]">
              How Sandalwood Stacks Up
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#e8e0d8]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#faf6f2]">
                  <th className="text-left p-5 text-[#1a1a1a] font-semibold">Asset Class</th>
                  <th className="text-center p-5 text-[#1a1a1a] font-semibold">Avg. Return (15yr)</th>
                  <th className="text-center p-5 text-[#1a1a1a] font-semibold">Market Correlation</th>
                  <th className="text-center p-5 text-[#1a1a1a] font-semibold">Tangible Asset</th>
                  <th className="text-center p-5 text-[#1a1a1a] font-semibold">ESG Positive</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { asset: 'Sandalwood (Chandan Nilayam)', return: '12–18%', correlation: 'None', tangible: true, esg: true, highlight: true },
                  { asset: 'Equity Mutual Funds', return: '10–14%', correlation: 'High', tangible: false, esg: false, highlight: false },
                  { asset: 'Real Estate', return: '6–10%', correlation: 'Low', tangible: true, esg: false, highlight: false },
                  { asset: 'Gold', return: '7–9%', correlation: 'Low', tangible: true, esg: false, highlight: false },
                  { asset: 'Fixed Deposits', return: '5–7%', correlation: 'None', tangible: false, esg: false, highlight: false },
                ].map((row, i) => (
                  <tr key={i} className={`border-t border-[#e8e0d8] ${row.highlight ? 'bg-[#fdf3e0]' : 'hover:bg-[#faf6f2]'}`}>
                    <td className="p-5 font-medium text-[#1a1a1a]">
                      {row.highlight && <span className="inline-block w-2 h-2 rounded-full bg-[#c8851e] mr-2" />}
                      {row.asset}
                    </td>
                    <td className="text-center p-5 text-[#c8851e] font-semibold">{row.return}</td>
                    <td className="text-center p-5 text-[#6b6b6b]">{row.correlation}</td>
                    <td className="text-center p-5">{row.tangible ? '✓' : '—'}</td>
                    <td className="text-center p-5">{row.esg ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-3">Investment Plans</p>
            <h2 className="font-display text-4xl font-semibold text-[#1a1a1a]">Choose Your Path</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border-2 flex flex-col transition-all ${
                  plan.highlighted
                    ? 'bg-[#0a1f0a] border-[#c8851e] shadow-2xl shadow-[#c8851e]/20 scale-[1.02]'
                    : 'bg-white border-[#e8e0d8] hover:border-[#c8851e]/40 hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="bg-[#c8851e] text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <div className={`font-display text-2xl font-semibold mb-1 ${plan.highlighted ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  {plan.name}
                </div>
                <div className={`text-3xl font-bold mb-1 ${plan.highlighted ? 'text-[#e9be55]' : 'text-[#c8851e]'}`}>
                  {plan.minInvestment}
                </div>
                <div className={`text-xs mb-6 ${plan.highlighted ? 'text-white/50' : 'text-[#6b6b6b]'}`}>
                  {plan.area} · {plan.plants} plants
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <span className={`text-[#c8851e] font-bold mt-0.5 shrink-0`}>✓</span>
                      <span className={plan.highlighted ? 'text-white/80' : 'text-[#6b6b6b]'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact#inquiry">
                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-[#c8851e] to-[#e0a63a] hover:from-[#a96618] hover:to-[#c8851e] text-white'
                        : 'border border-[#c8851e]/40 bg-transparent text-[#c8851e] hover:bg-[#c8851e]/10'
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax Benefits */}
      <section className="py-20 bg-[#0a1f0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Leaf className="w-12 h-12 text-[#e9be55] mx-auto mb-6" />
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-3">Tax Advantages</p>
          <h2 className="font-display text-4xl font-semibold text-white mb-6">
            Agricultural Income Tax Benefits
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Income from sandalwood plantations is classified as agricultural income under Indian tax law,
            offering significant exemptions for qualifying investors.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { title: 'Agricultural Income Exemption', desc: 'Income from harvesting classified as agricultural under Sec. 2(1A) of Income Tax Act.' },
              { title: 'Long-Term Capital Gains Benefits', desc: 'Favourable LTCG treatment on sale of agricultural land in rural areas.' },
              { title: 'No GST on Agricultural Produce', desc: 'Sandalwood sale proceeds are not subject to GST under Schedule I.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 text-left hover:border-[#c8851e]/30 transition-all">
                <FileText className="w-5 h-5 text-[#e9be55] mb-3" />
                <div className="text-white font-semibold mb-2 text-sm">{item.title}</div>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs">
            * Tax benefits subject to applicable law. Consult your tax advisor for personalized advice.
          </p>
        </div>
      </section>
    </div>
  );
}
