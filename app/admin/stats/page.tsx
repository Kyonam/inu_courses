'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ShoppingCart, 
  ArrowUpRight, 
  Download, 
  Filter, 
  BookOpen, 
  Trophy,
  RefreshCw,
  X,
  CreditCard,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// High-contrast premium color palette for charts
const COLORS = [
  '#4f46e5', // Indigo (Primary)
  '#10b981', // Emerald (Success)
  '#f59e0b', // Amber/Orange
  '#0ea5e9', // Sky Blue
  '#f43f5e', // Rose/Pink
  '#8b5cf6', // Violet
];

export default function AdminStatsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportRange, setExportRange] = useState({ start: '', end: '' });
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('통계 데이터 수신 실패');
      const data = await response.json();
      
      setOrders(data.orders || []);
      setOrderItems(data.orderItems || []);
      setCourses(data.courses || []);
    } catch (error: any) {
      console.error('Error fetching stats data:', error);
      toast.error('통계 데이터를 불러오지 못했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 1. Time-based Summaries
  const summaries = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());

    const stats = {
      today: 0,
      week: 0,
      month: 0,
      total: 0
    };

    orders.forEach(order => {
      if (order.status !== 'completed') return;
      const orderDate = new Date(order.ordered_at);
      const orderDateStr = order.ordered_at.split('T')[0];
      
      stats.total += order.total_price;
      if (orderDateStr === todayStr) stats.today += order.total_price;
      if (orderDate >= weekStart) stats.week += order.total_price;
      if (orderDate >= monthStart) stats.month += order.total_price;
    });

    return stats;
  }, [orders]);

  // 2. Monthly Trend (last 12 months)
  const chartData = useMemo(() => {
    const monthlyMap: Record<string, number> = {};
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    orders.forEach(order => {
      if (order.status !== 'completed') return;
      const monthKey = order.ordered_at.substring(0, 7);
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + order.total_price;
    });

    return last12Months.map(m => ({
      name: m,
      sales: monthlyMap[m] || 0
    }));
  }, [orders]);

  // 3. Sales by Category (Pie Chart)
  const categoryData = useMemo(() => {
    const revenueMap: Record<string, number> = {};
    const courseTypeMap: Record<number, string> = {};
    courses.forEach(c => {
      courseTypeMap[c.순번] = c.이수구분 || '기타';
    });

    orderItems.forEach(item => {
      const category = courseTypeMap[item.course_id] || '기타';
      revenueMap[category] = (revenueMap[category] || 0) + (item.price || 0);
    });

    return Object.entries(revenueMap).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [orderItems, courses]);

  // 4. TOP 10 Courses
  const topCourses = useMemo(() => {
    const courseStats: Record<number, { name: string, prof: string, count: number, total: number }> = {};
    
    orderItems.forEach(item => {
      if (!courseStats[item.course_id]) {
        courseStats[item.course_id] = { name: item.course_name, prof: item.professor, count: 0, total: 0 };
      }
      courseStats[item.course_id].count += 1;
      courseStats[item.course_id].total += (item.price || 0);
    });

    return Object.values(courseStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [orderItems]);

  const handleExportCSV = () => {
    // Since we already have all data in memory via the secure API, we can export directly
    const headers = ['주문날짜', '주문번호', '상태', '과목명', '교수명', '금액'];
    const filteredForExport = orders.filter(o => {
      if (!exportRange.start && !exportRange.end) return true;
      const date = new Date(o.ordered_at);
      if (exportRange.start && date < new Date(exportRange.start)) return false;
      if (exportRange.end) {
        const end = new Date(exportRange.end);
        end.setHours(23, 59, 59, 999);
        if (date > end) return false;
      }
      return true;
    });

    const rows: any[] = [];
    filteredForExport.forEach(order => {
      const items = orderItems.filter(item => item.order_id === order.id);
      items.forEach(item => {
        rows.push([
          new Date(order.ordered_at).toLocaleString(),
          order.id.substring(0, 8),
          order.status === 'completed' ? '결제완료' : order.status === 'cancelled' ? '취소됨' : '결제대기',
          item.course_name,
          item.professor,
          item.price
        ]);
      });
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.body.appendChild(document.createElement('a'));
    link.href = URL.createObjectURL(blob);
    link.download = `정산내역_${exportRange.start || '전체'}_${exportRange.end || '현재'}.csv`;
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
    toast.success('데이터 추출이 완료되었습니다.');
  };

  const formattedPrice = (price: number) => new Intl.NumberFormat('ko-KR', {
    style: 'currency', currency: 'KRW', maximumFractionDigits: 0
  }).format(price || 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-zinc-500 font-bold tracking-tight">수치를 분석 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
            <TrendingUp size={36} className="text-indigo-600" />
            정산 및 매출 현황
          </h1>
          <p className="text-zinc-500 font-medium text-lg mt-2">운영 성과를 분석하고 데이터를 추출하세요.</p>
        </div>
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download size={20} />
          정산 데이터 추출
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '오늘 매출', value: summaries.today, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
          { label: '이번 주 매출', value: summaries.week, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
          { label: '이번 달 매출', value: summaries.month, icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-600/10' },
          { label: '전체 누적 매출', value: summaries.total, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-600/10' },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-[#09090b] p-8 rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all">
             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", item.bg, item.color)}>
                <item.icon size={24} />
             </div>
             <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
             <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{formattedPrice(item.value)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white dark:bg-[#09090b] p-10 rounded-[40px] border border-zinc-200 dark:border-white/10 shadow-sm">
            <h3 className="text-xl font-black mb-8 tracking-tight flex items-center gap-2">
               <TrendingUp size={20} className="text-indigo-600" />
               월별 매출 추이
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#888' }} />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#888' }} tickFormatter={(value) => `${value/10000}만`} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    formatter={(value: any) => [formattedPrice(value), '매출']}
                  />
                  <Bar dataKey="sales" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white dark:bg-[#09090b] p-10 rounded-[40px] border border-zinc-200 dark:border-white/10 shadow-sm">
            <h3 className="text-xl font-black mb-8 tracking-tight flex items-center gap-2">
               <ShoppingCart size={20} className="text-emerald-500" />
               이수구분별 매출
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    formatter={(value: any) => [formattedPrice(value), '매출']}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
           <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
             <Trophy size={20} className="text-indigo-600" />
             인기 교과목 TOP 10
           </h3>
           <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">신청 건수 기준</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/[0.02]">
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">순위</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest">교과목명 / 담당교수</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">신청 횟수</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">총 수강매출</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5 font-bold text-[14px]">
              {topCourses.map((course, index) => (
                <tr key={index} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-6 text-center">
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black",
                      index === 0 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : 
                      index === 1 ? "bg-indigo-400 text-white" :
                      index === 2 ? "bg-indigo-300 text-white" : "bg-zinc-100 dark:bg-white/5 text-zinc-500"
                    )}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="space-y-0.5">
                      <p className="text-zinc-900 dark:text-white uppercase">{course.name}</p>
                      <p className="text-[11px] text-zinc-400">{course.prof}</p>
                    </div>
                  </td>
                  <td className="p-6 text-center text-zinc-900 dark:text-white">{course.count}건</td>
                  <td className="p-6 text-right text-zinc-900 dark:text-white font-black">{formattedPrice(course.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isExportModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsExportModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#09090b] rounded-[40px] shadow-2xl border border-zinc-200 dark:border-white/10 p-10 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-2 tracking-tight">정산 데이터 추출</h3>
            <p className="text-zinc-500 text-sm mb-8 font-medium">추출할 기간을 선택하세요. 미선택 시 전체 데이터를 추출합니다.</p>
            <div className="space-y-6 mb-10">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">시작일</label>
                <input 
                  type="date" value={exportRange.start}
                  onChange={(e) => setExportRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">종료일</label>
                <input 
                   type="date" value={exportRange.end}
                   onChange={(e) => setExportRange(prev => ({ ...prev, end: e.target.value }))}
                   className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsExportModalOpen(false)} className="flex-1 h-14 bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white rounded-2xl font-bold">취소</button>
              <button onClick={handleExportCSV} className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl font-black shadow-xl">추출하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const useCallback = require('react').useCallback;
