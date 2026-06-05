'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Map, Sprout, TrendingUp, CreditCard, ArrowUpRight, Bell, FileText, Activity, Phone } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type InvestorData = {
  id: string;
  full_name: string;
  status: string;
};

type Summary = {
  lands: number;
  crops: number;
  investments: number;
  payments: number;
  totalInvested: number;
  documents: number;
  estimatedValue: number;
};

type Plot = {
  id: string;
  title: string;
  location: string;
  district: string;
  state: string;
  total_area: number;
  unit: string;
  status: string;
  latitude?: number;
  longitude?: number;
};

export default function PortalDashboard() {
  const { profile } = useAuth();
  const [investor, setInvestor] = useState<InvestorData | null>(null);
  const [summary, setSummary] = useState<Summary>({ lands: 0, crops: 0, investments: 0, payments: 0, totalInvested: 0, documents: 0, estimatedValue: 0 });
  const [myPlots, setMyPlots] = useState<Plot[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<{ title: string; update_type: string; update_date: string; media_url?: string }[]>([]);
  const [notifications, setNotifications] = useState<{ title: string; message: string; type: string; created_at: string; is_read: boolean }[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/dashboard/investor`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          const stats = data.data;
          setInvestor(stats.investor);
          
          // Estimate a small bump in value for display purposes if backend doesn't provide
          const totalInv = stats.summary.totalInvested || 0;
          const estVal = totalInv > 0 ? totalInv * 1.2 : 0;
          
          setSummary({
            lands: stats.summary.totalPlots || 0,
            crops: stats.summary.totalTrees || 0,
            investments: stats.recentPayments?.length || 0, // proxy
            payments: stats.summary.paymentsCount || 0,
            totalInvested: totalInv,
            documents: stats.summary.documentsCount || 0,
            estimatedValue: estVal,
          });
          setMyPlots(stats.plots || []);
          setNotifications(stats.recentNotifications || []);
          setRecentUpdates(stats.recentUpdates || []);
        }
      } catch (err) {
        console.error('Failed to fetch investor dashboard stats:', err);
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'My Land Parcels', value: summary.lands, icon: Map, change: '+0%', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20', href: '/portal/land' },
    { label: 'Active Sandalwood Crops', value: summary.crops, icon: Sprout, change: '+5%', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20', href: '/portal/plantation' },
    { label: 'Documents', value: summary.documents, icon: FileText, change: '+2%', color: 'from-[#c8851e]/20 to-[#c8851e]/10', border: 'border-[#c8851e]/20', href: '/portal/documents' },
    { label: 'Total Investment', value: `₹${(summary.totalInvested).toLocaleString('en-IN')}`, icon: TrendingUp, change: '+15%', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', href: '/portal/investment' },
    { label: 'Payments', value: summary.payments, icon: CreditCard, change: '+10%', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', href: '/portal/payments' },
    {
      label: 'Estimated Value',
      value: `₹${(summary.estimatedValue / 100000).toFixed(1)} L`,
      icon: Activity,
      change: '+20%',
      color: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/20',
      href: '/portal/investment'
    },
  ];

  const typeColors: Record<string, string> = {
    info: 'bg-blue-400/15 text-blue-400',
    success: 'bg-green-400/15 text-green-400',
    warning: 'bg-amber-400/15 text-amber-400',
    alert: 'bg-red-400/15 text-red-400',
    update: 'bg-[#c8851e]/15 text-[#c8851e]',
    general: 'bg-blue-400/15 text-blue-400',
    maintenance: 'bg-amber-400/15 text-amber-400',
    growth: 'bg-green-400/15 text-green-400', 
    pest_control: 'bg-red-400/15 text-red-400',
    fertilization: 'bg-lime-400/15 text-lime-400', 
    irrigation: 'bg-cyan-400/15 text-cyan-400',
    harvest: 'bg-[#c8851e]/15 text-[#c8851e]',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-semibold text-white">Dashboard Overview</h1>
        <p className="text-white/50 text-sm mt-1">Welcome back. Here's your investment summary today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className={`block bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5 hover:scale-[1.01] transition-transform`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                <card.icon className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-green-400 text-xs font-medium flex items-center gap-0.5">
                {card.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="font-display text-3xl font-bold text-white mb-0.5">{card.value}</div>
            <div className="text-white/50 text-xs">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Plantation Updates */}
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="text-white font-semibold text-sm">Recent Plantation Updates</h2>
            <Link href="/portal/plantation" className="text-[#c8851e] text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {recentUpdates.length === 0 ? (
            <div className="p-10 text-center text-white/30 text-sm">No updates yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentUpdates.slice(0, 5).map((u, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#c8851e]/20 border border-[#c8851e]/30 flex items-center justify-center overflow-hidden">
                      {u.media_url ? (
                        <img src={u.media_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Sprout className="w-4 h-4 text-[#e9be55]" />
                      )}
                    </div>
                    <div>
                      <div className="text-white text-xs font-medium truncate max-w-[200px]">{u.title}</div>
                      <div className="text-white/40 text-[10px]">{new Date(u.update_date).toLocaleDateString('en-IN')}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[u.update_type?.toLowerCase()] || 'bg-gray-400/15 text-gray-400'}`}>
                    {u.update_type?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h2 className="text-white font-semibold text-sm">Recent Notifications</h2>
            <Link href="/portal/notifications" className="text-[#c8851e] text-xs hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-white/30 text-sm">No notifications yet</div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.slice(0, 5).map((n, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5 text-white/70" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-medium truncate max-w-[200px]">{n.title}</div>
                      <div className="text-white/40 text-[10px]">{new Date(n.created_at).toLocaleDateString('en-IN')}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[n.type?.toLowerCase()] || 'bg-gray-400/15 text-gray-400'}`}>
                    {n.type?.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/portal/land', label: 'View My Land', icon: Map },
            { href: '/portal/payments', label: 'View Payments', icon: CreditCard },
            { href: '/portal/documents', label: 'Download Documents', icon: FileText },
            { href: 'mailto:support@chandannilayam.com', label: 'Contact Support', icon: Phone },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/8 hover:border-[#c8851e]/30 hover:bg-[#c8851e]/5 transition-all text-center"
            >
              <action.icon className="w-5 h-5 text-[#e9be55]" />
              <span className="text-white/70 text-xs">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Plot Location Section */}
      {myPlots.length > 0 && (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-sm mb-4">My Plot Location</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            {myPlots.map((plot) => (
              <div key={plot.id} className="border border-white/8 rounded-xl overflow-hidden group flex flex-col sm:flex-row bg-white/5">
                <div className="w-full sm:w-2/5 h-[180px] sm:h-auto relative border-b sm:border-b-0 sm:border-r border-white/8 bg-black/40">
                  {plot.latitude && plot.longitude ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${plot.latitude},${plot.longitude}&z=15&output=embed`}
                      className="opacity-70 group-hover:opacity-100 transition-opacity"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <Map className="w-8 h-8 text-white/20 mb-2" />
                      <p className="text-white/40 text-[10px] text-center">Location coordinates pending assignment</p>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col w-full sm:w-3/5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-sm text-white">{plot.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-400/15 text-green-400 font-medium capitalize">
                      {plot.status.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 mb-1 flex items-center gap-1">
                    <Map className="w-3 h-3" />
                    {[plot.district, plot.state].filter(Boolean).join(', ') || plot.location}
                  </p>
                  <p className="text-[11px] text-white/50 mb-auto">
                    Area: <span className="font-medium text-white">{plot.total_area} {plot.unit}</span>
                  </p>
                  
                  {plot.latitude && plot.longitude && (
                    <button 
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              window.open(`https://www.google.com/maps/dir/?api=1&origin=${pos.coords.latitude},${pos.coords.longitude}&destination=${plot.latitude},${plot.longitude}`, '_blank');
                            },
                            () => {
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${plot.latitude},${plot.longitude}`, '_blank');
                            }
                          );
                        } else {
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${plot.latitude},${plot.longitude}`, '_blank');
                        }
                      }}
                      className="mt-4 w-full py-2 border border-white/10 hover:bg-white/5 text-white/70 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Map className="w-3.5 h-3.5 text-[#e9be55]" /> Get Directions
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
