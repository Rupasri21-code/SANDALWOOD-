'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sprout, Activity, ArrowUpRight, CheckCircle, Leaf, FileText, Image as ImageIcon, Download } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export default function PortalPlantationPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res1 = await fetch(`${API_URL}/crops/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data1 = await res1.json();
        if (data1.success) setCrops(data1.data);
        
        const res2 = await fetch(`${API_URL}/updates/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data2 = await res2.json();
        if (data2.success) setUpdates(data2.data);

      } catch (err) {
        console.error('Failed to load plantation data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" /></div>;
  }

  // Aggregate stats from real data
  const totalTrees = crops.reduce((sum, c) => sum + (c.surviving_plants || 0), 0);
  const totalOriginal = crops.reduce((sum, c) => sum + (c.total_plants || 0), 0);
  const survivalRate = totalOriginal > 0 ? ((totalTrees / totalOriginal) * 100).toFixed(1) + '%' : 'N/A';
  const currentStage = crops.length > 0 ? crops[0].growth_stage : null;
  const currentHealth = crops.length > 0 ? crops[0].health_status : 'Pending';
  const latestUpdate = updates.length > 0 ? updates[0] : null;

  const getTimelineStatus = (stageName: string) => {
    const stages = ['Land Prep', 'Planting', 'Sapling', 'Juvenile', 'Harvest'];
    let safeStage = 'Pending';
    if (currentStage) {
        if (currentStage === 'SEEDLING') safeStage = 'Planting';
        else if (currentStage === 'SAPLING') safeStage = 'Sapling';
        else if (currentStage === 'JUVENILE') safeStage = 'Juvenile';
        else if (currentStage === 'MATURE' || currentStage === 'HARVEST_READY') safeStage = 'Harvest';
    }
    
    const currentIdx = stages.findIndex(s => s === safeStage);
    const thisIdx = stages.findIndex(s => s === stageName);
    
    if (currentIdx === -1) return 'pending';
    if (thisIdx < currentIdx) return 'completed';
    if (thisIdx === currentIdx) return 'active';
    return 'pending';
  };

  const images = updates.filter(u => u.media_url).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">Plantation Status</h1>
        <p className="text-[#B8B8A8] text-sm mt-1">Real-time overview of your sandalwood crop growth and health.</p>
      </div>

      {crops.length === 0 ? (
        <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-12 text-center">
          <Sprout className="w-12 h-12 text-[#C49A5A]/30 mx-auto mb-4" />
          <h3 className="text-[#F7F0E4] font-medium mb-1">No plantation records available yet.</h3>
          <p className="text-[#B8B8A8] text-sm">Your crop data will appear here once planting begins.</p>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Trees', value: totalTrees.toString(), icon: Sprout, change: 'Current', color: 'linear-gradient(135deg, #0F2745, #153C72, #1E5DB4)', shadow: 'rgba(30,93,180,0.6)' },
          { label: 'Growth Stage', value: currentStage?.replace('_', ' ') || 'Pending', icon: Activity, change: 'Latest', color: 'linear-gradient(135deg, #0E2A1D, #12643A, #1F8A50)', shadow: 'rgba(31,138,80,0.6)' },
          { label: 'Survival Rate', value: survivalRate, icon: Leaf, change: 'Current', color: 'linear-gradient(135deg, #3A2804, #8A6411, #D4A017)', shadow: 'rgba(212,160,23,0.6)' },
          { label: 'Health Status', value: currentHealth, icon: FileText, change: 'Current', color: 'linear-gradient(135deg, #24143D, #4A247A, #7B3FE4)', shadow: 'rgba(123,63,228,0.6)' },
        ].map((card, i) => (
          <div key={i} className="rounded-[24px] p-6 relative overflow-hidden group hover:scale-[1.03] hover:brightness-[1.08] transition-all duration-300 flex flex-col justify-between" style={{ background: card.color, border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none" style={{ boxShadow: `0 0 30px ${card.shadow} inset, 0 0 25px ${card.shadow}` }} />
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <card.icon className="w-5 h-5 text-[#C49A5A]" />
              </div>
              <span className="text-white/90 bg-black/20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 backdrop-blur-sm border border-white/20 shadow-sm">
                {card.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="font-display text-2xl font-bold text-white mb-0.5 capitalize relative z-10 drop-shadow-md">{card.value}</div>
            <div className="text-white/90 text-sm font-semibold relative z-10 tracking-wide drop-shadow-sm">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Plantation Progress Timeline */}
      <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6 sm:p-8">
        <h2 className="text-[#F7F0E4] font-semibold text-lg mb-8">Plantation Progress</h2>
        
        <div className="relative">
          {/* Gold Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full hidden sm:block">
            <div className="h-full bg-[#C49A5A] rounded-full transition-all duration-1000" style={{ width: currentStage === 'HARVEST_READY' ? '100%' : currentStage === 'MATURE' ? '80%' : currentStage === 'JUVENILE' ? '60%' : currentStage === 'SAPLING' ? '40%' : currentStage === 'SEEDLING' ? '20%' : '0%' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-0 relative z-10">
            {[
              { stage: 'Land Prep', date: 'Done' },
              { stage: 'Planting', date: 'Done' },
              { stage: 'Sapling', date: 'Current' },
              { stage: 'Juvenile', date: 'Future' },
              { stage: 'Harvest', date: 'Future' },
            ].map((step, i) => {
              const status = getTimelineStatus(step.stage);
              return (
                <div key={i} className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    status === 'completed' ? 'bg-[#12372A] border-[#22C55E] text-[#22C55E]' :
                    status === 'active' ? 'bg-[#C49A5A] border-[#C49A5A] text-[#10140E] shadow-[0_0_15px_rgba(196,154,90,0.5)]' :
                    'bg-[#10140E] border-white/20 text-white/20'
                  }`}>
                    {status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${status === 'active' ? 'text-[#C49A5A]' : status === 'completed' ? 'text-[#F7F0E4]' : 'text-[#B8B8A8]'}`}>
                      {step.stage}
                    </div>
                    <div className="text-[11px] text-[#B8B8A8] mt-0.5">{step.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Latest Inspection Report */}
        <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#F7F0E4] font-semibold text-base">Latest Inspection Report</h2>
            {latestUpdate?.media_url && latestUpdate.media_url.endsWith('.pdf') && (
              <a href={latestUpdate.media_url} target="_blank" rel="noreferrer" className="text-[#C49A5A] text-xs hover:underline flex items-center gap-1"><Download className="w-3 h-3"/> Download PDF</a>
            )}
          </div>
          {latestUpdate ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[#B8B8A8] text-sm">Date</span>
                <span className="text-[#F7F0E4] text-sm font-medium">{new Date(latestUpdate.update_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-[#B8B8A8] text-sm">Type</span>
                <span className="text-[#F7F0E4] text-sm font-medium capitalize">{latestUpdate.update_type?.replace('_', ' ')}</span>
              </div>
              <div className="pt-2">
                <span className="text-[#B8B8A8] text-xs block mb-1">Remarks</span>
                <p className="text-[#F7F0E4] text-sm leading-relaxed">{latestUpdate.description}</p>
              </div>
            </div>
          ) : (
            <p className="text-[#B8B8A8] text-sm">No inspection reports available yet.</p>
          )}
        </div>

        {/* Recent Photos */}
        <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#F7F0E4] font-semibold text-base">Recent Photos</h2>
          </div>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img) => (
                <div key={img.id} className="aspect-square rounded-xl bg-black/40 border border-white/5 overflow-hidden relative group cursor-pointer">
                  <img src={img.media_url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                    <span className="text-[#F7F0E4] text-xs font-medium">{new Date(img.update_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric'})}</span>
                    <a href={img.media_url} target="_blank" rel="noreferrer" className="text-[#C49A5A] text-[10px] mt-1 border border-[#C49A5A]/30 px-2 py-0.5 rounded">View Full</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ImageIcon className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-[#B8B8A8] text-sm">No recent photos available.</p>
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
