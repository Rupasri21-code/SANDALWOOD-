'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TreePine, LayoutDashboard, Users, Map, Sprout, TrendingUp, CreditCard,
  Bell, Image, LogOut, Menu, X, ChevronRight, Settings
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/investors', label: 'Investors', icon: Users },
  { href: '/admin/lands', label: 'Land Management', icon: Map },
  { href: '/admin/crops', label: 'Crop & Plantation', icon: Sprout },
  { href: '/admin/investments', label: 'Investments', icon: TrendingUp },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/media', label: 'Media Library', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'admin')) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08120D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') return null;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    router.push('/login');
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href) && item.href !== '/admin';
  };

  return (
    <div className="flex h-screen bg-[#08120D] overflow-hidden font-sans">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-[#032B1F] border-r border-[#C49A5A]/30 flex flex-col transition-transform duration-300 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-[#C49A5A]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C49A5A] bg-[#0B1A12] flex items-center justify-center shadow-[0_0_12px_rgba(196,154,90,0.2)]">
              <TreePine className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div>
              <span className="font-display text-base font-bold text-[#F8F5EE] tracking-wide">Chandan Nilayam</span>
              <span className="block text-[9px] text-[#C49A5A] tracking-[0.2em] uppercase mt-0.5 font-medium">Admin Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#C49A5A]/20 scrollbar-track-transparent">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group relative overflow-hidden ${
                  active
                    ? 'bg-gradient-to-r from-[#C49A5A]/15 to-transparent text-[#C49A5A] border border-[#C49A5A]/35 shadow-[0_0_15px_rgba(196,154,90,0.1)]'
                    : 'text-[#A8B5AA] hover:text-[#F8F5EE] hover:bg-white/5 border border-transparent hover:border-[#C49A5A]/20'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-[#C49A5A]' : 'text-[#A8B5AA] group-hover:text-[#F8F5EE]'}`} strokeWidth={active ? 2 : 1.5} />
                <span className={`flex-1 ${active ? 'font-medium' : ''}`}>{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 text-[#C49A5A] opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#C49A5A]/20 bg-[#08120D]/30">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[#101A13] border border-[#C49A5A]/35 shadow-lg group hover:border-[#C49A5A]/60 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#0B1A12] border border-[#C49A5A]/60 flex items-center justify-center shadow-[0_0_10px_rgba(196,154,90,0.15)] group-hover:shadow-[0_0_15px_rgba(196,154,90,0.3)] transition-shadow">
              <span className="text-[#C49A5A] text-sm font-bold">
                {profile.full_name?.[0] || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#F8F5EE] text-sm font-medium truncate">{profile.full_name || 'Admin'}</div>
              <div className="text-[#A8B5AA] text-[11px] truncate">{profile.email}</div>
            </div>
          </div>
          <Button
            onClick={() => setShowSignoutConfirm(true)}
            variant="ghost"
            className="w-full h-11 text-[#A8B5AA] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 gap-2 justify-start rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#08120D] to-[#0B1A12]">
        <header className="bg-[#08120D]/80 backdrop-blur-md border-b border-[#C49A5A]/20 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#A8B5AA] hover:text-[#C49A5A] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 text-sm text-[#A8B5AA]">
              <span className="text-[#F8F5EE] font-medium tracking-wide">Admin</span>
              <ChevronRight className="w-4 h-4 opacity-40" />
              <span className="capitalize text-[#C49A5A] font-medium">{pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-medium shadow-[0_0_12px_rgba(34,197,94,0.1)]">
              <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              System Operational
            </div>
            
            <Link href="/admin/notifications" className="relative p-2.5 rounded-full bg-[#101A13] hover:bg-[#121F17] border border-[#C49A5A]/35 transition-all hover:shadow-[0_0_12px_rgba(196,154,90,0.2)] group hover:scale-105">
              <Bell className="w-5 h-5 text-[#F8F5EE] group-hover:text-[#C49A5A] transition-colors" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-[#C49A5A]/20 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={showSignoutConfirm}
        onClose={() => setShowSignoutConfirm(false)}
        onConfirm={handleSignOut}
        title="Sign Out"
        description="Are you sure you want to sign out?"
        confirmText="Sign Out"
      />
    </div>
  );
}
