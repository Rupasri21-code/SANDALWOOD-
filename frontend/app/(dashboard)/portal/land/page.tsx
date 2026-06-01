'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { MapPin, Ruler, Calendar, IndianRupee } from 'lucide-react';

type Land = {
  id: string;
  title: string;
  description: string;
  location: string;
  district: string;
  state: string;
  survey_number: string;
  total_area: number;
  unit: string;
  purchase_date: string | null;
  purchase_price: number;
  current_value: number;
  status: string;
  images: string[];
};

export default function PortalLandPage() {
  const { profile } = useAuth();
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data: cust } = await supabase.from('customers').select('id').eq('user_id', profile.id).maybeSingle();
      if (!cust) { setLoading(false); return; }
      const { data } = await supabase.from('lands').select('*').eq('customer_id', cust.id);
      setLands(data ?? []);
      setLoading(false);
    };
    load();
  }, [profile]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#1a1a1a]">My Land</h1>
        <p className="text-[#6b6b6b] text-sm mt-1">{lands.length} land parcels assigned to your account</p>
      </div>

      {lands.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e0d8]">
          <MapPin className="w-10 h-10 text-[#c8851e]/30 mx-auto mb-3" />
          <p className="text-[#6b6b6b] text-sm">No land parcels assigned yet. Contact your relationship manager.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {lands.map((land) => (
            <div key={land.id} className="bg-white rounded-2xl border border-[#e8e0d8] overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="h-48 bg-gradient-to-br from-[#1a4a1a]/10 to-[#3d2210]/10 relative overflow-hidden">
                {land.images?.[0] ? (
                  <img src={land.images[0]} alt={land.title} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src="https://images.pexels.com/photos/32849312/pexels-photo-32849312.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt={land.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    land.status === 'active' ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'
                  }`}>
                    {land.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-[#1a1a1a] mb-2">{land.title}</h3>
                {land.description && <p className="text-[#6b6b6b] text-sm mb-4 leading-relaxed">{land.description}</p>}

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#faf6f2] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#6b6b6b] text-xs mb-1">
                      <Ruler className="w-3 h-3" /> Area
                    </div>
                    <div className="font-semibold text-[#1a1a1a] text-sm">{land.total_area} {land.unit}</div>
                  </div>
                  <div className="bg-[#faf6f2] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#6b6b6b] text-xs mb-1">
                      <IndianRupee className="w-3 h-3" /> Current Value
                    </div>
                    <div className="font-semibold text-[#c8851e] text-sm">₹{(land.current_value / 100000).toFixed(1)}L</div>
                  </div>
                  <div className="bg-[#faf6f2] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#6b6b6b] text-xs mb-1">
                      <MapPin className="w-3 h-3" /> Location
                    </div>
                    <div className="font-semibold text-[#1a1a1a] text-sm">{[land.district, land.state].filter(Boolean).join(', ') || '—'}</div>
                  </div>
                  <div className="bg-[#faf6f2] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#6b6b6b] text-xs mb-1">
                      <Calendar className="w-3 h-3" /> Purchased
                    </div>
                    <div className="font-semibold text-[#1a1a1a] text-sm">{land.purchase_date || '—'}</div>
                  </div>
                </div>

                {land.survey_number && (
                  <div className="text-xs text-[#6b6b6b] border-t border-[#e8e0d8] pt-3 mt-3">
                    Survey No: <span className="text-[#1a1a1a] font-medium">{land.survey_number}</span>
                  </div>
                )}

                {land.purchase_price > 0 && (
                  <div className="text-xs text-[#6b6b6b] mt-1">
                    Purchase Price: <span className="text-[#1a1a1a] font-medium">₹{(land.purchase_price / 100000).toFixed(2)}L</span>
                    {land.current_value > 0 && land.purchase_price > 0 && (
                      <span className="ml-2 text-green-600 font-medium">
                        +{(((land.current_value - land.purchase_price) / land.purchase_price) * 100).toFixed(1)}% appreciation
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
