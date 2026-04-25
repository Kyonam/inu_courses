'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  CreditCard,
  ExternalLink,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  course_name: string;
  professor: string;
  credits: number;
  price: number;
}

interface OrderWithDetails {
  id: string;
  user_id: string;
  ordered_at: string;
  total_credits: number;
  total_price: number;
  status: string;
  toss_order_id: string;
  users: {
    full_name: string;
    email: string;
  } | null;
  items?: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('API 호출 실패');
      const data = await response.json();
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('주문 내역을 불러오지 못했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleOrder = async (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
      const orderIdx = orders.findIndex(o => o.id === orderId);
      if (orders[orderIdx] && !orders[orderIdx].items) {
        try {
          const response = await fetch(`/api/admin/orders/${orderId}`);
          if (!response.ok) throw new Error('항목 조회 실패');
          const items = await response.json();
          
          if (items) {
            const updatedOrders = [...orders];
            updatedOrders[orderIdx] = { ...updatedOrders[orderIdx], items };
            setOrders(updatedOrders);
          }
        } catch (err) {
          toast.error('상세 항목을 불러오지 못했습니다.');
        }
      }
    }
    setExpandedOrders(newExpanded);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!confirm(`주문 상태를 변경하시겠습니까?`)) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('변경 실패');
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('주문 상태가 변경되었습니다.');
    } catch (error: any) {
      toast.error('상태 변경 실패: ' + error.message);
    }
  };

  const downloadCSV = () => {
    const headers = ['주문번호', '신청자', '이메일', '신청일시', '총학점', '총금액', '상태'];
    const rows = filteredOrders.map(o => [
      o.id.substring(0, 8),
      o.users?.full_name || '알 수 없음',
      o.users?.email || '-',
      new Date(o.ordered_at).toLocaleString('ko-KR'),
      o.total_credits,
      o.total_price,
      o.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.body.appendChild(document.createElement('a'));
    link.href = URL.createObjectURL(blob);
    link.download = `수강신청내역_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.users?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && new Date(order.ordered_at) >= new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && new Date(order.ordered_at) <= end;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const formattedPrice = (price: number) => new Intl.NumberFormat('ko-KR', {
    style: 'currency', currency: 'KRW', maximumFractionDigits: 0
  }).format(price || 0);

  return (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
            <FileText size={36} className="text-indigo-600" />
            수강신청 내역 조회
          </h1>
          <p className="text-zinc-500 font-medium text-lg mt-2">전체 {filteredOrders.length}건의 주문 내역이 검색되었습니다.</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="h-14 px-8 bg-emerald-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download size={20} />
          엑셀 다운로드 (CSV)
        </button>
      </header>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="신청자명 또는 주문번호 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 font-bold text-zinc-900 dark:text-white focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-14 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 font-bold text-zinc-900 dark:text-white focus:border-indigo-500 outline-none transition-all appearance-none shadow-sm"
          >
            <option value="all">전체 상태</option>
            <option value="completed">결제완료</option>
            <option value="pending">결제대기</option>
            <option value="cancelled">취소됨</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 h-14 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 font-bold text-zinc-900 dark:text-white focus:border-indigo-500 outline-none shadow-sm text-sm"
          />
          <span className="text-zinc-400 font-black">~</span>
          <input 
            type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 h-14 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-2xl px-4 font-bold text-zinc-900 dark:text-white focus:border-indigo-500 outline-none shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/[0.02]">
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest">주문번호</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">신청자</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest">신청일시</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">학점</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">결제금액</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">상태</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">상태 변경</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5 font-bold">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                      <p className="text-zinc-500">주문 내역을 동기화 중입니다...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center text-zinc-500">조건에 맞는 주문 내역이 없습니다.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <Fragment key={order.id}>
                    <tr 
                      className={cn(
                        "hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer group",
                        expandedOrders.has(order.id) && "bg-indigo-50/30 dark:bg-indigo-600/5 shadow-inner"
                      )}
                      onClick={() => toggleOrder(order.id)}
                    >
                      <td className="p-6 font-mono text-[13px] text-zinc-400 group-hover:text-indigo-600 flex items-center gap-3 transition-colors">
                        {expandedOrders.has(order.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {order.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-zinc-900 dark:text-white">{order.users?.full_name || '알 수 없음'}</span>
                          <span className="text-[10px] text-zinc-400 font-medium">{order.users?.email}</span>
                        </div>
                      </td>
                      <td className="p-6 text-zinc-500 text-[13px]">
                        {new Date(order.ordered_at).toLocaleString('ko-KR', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="p-6 text-center text-zinc-900 dark:text-white">{order.total_credits}</td>
                      <td className="p-6 text-right text-zinc-900 dark:text-white font-black">{formattedPrice(order.total_price)}</td>
                      <td className="p-6 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto w-fit",
                          order.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" : 
                          order.status === 'cancelled' ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                        )}>
                          {order.status === 'completed' && <><CheckCircle2 size={12} /> 결제완료</>}
                          {order.status === 'cancelled' && <><XCircle size={12} /> 취소됨</>}
                          {order.status === 'pending' && <><Clock size={12} /> 결제대기</>}
                        </span>
                      </td>
                      <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-zinc-100 dark:bg-white/5 border-none rounded-xl px-3 py-1.5 text-[11px] font-black focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer outline-none"
                        >
                          <option value="pending">결제대기</option>
                          <option value="completed">결제완료</option>
                          <option value="cancelled">취소됨</option>
                        </select>
                      </td>
                    </tr>
                    
                    {expandedOrders.has(order.id) && (
                      <tr className="bg-zinc-50/80 dark:bg-white/[0.02]">
                        <td colSpan={7} className="p-8">
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                             <div className="flex items-center gap-3 mb-6">
                               <div className="h-8 w-1 bg-indigo-600 rounded-full" />
                               <h3 className="text-lg font-black tracking-tight">수강 신청 과목 상세</h3>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {order.items ? (
                                 order.items.map((item) => (
                                   <div key={item.id} className="bg-white dark:bg-[#0c0c0e] p-6 rounded-[24px] border border-zinc-200 dark:border-white/5 shadow-sm flex items-center justify-between group">
                                     <div className="space-y-1">
                                       <p className="text-zinc-900 dark:text-white font-black group-hover:text-indigo-600 transition-colors uppercase">{item.course_name}</p>
                                       <div className="flex items-center gap-3 text-xs text-zinc-500">
                                         <span className="flex items-center gap-1"><User size={12} /> {item.professor}</span>
                                         <span className="flex items-center gap-1"><CreditCard size={12} /> {item.credits}학점</span>
                                       </div>
                                     </div>
                                     <p className="font-mono text-sm text-zinc-900 dark:text-white">{formattedPrice(item.price)}</p>
                                   </div>
                                 ))
                               ) : (
                                 <div className="col-span-2 py-10 flex flex-col items-center gap-3">
                                   <RefreshCw className="animate-spin text-zinc-300" />
                                   <p className="text-zinc-400 text-sm">항목을 불러오는 중...</p>
                                 </div>
                               )}
                             </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
