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
      <div className="min-h-screen bg-[#0a1f0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" />
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
    <div className="flex h-screen bg-[#0f0f0a] overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-[#0a1f0a] border-r border-[#c8851e]/15 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#c8851e]/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c8851e] to-[#e9be55] flex items-center justify-center">
              <TreePine className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display text-base font-semibold text-white">Chandan Nilayam</span>
              <span className="block text-[9px] text-[#c8851e] tracking-widest uppercase -mt-0.5">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const active = isActive(item) || (item.exact && pathname === item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                  active
                    ? 'bg-[#c8851e]/15 text-[#e9be55] border border-[#c8851e]/25'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#e9be55]' : ''}`} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3 text-[#c8851e]" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#c8851e]/15">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#c8851e]/20 border border-[#c8851e]/30 flex items-center justify-center">
              <span className="text-[#e9be55] text-xs font-semibold">
                {profile.full_name?.[0] || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{profile.full_name || 'Admin'}</div>
              <div className="text-white/40 text-[10px] truncate">{profile.email}</div>
            </div>
          </div>
          <Button
            onClick={() => setShowSignoutConfirm(true)}
            variant="ghost"
            size="sm"
            className="w-full text-white/50 hover:text-red-400 hover:bg-red-400/10 gap-2 justify-start"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-[#0f0f0a] border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span className="text-white font-medium">Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/40 text-xs hidden md:block">System Operational</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#0f0f0a]">
          {children}
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
