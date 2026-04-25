'use client';

import { Sidebar } from '@/components/Sidebar';
import { FileText, ChevronRight, Home, GraduationCap, DollarSign, User, Calendar, BookOpen, ShoppingCart, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LoginButton } from '@/components/LoginButton';
import { CartButton } from '@/components/CartButton';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OrderDetailModal } from '@/components/OrderDetailModal';
import { CourseDetailModal } from '@/components/CourseDetailModal';
import { Course } from '@/types/course';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  course_id: number;
  course_name: string;
  professor: string;
  credits: number;
  price: number;
}

interface Order {
  id: string;
  user_id: string;
  ordered_at: string;
  total_credits: number;
  total_price: number;
  status: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isFetchingCourse, setIsFetchingCourse] = useState(false);
  const supabase = createClient();

  const handleCourseClick = async (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the order card click
    setIsFetchingCourse(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('순번', courseId)
        .single();

      if (error) throw error;
      setSelectedCourse(data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setIsFetchingCourse(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Card click prevention

    if (!confirm('정말로 이 수강 신청 내역을 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success('수강 신청 내역이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('내역 삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('ordered_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        router.replace('/');
      } else {
        fetchOrders();
      }
    }
  }, [user, authLoading, router, supabase]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f9fa] dark:bg-[#000000]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formattedPrice = (price: number) => new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price || 0);

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateStr));
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] dark:bg-[#000000] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
        <div className="max-w-[1000px] mx-auto">
          {/* Breadcrumb & Profile Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-[11px] font-bold text-zinc-400 hover:text-blue-600 flex items-center gap-1 transition-colors uppercase tracking-widest">
                <Home size={12} />
                Home
              </Link>
              <ChevronRight size={12} className="text-zinc-300" />
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">수강신청 내역</span>
            </div>
            <div className="flex items-center gap-3">
              <CartButton />
              <LoginButton />
            </div>
          </div>

          <header className="mb-12 px-2">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
              <CheckCircle2 className="text-blue-600" size={36} />
              수강신청 내역
            </h1>
            <p className="text-zinc-500 mt-2 text-lg font-medium">인천대학교 교양 과목 수강신청 내역을 확인하세요.</p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-500 font-medium tracking-tight">수강 내역을 가져오고 있습니다...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-white/5 rounded-[40px] border border-dashed border-zinc-200 dark:border-white/10">
              <div className="w-20 h-20 bg-zinc-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-700 mb-6">
                <FileText size={40} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">아직 수강신청 내역이 없습니다.</h2>
              <p className="text-zinc-500 mb-8 max-w-xs text-center font-medium leading-relaxed">
                관심 있는 과목을 찾아 장바구니에 담고 <br />
                수강 신청을 완료해 보세요.
              </p>
              <Link
                href="/"
                className="bg-[#09090b] dark:bg-white text-white dark:text-black px-10 h-14 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center"
              >
                교과목 둘러보기
              </Link>
            </div>
          ) : (
            <div className="space-y-8 pb-32">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white dark:bg-[#09090b] rounded-[32px] border border-zinc-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer group"
                >
                  {/* Order Header */}
                  <div className="p-6 lg:p-8 bg-zinc-50/50 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Order ID</span>
                        <p className="text-sm font-mono font-bold text-zinc-600 dark:text-zinc-300">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="h-8 w-px bg-zinc-200 dark:bg-white/10" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ordered At</span>
                        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                          <Calendar size={14} className="text-blue-500" />
                          {formatDate(order.ordered_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 bg-blue-500 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
                        {order.status === 'completed' ? '신청완료' : order.status}
                      </span>
                      <button
                        onClick={(e) => handleDeleteOrder(order.id, e)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                        title="신청 내역 삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-0 border-b border-zinc-100 dark:border-white/5">
                    <div className="divide-y divide-zinc-100 dark:divide-white/5">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="p-6 lg:p-8 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors cursor-pointer group/item text-left"
                            onClick={(e) => handleCourseClick(item.course_id, e)}
                          >
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight group-hover/item:text-blue-600 transition-colors">
                                {item.course_name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-zinc-500">
                                <div className="flex items-center gap-1.5">
                                  <User size={14} className="text-zinc-400" />
                                  <span className="text-zinc-600 dark:text-zinc-400">{item.professor || '미지정'} 교수</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <GraduationCap size={14} className="text-zinc-400" />
                                  <span className="text-blue-600/80 dark:text-blue-400/80 font-bold">{item.credits}학점</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <div className="hidden sm:block text-right">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Amount</p>
                                <p className="font-bold text-zinc-900 dark:text-white">{formattedPrice(item.price)}</p>
                              </div>
                              <ChevronRight size={18} className="text-zinc-300 group-hover/item:text-blue-500 transition-all group-hover/item:translate-x-1" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Info size={24} className="text-zinc-300 mb-2" />
                            <p className="text-zinc-400 font-bold tracking-tight">기록된 상세 과목 정보가 없습니다.</p>
                            <p className="text-zinc-300 text-[12px] font-medium tracking-tight">수강 신청 처리 중 문제가 발생했을 수 있습니다. 기초교육원으로 문의해 주세요.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Footer - Summary */}
                  <div className="p-6 lg:p-8 bg-zinc-50/30 dark:bg-white/[0.01] flex items-center justify-end gap-12">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Total Credits</span>
                      <span className="text-xl font-black text-zinc-900 dark:text-white">{order.total_credits}학점</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Payment</span>
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                        {formattedPrice(order.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          showCartButton={false}
        />
      )}

      {isFetchingCourse && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
