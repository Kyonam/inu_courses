'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    courseCount: 0,
    userCount: 0, // This needs to be fetched from users API
    todayOrders: 0,
    monthRevenue: 0
  });
  const [lastLogin, setLastLogin] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats from secure API
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users')
      ]);

      if (!statsRes.ok || !usersRes.ok) throw new Error('데이터 통신 실패');
      
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayStats = statsData.orders.filter((o: any) => o.ordered_at.split('T')[0] === todayStr);
      const monthRevenue = statsData.orders
        .filter((o: any) => o.status === 'completed' && new Date(o.ordered_at) >= monthStart)
        .reduce((sum: number, o: any) => sum + (o.total_price || 0), 0);

      setStats({
        courseCount: statsData.courses.length,
        userCount: usersData.length,
        todayOrders: todayStats.length,
        monthRevenue: monthRevenue
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('대시보드 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Get last login from localStorage
    const savedLastLogin = localStorage.getItem('adminLastLogin');
    if (savedLastLogin) {
      setLastLogin(savedLastLogin);
    }
    // Update current login as last login for next time
    localStorage.setItem('adminLastLogin', new Date().toLocaleString());
  }, []);

  const formattedPrice = (price: number) => new Intl.NumberFormat('ko-KR', {
    style: 'currency', currency: 'KRW', maximumFractionDigits: 0
  }).format(price || 0);

  const summaryCards = [
    { label: '전체 교과목', value: `${stats.courseCount}개`, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-600/10', href: '/admin/courses' },
    { label: '전체 회원', value: `${stats.userCount}명`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-600/10', href: '/admin/users' },
    { label: '오늘 신청', value: `${stats.todayOrders}건`, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-600/10', href: '/admin/orders' },
    { label: '당월 매출', value: formattedPrice(stats.monthRevenue), icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-600/10', href: '/admin/stats' },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-600/20">System Admin</span>
             <div className="h-px w-8 bg-zinc-200 dark:bg-white/10" />
             <span className="text-[11px] font-bold text-zinc-400">마지막 접속: {lastLogin || '첫 접속'}</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
            안녕하세요, <span className="text-indigo-600">관리자님</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg mt-3">기초교육원 수강신청 시스템의 전반적인 상태를 한눈에 확인하세요.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white dark:bg-[#09090b] p-4 pr-10 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <RefreshCw size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Server Status</p>
                 <p className="text-sm font-black text-zinc-900 dark:text-white">정상 가동 중</p>
              </div>
           </div>
        </div>
      </header>

      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-white dark:bg-[#09090b] p-8 rounded-[36px] border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden">
               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", card.bg, card.color)}>
                  <card.icon size={28} />
               </div>
               <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1">{card.label}</p>
               <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{card.value}</h3>
               <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-zinc-300">
                  <ChevronRight size={24} />
               </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0f172a] p-10 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
              <div>
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Real-time Analytics Ready</span>
                </div>
                <h2 className="text-4xl font-black leading-tight tracking-tighter max-w-md">
                   데이터 기반의 <br />
                   정교한 플랫폼 운영을 <br />
                   시작해보세요.
                </h2>
              </div>
              <div className="flex items-center gap-4 mt-12">
                 <Link 
                   href="/admin/stats"
                   className="px-8 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30"
                 >
                   심층 통계 보러가기
                   <ArrowUpRight size={20} />
                 </Link>
                 <Link 
                   href="/admin/orders"
                   className="px-8 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black flex items-center gap-2 transition-all backdrop-blur-md"
                 >
                   신청 내역 확인
                 </Link>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-[#09090b] p-10 rounded-[48px] border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col justify-between">
           <div>
             <h3 className="text-xl font-black mb-10 tracking-tight flex items-center gap-3">
               <ShieldCheck size={24} className="text-indigo-600" />
               보안 및 권한 가이드
             </h3>
             <ul className="space-y-6">
                {[
                  { title: "인증 유지", desc: "sessionStorage 기반의 관리자 인증이 적용되어 있습니다.", icon: Clock },
                  { title: "서버 사이드 보안", desc: "모든 데이터 처리는 Service Role 기반 API를 경유합니다.", icon: LockIcon },
                  { title: "변경 관리", desc: "모든 데이터 삭제 시에는 2차 확인 절차를 거칩니다.", icon: ShieldCheck },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                     <div className="mt-1">
                        <item.icon size={16} className="text-zinc-400" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{item.title}</p>
                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                     </div>
                  </li>
                ))}
             </ul>
           </div>
           
           <div className="mt-10 p-6 bg-zinc-50 dark:bg-white/5 rounded-3xl border border-zinc-100 dark:border-white/5">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Technical Engine</p>
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-black text-sm">
                 <div className="w-5 h-5 bg-indigo-600 rounded-lg" />
                 Next.js 16 + Supabase Admin
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// Simple fallback for missing Lucide icon during migration
function LockIcon({ size, className }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
