'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Map, Sprout, TrendingUp, CreditCard, ArrowUpRight, Bell, FileText, Activity, Phone, Navigation, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
          
          const totalInv = stats.summary.totalInvested || 0;
          const estVal = totalInv > 0 ? totalInv * 1.2 : 0;
          
          setSummary({
            lands: stats.summary.totalPlots || 0,
            crops: stats.summary.totalTrees || 0,
            investments: stats.recentPayments?.length || 0,
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
    { label: 'My Land Parcels', value: summary.lands, icon: Map, change: '+0%', href: '/portal/land', gradient: 'linear-gradient(135deg, #0F2745, #153C72, #1E5DB4)', shadow: 'rgba(30,93,180,0.6)' },
    { label: 'Active Sandalwood Crops', value: summary.crops, icon: Sprout, change: '+5%', href: '/portal/plantation', gradient: 'linear-gradient(135deg, #0E2A1D, #12643A, #1F8A50)', shadow: 'rgba(31,138,80,0.6)' },
    { label: 'Documents', value: summary.documents, icon: FileText, change: '+2%', href: '/portal/documents', gradient: 'linear-gradient(135deg, #24143D, #4A247A, #7B3FE4)', shadow: 'rgba(123,63,228,0.6)' },
    { label: 'Total Investment', value: `₹${(summary.totalInvested).toLocaleString('en-IN')}`, icon: TrendingUp, change: '+15%', href: '/portal/investment', gradient: 'linear-gradient(135deg, #3A2804, #8A6411, #D4A017)', shadow: 'rgba(212,160,23,0.6)' },
    { label: 'Payments', value: summary.payments, icon: CreditCard, change: '+10%', href: '/portal/payments', gradient: 'linear-gradient(135deg, #062E3E, #0D5B75, #19A7CE)', shadow: 'rgba(25,167,206,0.6)' },
    { label: 'Estimated Value', value: `₹${(summary.estimatedValue / 100000).toFixed(1)} L`, icon: Activity, change: '+20%', href: '/portal/investment', gradient: 'linear-gradient(135deg, #3D1212, #8E1B1B, #D73A3A)', shadow: 'rgba(215,58,58,0.6)' },
  ];

  const typeColors: Record<string, string> = {
    info: 'bg-[#C49A5A]/15 text-[#C49A5A]',
    success: 'bg-[#22C55E]/15 text-[#22C55E]',
    warning: 'bg-amber-400/15 text-amber-400',
    alert: 'bg-red-400/15 text-red-400',
    update: 'bg-[#C49A5A]/15 text-[#C49A5A]',
    general: 'bg-[#C49A5A]/15 text-[#C49A5A]',
    maintenance: 'bg-amber-400/15 text-amber-400',
    growth: 'bg-[#22C55E]/15 text-[#22C55E]', 
    pest_control: 'bg-red-400/15 text-red-400',
    fertilization: 'bg-[#22C55E]/15 text-[#22C55E]', 
    irrigation: 'bg-cyan-400/15 text-cyan-400',
    harvest: 'bg-[#C49A5A]/15 text-[#C49A5A]',
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
      {/* Header */}
      <motion.div variants={itemVariants} className="pb-2">
        <h1 className="font-display text-[2rem] font-bold text-[#F8F5EE] tracking-tight">Dashboard Overview</h1>
        <p className="text-[#A8B5AA] text-[15px] mt-1.5 font-medium">Welcome back, {profile?.full_name?.split(' ')[0] || 'Investor'}. Here is your portfolio summary.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <Link key={i} href={card.href} className="block group">
            <div 
              style={{
                background: card.gradient,
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }}
              className="rounded-[24px] p-6 transition-all duration-300 relative overflow-hidden h-[130px] flex flex-col group-hover:scale-[1.03] group-hover:brightness-[1.08]"
            >
              {/* Colorful Glow Shadow Matching Each Card */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px] pointer-events-none"
                style={{ boxShadow: `0 0 30px ${card.shadow} inset, 0 0 25px ${card.shadow}` }}
              />
              {/* Subtle glass reflection */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <card.icon className="w-5 h-5 text-[#C49A5A]" />
                </div>
                <span className="text-white/90 bg-black/20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 backdrop-blur-sm border border-white/20 shadow-sm">
                  {card.change} <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="font-display text-3xl font-bold text-white mb-1 relative z-10 drop-shadow-md mt-auto pt-2">{card.value}</div>
              <div className="text-white/90 text-sm font-semibold relative z-10 tracking-wide drop-shadow-sm">{card.label}</div>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Plantation Updates */}
        <motion.div variants={itemVariants} className="bg-[#101A13] border border-[#C49A5A]/35 rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#C49A5A]/20 bg-[#121F17]">
            <h2 className="text-[#F8F5EE] font-bold text-base tracking-wide flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#C49A5A]" /> Recent Updates
            </h2>
            <Link href="/portal/plantation" className="text-[#C49A5A] text-xs font-semibold hover:text-[#e9be55] transition-colors flex items-center gap-1 group">
              View all <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          {recentUpdates.length === 0 ? (
            <div className="p-10 text-center text-[#A8B5AA] text-sm font-medium">No updates available yet</div>
          ) : (
            <div className="divide-y divide-[#C49A5A]/10 flex-1">
              {recentUpdates.slice(0, 5).map((u, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[#C49A5A]/5 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[10px] bg-[#121F17] border border-[#C49A5A]/30 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-[#C49A5A]/60 transition-colors">
                      {u.media_url ? (
                        <img src={u.media_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Sprout className="w-5 h-5 text-[#C49A5A]" />
                      )}
                    </div>
                    <div>
                      <div className="text-[#F8F5EE] text-[13px] font-semibold truncate max-w-[200px] mb-0.5 group-hover:text-[#C49A5A] transition-colors">{u.title}</div>
                      <div className="text-[#A8B5AA] text-[11px] font-medium">{new Date(u.update_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${typeColors[u.update_type?.toLowerCase()] || 'bg-[#121F17] text-[#A8B5AA] border border-[#A8B5AA]/30'}`}>
                    {u.update_type?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Notifications */}
        <motion.div variants={itemVariants} className="bg-[#101A13] border border-[#C49A5A]/35 rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#C49A5A]/20 bg-[#121F17]">
            <h2 className="text-[#F8F5EE] font-bold text-base tracking-wide flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C49A5A]" /> Notifications
            </h2>
            <Link href="/portal/notifications" className="text-[#C49A5A] text-xs font-semibold hover:text-[#e9be55] transition-colors flex items-center gap-1 group">
              View all <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          {notifications.length === 0 ? (
            <div className="p-10 text-center text-[#A8B5AA] text-sm font-medium">No new notifications</div>
          ) : (
            <div className="divide-y divide-[#C49A5A]/10 flex-1">
              {notifications.slice(0, 5).map((n, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[#C49A5A]/5 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#121F17] border border-[#C49A5A]/30 flex items-center justify-center shadow-sm group-hover:border-[#C49A5A]/60 transition-colors">
                      <Bell className="w-4 h-4 text-[#C49A5A]" />
                    </div>
                    <div>
                      <div className="text-[#F8F5EE] text-[13px] font-semibold truncate max-w-[200px] mb-0.5 group-hover:text-[#C49A5A] transition-colors">{n.title}</div>
                      <div className="text-[#A8B5AA] text-[11px] font-medium">{new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  {!n.is_read && (
                     <div className="w-2 h-2 rounded-full bg-[#C49A5A] shadow-[0_0_8px_rgba(196,154,90,0.8)]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-[#101A13] border border-[#C49A5A]/35 rounded-[18px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <h2 className="text-[#F8F5EE] font-bold text-lg mb-6 tracking-wide">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { href: '/portal/land', label: 'View My Land', icon: Map },
            { href: '/portal/payments', label: 'View Payments', icon: CreditCard },
            { href: '/portal/documents', label: 'Documents', icon: FileText },
            { href: 'mailto:support@chandannilayam.com', label: 'Contact Support', icon: Phone },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="group flex flex-col items-center gap-3 p-6 rounded-[14px] border border-[#C49A5A]/20 bg-[#121F17] hover:bg-[#C49A5A]/10 hover:border-[#C49A5A]/50 transition-all duration-300 text-center shadow-sm hover:shadow-[0_0_20px_rgba(196,154,90,0.15)] relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-full bg-[#08120D] border border-[#C49A5A]/40 flex items-center justify-center group-hover:scale-110 group-hover:border-[#C49A5A] transition-all duration-300 z-10 shadow-inner group-hover:shadow-[0_0_15px_rgba(196,154,90,0.3)]">
                <action.icon className="w-6 h-6 text-[#C49A5A]" />
              </div>
              <span className="text-[#F8F5EE] text-[13px] font-semibold z-10">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Plot Location Section */}
      {myPlots.length > 0 && (
        <motion.div variants={itemVariants} className="bg-[#101A13] border border-[#C49A5A]/35 rounded-[18px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <h2 className="text-[#F8F5EE] font-bold text-lg mb-6 tracking-wide flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C49A5A]" /> My Plot Location
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {myPlots.map((plot) => (
              <div key={plot.id} className="border border-[#C49A5A]/20 rounded-[14px] overflow-hidden flex flex-col sm:flex-row bg-[#121F17] hover:border-[#C49A5A]/40 transition-colors shadow-sm group">
                <div className="w-full sm:w-[45%] h-[200px] sm:h-auto relative border-b sm:border-b-0 sm:border-r border-[#C49A5A]/20 bg-[#08120D] overflow-hidden">
                  {plot.latitude && plot.longitude ? (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${plot.latitude},${plot.longitude}&z=15&output=embed`}
                      className="opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-[1.02]"
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <Map className="w-10 h-10 text-[#C49A5A]/30 mb-3" />
                      <p className="text-[#A8B5AA] text-[11px] font-medium text-center">Coordinates pending</p>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col w-full sm:w-[55%]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[15px] text-[#F8F5EE] group-hover:text-[#C49A5A] transition-colors">{plot.title}</h3>
                    <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] font-bold uppercase tracking-wider">
                      {plot.status.toLowerCase()}
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-auto">
                    <p className="text-[12px] text-[#A8B5AA] font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C49A5A]" />
                      {[plot.district, plot.state].filter(Boolean).join(', ') || plot.location}
                    </p>
                    <p className="text-[12px] text-[#A8B5AA] font-medium pl-5">
                      Area: <span className="font-bold text-[#F8F5EE]">{plot.total_area} {plot.unit}</span>
                    </p>
                  </div>
                  
                  {plot.latitude && plot.longitude && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                      className="mt-6 w-full py-2.5 border border-[#C49A5A] bg-transparent hover:bg-[#C49A5A] text-[#C49A5A] hover:text-[#08120D] rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(196,154,90,0.1)] hover:shadow-[0_0_15px_rgba(196,154,90,0.4)]"
                    >
                      <Navigation className="w-4 h-4" /> Get Directions
                    </motion.button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
