'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, LogOut, LayoutDashboard, BookOpen, Users, Settings, FileText, Home, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if running on client side
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth');
      
      if (auth !== 'true') {
        toast.error('관리자 권한이 필요합니다.');
        router.replace('/');
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    toast.info('관리자 로그아웃 되었습니다.');
    router.replace('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#09090b]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const adminMenuItems = [
    { name: '대시보드', href: '/admin', icon: LayoutDashboard },
    { name: '교과목 관리', href: '/admin/courses', icon: BookOpen },
    { name: '수강신청 내역 조회', href: '/admin/orders', icon: FileText },
    { name: '회원 관리', href: '/admin/users', icon: Users },
    { name: '정산 및 매출 현황', href: '/admin/stats', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#000000] flex flex-col">
      {/* Admin Header - Dark Navy Theme */}
      <header className="h-[64px] bg-[#0f172a] text-white flex items-center justify-between px-8 sticky top-0 z-[100] border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/20">
            <ShieldCheck size={20} className="text-indigo-400" />
          </div>
          <h1 className="text-lg font-black tracking-tighter">기초교육원 관리자</h1>
          <span className="ml-2 px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-zinc-400 border border-white/5 uppercase tracking-tighter">Control Panel</span>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Home size={14} />
            메인으로 돌아가기
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-all"
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Admin Sidebar */}
        <aside className="w-[280px] bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-white/10 flex flex-col fixed left-0 top-[64px] bottom-0 z-40">
          <div className="p-6">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 px-4">Menu Management</p>
            <nav className="space-y-1">
              {adminMenuItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group",
                    pathname === item.href 
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                  )}
                >
                  <item.icon size={18} className={cn(
                    "transition-colors",
                    pathname === item.href ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                  )} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-8 bg-zinc-50 dark:bg-white/[0.01] border-t border-zinc-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">System Status OK</span>
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 ml-[280px] p-10 lg:p-14 min-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-[1200px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
