'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Sprout, Calendar, Activity } from 'lucide-react';

type Crop = {
  id: string;
  name: string;
  variety: string;
  growth_stage: string;
  health_status: string;
  total_plants: number;
  surviving_plants: number;
  planted_date: string | null;
  height_avg: number;
  land_id: string;
  landTitle?: string;
};

type Update = {
  id: string;
  title: string;
  description: string;
  update_type: string;
  update_date: string;
  images: string[];
};

const stageLabels: Record<string, string> = {
  seedling: 'Seedling', sapling: 'Sapling', juvenile: 'Juvenile', mature: 'Mature', harvest_ready: 'Harvest Ready'
};

const stageProgress: Record<string, number> = {
  seedling: 10, sapling: 30, juvenile: 55, mature: 80, harvest_ready: 100
};

const stageColors: Record<string, string> = {
  seedling: 'bg-yellow-400', sapling: 'bg-lime-400', juvenile: 'bg-green-500', mature: 'bg-emerald-500', harvest_ready: 'bg-[#c8851e]',
};

export default function PortalPlantationPage() {
  const { profile } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data: cust } = await supabase.from('customers').select('id').eq('user_id', profile.id).maybeSingle();
      if (!cust) { setLoading(false); return; }

      const { data: lands } = await supabase.from('lands').select('id, title').eq('customer_id', cust.id);
      if (!lands?.length) { setLoading(false); return; }

      const landIds = lands.map((l) => l.id);
      const [cropData, updateData] = await Promise.all([
        supabase.from('crops').select('*').in('land_id', landIds),
        supabase.from('plantation_updates').select('*').in('land_id', landIds).order('update_date', { ascending: false }).limit(20),
      ]);

      const enriched = (cropData.data ?? []).map((c) => ({
        ...c,
        landTitle: lands.find((l) => l.id === c.land_id)?.title,
      }));

      setCrops(enriched);
      setUpdates(updateData.data ?? []);
      setLoading(false);
    };
    load();
  }, [profile]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const typeColors: Record<string, string> = {
    general: 'bg-blue-100 text-blue-700', maintenance: 'bg-amber-100 text-amber-700',
    growth: 'bg-green-100 text-green-700', pest_control: 'bg-red-100 text-red-700',
    fertilization: 'bg-lime-100 text-lime-700', irrigation: 'bg-cyan-100 text-cyan-700',
    harvest: 'bg-[#fdf3e0] text-[#c8851e]',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#1a1a1a]">Plantation Status</h1>
        <p className="text-[#6b6b6b] text-sm mt-1">Real-time overview of your sandalwood crop</p>
      </div>

      {/* Crop Cards */}
      {crops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e0d8]">
          <Sprout className="w-10 h-10 text-[#c8851e]/30 mx-auto mb-3" />
          <p className="text-[#6b6b6b] text-sm">No crop data available yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#1a1a1a]">{crop.name}</h3>
                  <p className="text-[#6b6b6b] text-xs">{crop.landTitle} · {crop.variety || 'Standard Variety'}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  crop.health_status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                  crop.health_status === 'good' ? 'bg-green-100 text-green-700' :
                  crop.health_status === 'fair' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {crop.health_status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#6b6b6b]">Growth Stage: <span className="font-medium text-[#1a1a1a]">{stageLabels[crop.growth_stage]}</span></span>
                  <span className="text-xs font-semibold text-[#c8851e]">{stageProgress[crop.growth_stage]}%</span>
                </div>
                <div className="h-2.5 bg-[#f0e6d8] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stageColors[crop.growth_stage]} transition-all`}
                    style={{ width: `${stageProgress[crop.growth_stage]}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  {['Seedling', 'Sapling', 'Juvenile', 'Mature', 'Ready'].map((s, i) => (
                    <span key={i} className="text-[9px] text-[#6b6b6b]">{s}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#faf6f2] rounded-xl p-3 text-center">
                  <div className="font-bold text-[#1a1a1a] text-lg">{crop.total_plants}</div>
                  <div className="text-[#6b6b6b] text-[10px]">Total Plants</div>
                </div>
                <div className="bg-[#faf6f2] rounded-xl p-3 text-center">
                  <div className="font-bold text-green-600 text-lg">{crop.surviving_plants}</div>
                  <div className="text-[#6b6b6b] text-[10px]">Surviving</div>
                </div>
                <div className="bg-[#faf6f2] rounded-xl p-3 text-center">
                  <div className="font-bold text-[#c8851e] text-lg">{crop.height_avg > 0 ? `${crop.height_avg}cm` : '—'}</div>
                  <div className="text-[#6b6b6b] text-[10px]">Avg Height</div>
                </div>
              </div>

              {crop.planted_date && (
                <div className="flex items-center gap-1.5 mt-4 text-xs text-[#6b6b6b]">
                  <Calendar className="w-3 h-3" />
                  Planted: {crop.planted_date}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e8e0d8] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#c8851e]" />
          <h2 className="text-[#1a1a1a] font-semibold text-sm">Plantation Activity Log</h2>
        </div>
        {updates.length === 0 ? (
          <div className="p-10 text-center text-[#6b6b6b] text-sm">No activity logged yet</div>
        ) : (
          <div className="divide-y divide-[#e8e0d8]">
            {updates.map((u, i) => (
              <div key={i} className="px-5 py-4 hover:bg-[#faf6f2] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#c8851e] mt-2 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[#1a1a1a] text-sm font-medium">{u.title}</div>
                        {u.description && <p className="text-[#6b6b6b] text-xs mt-1 leading-relaxed">{u.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${typeColors[u.update_type] || 'bg-gray-100 text-gray-600'}`}>
                          {u.update_type.replace('_', ' ')}
                        </span>
                        <span className="text-[#6b6b6b] text-xs">{u.update_date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
