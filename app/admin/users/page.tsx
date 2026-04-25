'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  Users, 
  Mail, 
  Calendar, 
  TrendingUp, 
  ShoppingCart, 
  ChevronRight, 
  Clock, 
  X, 
  FileText,
  User as UserIcon,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UserWithStats {
  id: string;
  email: string;
  full_name: string;
  updated_at: string;
  orderCount: number;
  totalSpent: number;
}

interface MemberDetailOrder {
  id: string;
  ordered_at: string;
  total_price: number;
  status: string;
  order_items: {
    course_name: string;
  }[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [userOrders, setUserOrders] = useState<MemberDetailOrder[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('API 호출 실패');
      const data = await response.json();
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('회원 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserOrders = async (userId: string) => {
    setModalLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/orders`);
      if (!response.ok) throw new Error('활동 내역 조회 실패');
      const data = await response.json();
      setUserOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching user orders:', error);
      toast.error('회원 활동 내역을 불러오지 못했습니다.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUserClick = (user: UserWithStats) => {
    setSelectedUser(user);
    fetchUserOrders(user.id);
  };

  const filteredUsers = users.filter(user => 
    (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedPrice = (price: number) => new Intl.NumberFormat('ko-KR', {
    style: 'currency', currency: 'KRW', maximumFractionDigits: 0
  }).format(price || 0);

  return (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
            <Users size={36} className="text-indigo-600" />
            회원 관리
          </h1>
          <p className="text-zinc-500 font-medium text-lg mt-2">전체 {users.length}명의 회원이 등록되어 있습니다.</p>
        </div>
      </header>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="이름 또는 이메일로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-16 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-3xl pl-16 pr-6 text-lg font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/[0.02]">
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest">수강생 정보</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest">가입일시</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">수강완료 횟수</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">총 결제금액</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5 font-bold">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                      <p className="text-zinc-500">회원 데이터를 집계 중입니다...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-zinc-500">검색된 회원이 없습니다.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer group"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600/10 group-hover:text-indigo-600 transition-all">
                           <UserIcon size={20} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase">{user.full_name || '이름 없음'}</p>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-zinc-500 text-[13px]">
                      {new Date(user.updated_at).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingCart size={14} className="text-zinc-300" />
                        <span className="text-zinc-900 dark:text-white">{user.orderCount}회</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                         <span className="text-zinc-900 dark:text-white">{formattedPrice(user.totalSpent)}</span>
                         <div className="w-12 h-1 bg-zinc-100 dark:bg-white/5 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${Math.min((user.totalSpent / 500000) * 100, 100)}%` }} />
                         </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                       <button className="p-2 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                         <ChevronRight size={20} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedUser(null)} />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#09090b] rounded-[40px] shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-8 pb-6 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">회원 활동 상세</h2>
                  <p className="text-zinc-500 text-sm font-medium">{selectedUser.full_name} ({selectedUser.email})</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-400">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
               {modalLoading ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-4">
                   <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                   <p className="text-zinc-500 font-bold">활동 이력을 불러오는 중...</p>
                 </div>
               ) : userOrders.length === 0 ? (
                 <div className="py-20 text-center text-zinc-500 font-medium">
                   아직 신청한 수강 내역이 없습니다.
                 </div>
               ) : (
                 <div className="space-y-6">
                   <div className="flex items-center gap-2 mb-4">
                     <Clock size={16} className="text-indigo-600" />
                     <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">수강신청 타임라인</h3>
                   </div>
                   
                   <div className="space-y-4">
                     {userOrders.map((order) => (
                       <div key={order.id} className="relative pl-8 border-l border-zinc-100 dark:border-white/5 pb-6 last:pb-0">
                         <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-600 border-4 border-white dark:border-[#09090b] ring-1 ring-indigo-600" />
                         <div className="bg-zinc-50 dark:bg-white/[0.02] p-6 rounded-[28px] border border-zinc-100 dark:border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[12px] text-zinc-400 font-bold mb-1">
                                  {new Date(order.ordered_at).toLocaleString('ko-KR', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                                <p className="text-zinc-900 dark:text-white font-black text-lg">주문 #{order.id.substring(0, 8).toUpperCase()}</p>
                              </div>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter",
                                order.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                              )}>
                                {order.status === 'completed' ? '결제완료' : order.status === 'cancelled' ? '취소됨' : '결제대기'}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                               {(order.order_items || []).map((item, idx) => (
                                 <div key={idx} className="px-3 py-1 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                   {item.course_name}
                                 </div>
                               ))}
                            </div>
                            
                            <div className="flex justify-end pt-2">
                              <p className="text-zinc-900 dark:text-white font-black text-lg">{formattedPrice(order.total_price)}</p>
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-zinc-100 dark:border-white/5">
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black transition-all shadow-xl active:scale-[0.98]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
