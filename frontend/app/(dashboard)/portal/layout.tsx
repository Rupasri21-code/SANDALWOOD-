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
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/confirm-modal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'investor')) {
      router.push('/login');
    }
  }, [profile, loading, router]);

  useEffect(() => {
    if (profile) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              const unreadCount = data.data.filter((n: any) => !n.is_read).length;
              setUnread(unreadCount);
            }
          })
          .catch(err => console.error('Failed to fetch unread notifications', err));
      }
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#10140E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C49A5A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || profile.role !== 'investor') return null;

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
    <div className="flex h-screen bg-[#10140E] overflow-hidden font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-[#06261C] border-r border-white/5 flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C49A5A] bg-[#0B2F24] flex items-center justify-center">
              <TreePine className="w-5 h-5 text-[#C49A5A]" />
            </div>
            <div>
              <span className="font-display text-base font-bold text-[#F7F0E4] tracking-wide">Chandan Nilayam</span>
              <span className="block text-[9px] text-[#C49A5A] tracking-[0.2em] uppercase mt-0.5">Investor Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {navItems.map((item) => {
            const active = isActive(item);
            const isNotif = item.href === '/portal/notifications';
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-[rgba(196,154,90,0.15)] to-transparent text-[#C49A5A] border border-[rgba(196,154,90,0.3)]'
                    : 'text-[#B8B8A8] hover:text-[#F7F0E4] hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-[#C49A5A]' : 'text-[#B8B8A8] group-hover:text-[#F7F0E4]'}`} strokeWidth={active ? 2 : 1.5} />
                <span className={`flex-1 ${active ? 'font-medium' : ''}`}>{item.label}</span>
                {isNotif && unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C49A5A] text-[#06261C] text-[10px] flex items-center justify-center font-bold">{unread}</span>
                )}
                {active && <ChevronRight className="w-4 h-4 text-[#C49A5A] opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#12372A] border border-[#C49A5A]/40 flex items-center justify-center">
              <span className="text-[#C49A5A] text-sm font-bold">{profile.full_name?.[0] || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#F7F0E4] text-sm font-medium truncate">{profile.full_name || 'Investor'}</div>
              <div className="text-[#B8B8A8] text-[11px] truncate">{profile.email}</div>
            </div>
          </div>
          <Button onClick={() => setShowSignoutConfirm(true)} variant="ghost" className="w-full h-11 text-[#B8B8A8] hover:text-red-400 hover:bg-red-500/10 gap-2 justify-start rounded-xl font-medium">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#10140E]">
        <header className="bg-[#10140E] border-b border-white/5 px-8 py-5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#B8B8A8] hover:text-[#F7F0E4] transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-sm text-[#B8B8A8]">
              <span className="text-[#F7F0E4] font-medium tracking-wide">Portal</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="capitalize text-[#C49A5A] font-medium">{pathname.split('/').pop() || 'Overview'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              System Operational
            </div>
            <Link href="/portal/notifications" className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
              <Bell className="w-5 h-5 text-[#F7F0E4]" />
              {unread > 0 && (
                <span className="absolute 0 right-0 w-2.5 h-2.5 rounded-full bg-[#C49A5A] border-2 border-[#10140E]" />
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
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
