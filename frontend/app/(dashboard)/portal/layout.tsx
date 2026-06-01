'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TreePine, LayoutDashboard, Map, Sprout, TrendingUp, CreditCard,
  Bell, FileText, User, LogOut, Menu, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const navItems = [
  { href: '/portal', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/portal/land', label: 'My Land', icon: Map },
  { href: '/portal/plantation', label: 'Plantation Status', icon: Sprout },
  { href: '/portal/investment', label: 'My Investment', icon: TrendingUp },
  { href: '/portal/payments', label: 'Payment History', icon: CreditCard },
  { href: '/portal/documents', label: 'Documents', icon: FileText },
  { href: '/portal/notifications', label: 'Notifications', icon: Bell },
  { href: '/portal/profile', label: 'Profile', icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'customer')) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  useEffect(() => {
    if (profile) {
      supabase.from('notifications').select('id', { count: 'exact', head: true })
        .eq('recipient_id', profile.id).eq('is_read', false)
        .then(({ count }) => setUnread(count || 0));
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c8851e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || profile.role !== 'customer') return null;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    router.push('/login');
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex h-screen bg-[#f5f2ee] overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#e8e0d8] flex flex-col shadow-xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-[#e8e0d8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c8851e] to-[#e9be55] flex items-center justify-center">
              <TreePine className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display text-base font-semibold text-[#1a1a1a]">ArborVest</span>
              <span className="block text-[9px] text-[#c8851e] tracking-widest uppercase -mt-0.5">Investor Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const active = isActive(item);
            const isNotif = item.href === '/portal/notifications';
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-[#c8851e]/10 text-[#c8851e] border border-[#c8851e]/20'
                    : 'text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#faf6f2]'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#c8851e]' : ''}`} />
                <span className="flex-1">{item.label}</span>
                {isNotif && unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#c8851e] text-white text-[10px] flex items-center justify-center font-medium">{unread}</span>
                )}
                {active && <ChevronRight className="w-3 h-3 text-[#c8851e]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#e8e0d8]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#c8851e]/15 border border-[#c8851e]/20 flex items-center justify-center">
              <span className="text-[#c8851e] text-xs font-semibold">{profile.full_name?.[0] || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#1a1a1a] text-xs font-medium truncate">{profile.full_name || 'Investor'}</div>
              <div className="text-[#6b6b6b] text-[10px] truncate">{profile.email}</div>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="ghost" size="sm"
            className="w-full text-[#6b6b6b] hover:text-red-500 hover:bg-red-50 gap-2 justify-start">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#e8e0d8] px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#6b6b6b]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
            <span className="text-[#1a1a1a] font-medium">Portal</span>
            <ChevronRight className="w-3 h-3" />
            <span className="capitalize">{pathname.split('/').pop() || 'Overview'}</span>
          </div>
          <Link href="/portal/notifications" className="relative">
            <Bell className="w-5 h-5 text-[#6b6b6b] hover:text-[#c8851e] transition-colors" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c8851e] text-white text-[9px] flex items-center justify-center font-bold">{unread}</span>
            )}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#f5f2ee]">
          {children}
        </main>
      </div>
    </div>
  );
}
