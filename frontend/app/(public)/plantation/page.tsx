'use client';

import { Droplets, Sun, Bug, Scissors, Package, CheckCircle } from 'lucide-react';

const stages = [
  {
    number: '01',
    title: 'Site Selection & Soil Preparation',
    duration: 'Month 1–2',
    icon: CheckCircle,
    description: 'We conduct comprehensive soil testing, topographic surveys, and water table analysis. Red laterite and loamy soils with pH 6.5–7.5 are ideal for Santalum album.',
    activities: ['Soil nutrient profiling', 'Drainage channel design', 'Plot fencing & security', 'Infrastructure setup', 'Irrigation network installation'],
    image: 'https://images.pexels.com/photos/34042459/pexels-photo-34042459.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    number: '02',
    title: 'Nursery & Propagation',
    duration: 'Month 2–4',
    icon: Droplets,
    description: 'Disease-free saplings are raised in our certified nursery from seeds sourced from mother trees with proven oil content above 5%. Each sapling is health-certified before field planting.',
    activities: ['Certified seed procurement', 'Polybag nursery management', 'Growth hormone treatment', 'Disease screening & QC', 'Root development monitoring'],
    image: 'https://images.pexels.com/photos/11669262/pexels-photo-11669262.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    number: '03',
    title: 'Plantation & Host Trees',
    duration: 'Month 4–6',
    icon: Sun,
    description: 'Sandalwood is a hemi-parasitic plant requiring host trees. We carefully select companion species like Casuarina and Flemingia that complement sandalwood\'s root nutrition system.',
    activities: ['60 plants per acre spacing', 'Host tree co-planting', 'Root attachment monitoring', 'Mulching & weed control', 'Initial irrigation setup'],
    image: 'https://images.pexels.com/photos/32849312/pexels-photo-32849312.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    number: '04',
    title: 'Maintenance & Care',
    duration: 'Year 1–12',
    icon: Bug,
    description: 'Our year-round maintenance program covers fertilization, pest management, pruning, and irrigation. Monthly field visits and biannual photo updates keep investors informed.',
    activities: ['Monthly field monitoring', 'Integrated pest management', 'Organic fertilization cycles', 'Drip irrigation management', 'Annual girth measurements'],
    image: 'https://images.pexels.com/photos/15124451/pexels-photo-15124451.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    number: '05',
    title: 'Growth Assessment',
    duration: 'Year 5–12',
    icon: Scissors,
    description: 'Scientific assessment of heartwood formation using non-destructive acoustic technology. Heartwood determines oil content and ultimate commercial value of each tree.',
    activities: ['Acoustic tomography scanning', 'Oil content sampling', 'Girth & height charting', 'Revenue projection modeling', 'Harvest timing optimization'],
    image: 'https://images.pexels.com/photos/1563604/pexels-photo-1563604.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    number: '06',
    title: 'Harvest & Returns',
    duration: 'Year 12–20',
    icon: Package,
    description: 'Timed harvest maximizes oil yield. Sandalwood is sold to FMCG companies, fragrance houses, and pharmaceutical firms at premium prices. Proceeds are distributed to investors after costs.',
    activities: ['Government permit acquisition', 'Supervised harvesting', 'Wood grading & sorting', 'Market pricing negotiation', 'Investor disbursement'],
    image: 'https://images.pexels.com/photos/10316168/pexels-photo-10316168.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function PlantationPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#0a1f0a]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/32849312/pexels-photo-32849312.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0a1f0a]/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#c8851e] text-sm font-medium tracking-widest uppercase mb-4">Plantation Process</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-6">
            Science-Led Cultivation, <span className="text-gradient-gold">Proven Results</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Our 20-year cultivation protocol follows ICAR-certified practices with modern precision
            agriculture to maximize yield, oil content, and investor returns.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#faf6f2]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-[#1a1a1a]">From Seed to Harvest</h2>
            <p className="text-[#6b6b6b] mt-3">A structured 15–20 year journey from plantation to premium return</p>
          </div>

          <div className="space-y-10">
            {stages.map((stage, i) => (
              <div
                key={i}
                className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
              >
                <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className="bg-white rounded-2xl p-8 border border-[#e8e0d8] hover:border-[#c8851e]/30 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8851e] to-[#e9be55] flex items-center justify-center shrink-0">
                        <stage.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-display text-5xl font-bold text-[#e8d4b0] leading-none mb-1">{stage.number}</div>
                        <h3 className="font-display text-xl font-semibold text-[#1a1a1a]">{stage.title}</h3>
                        <span className="text-xs text-[#c8851e] font-medium tracking-wide">{stage.duration}</span>
                      </div>
                    </div>
                    <p className="text-[#6b6b6b] text-sm leading-relaxed mb-5">{stage.description}</p>
                    <ul className="space-y-1.5">
                      {stage.activities.map((act, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-[#4a4a4a]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c8851e] shrink-0" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="rounded-2xl w-full h-72 object-cover shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Science Callout */}
      <section className="py-20 bg-[#0a1f0a]">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { value: '5.2%', label: 'Avg. Heartwood Oil Content', desc: 'Our trees consistently test above ICAR minimum standards of 3%.' },
            { value: '98.2%', label: 'Survival Rate', desc: 'Through precision irrigation and intensive care, we achieve industry-best survival rates.' },
            { value: '20+', label: 'Years of R&D', desc: 'Proprietary cultivation protocols developed through two decades of field research.' },
          ].map((item, i) => (
            <div key={i} className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#c8851e]/30 transition-all">
              <div className="font-display text-4xl font-bold text-[#e9be55] mb-2">{item.value}</div>
              <div className="text-white font-semibold text-sm mb-3">{item.label}</div>
              <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
