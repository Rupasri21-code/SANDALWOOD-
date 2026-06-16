'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Map, MapPin, Ruler, FileText, CheckCircle, Info } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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
  latitude?: number;
  longitude?: number;
  images: string[];
};

export default function PortalLandPage() {
  const { profile } = useAuth();
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_URL}/lands/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setLands(data.data);
        } else {
          setLands([]);
        }
      } catch (err) {
        console.error('Failed to load lands:', err);
        setLands([]);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#F7F0E4]">My Land</h1>
        <p className="text-[#B8B8A8] text-sm mt-1">View your allotted sandalwood plot and land details.</p>
      </div>

      {lands.length === 0 ? (
        <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-12 flex flex-col items-center justify-center text-center">
          <Map className="w-12 h-12 text-[#C49A5A]/30 mb-4" />
          <h3 className="text-[#F7F0E4] font-medium mb-1">No Land Assigned</h3>
          <p className="text-[#B8B8A8] text-sm">You do not have any land parcels assigned to your portfolio yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {lands.map((land) => (
            <div key={land.id} className="grid xl:grid-cols-3 gap-6">
              
              {/* Plot Summary & Details - Left 2 Columns */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Status Card */}
                <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-[#F7F0E4] font-display text-2xl font-semibold mb-1">{land.title}</h2>
                    <p className="text-[#B8B8A8] text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C49A5A]" /> {[land.district, land.state].filter(Boolean).join(', ') || land.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#B8B8A8] text-[11px] uppercase tracking-widest mb-1">Plot Status</div>
                    <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-[#22C55E] border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <CheckCircle className="w-3.5 h-3.5" /> {land.status}
                    </span>
                  </div>
                </div>

                {/* Plot Summary Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[#C49A5A]/10 border border-[#C49A5A]/20">
                        <Info className="w-4 h-4 text-[#C49A5A]" />
                      </div>
                      <h3 className="text-[#F7F0E4] font-medium text-sm">Plot Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[#B8B8A8] text-xs">Plot Number</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">{land.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[#B8B8A8] text-xs">Survey Number</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">{land.survey_number || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[#B8B8A8] text-xs">Area</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">{land.total_area} {land.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#B8B8A8] text-xs">Block</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">Phase 1</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[#C49A5A]/10 border border-[#C49A5A]/20">
                        <FileText className="w-4 h-4 text-[#C49A5A]" />
                      </div>
                      <h3 className="text-[#F7F0E4] font-medium text-sm">Ownership Details</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[#B8B8A8] text-xs">Owner Name</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">{profile?.full_name}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[#B8B8A8] text-xs">Passbook Number</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">PB-{land.id.substring(0, 6).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[#B8B8A8] text-xs">Allotment Date</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">{land.purchase_date ? new Date(land.purchase_date).toLocaleDateString() : 'Pending'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#B8B8A8] text-xs">Estimated Trees</span>
                        <span className="text-[#F7F0E4] font-medium text-sm">~{Math.floor(land.total_area * 150)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Card - Right Column */}
              <div className="bg-[rgba(18,55,42,0.35)] border border-[rgba(196,154,90,0.25)] rounded-[20px] overflow-hidden flex flex-col">
                <div className="p-5 border-b border-white/5 bg-black/10">
                  <h3 className="text-[#C49A5A] font-semibold text-sm flex items-center gap-2">
                    <Map className="w-4 h-4" /> GPS Location
                  </h3>
                </div>
                <div className="flex-1 bg-black/40 min-h-[250px] relative">
                  {land.latitude && land.longitude ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${land.latitude},${land.longitude}&z=15&output=embed`}
                      className="opacity-70 group-hover:opacity-100 transition-opacity"
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <MapPin className="w-8 h-8 text-[#C49A5A]/50 mb-3" />
                      <p className="text-[#F7F0E4] text-sm font-medium mb-1">{[land.district, land.state].filter(Boolean).join(', ') || land.location}</p>
                      <p className="text-[#B8B8A8] text-xs">Coordinates secured for privacy.</p>
                    </div>
                  )}
                </div>
                <div className="p-5 bg-black/20 border-t border-white/5">
                  <button 
                    onClick={() => {
                      if (land.latitude && land.longitude) {
                         window.open(`https://www.google.com/maps/dir/?api=1&destination=${land.latitude},${land.longitude}`, '_blank');
                      } else {
                         window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(land.district + ' ' + land.state)}`, '_blank');
                      }
                    }}
                    className="w-full bg-[#12372A] hover:bg-[#1A4A38] border border-[rgba(196,154,90,0.3)] text-[#C49A5A] rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" /> Get Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
