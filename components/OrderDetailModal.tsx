'use client';

import { FileText, X, Calendar, User, GraduationCap, DollarSign, Clock, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Course } from '@/types/course';
import { CourseDetailModal } from './CourseDetailModal';

interface OrderItem {
  course_id: number;
  course_name: string;
  professor: string;
  credits: number;
  price: number;
}

interface Order {
  id: string;
  ordered_at: string;
  total_credits: number;
  total_price: number;
  status: string;
  order_items: OrderItem[];
}

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isFetchingCourse, setIsFetchingCourse] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  const handleCourseClick = async (courseId: number) => {
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

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#09090b] rounded-[32px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10 animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-6 border-b border-zinc-100 dark:border-white/5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                수강신청 상세
              </span>
              <span className="text-zinc-400 text-xs font-mono">#{order.id}</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">신청 내역 확인</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} className="text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Summary Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Ordered At</span>
              </div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{formatDate(order.ordered_at)}</p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
              </div>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">신청완료 (Completed)</p>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest px-1">신청 교과목</h3>
            <div className="divide-y divide-zinc-100 dark:divide-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-inner bg-zinc-50/30 dark:bg-black/20">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div 
                    key={`${order.id}-${item.course_id}`}
                    className="p-5 bg-white dark:bg-[#09090b] hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
                    onClick={() => handleCourseClick(item.course_id)}
                   >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight">
                            {item.course_name}
                          </span>
                          <Info size={14} className="text-zinc-300 group-hover:text-blue-400 transition-colors shrink-0" />
                        </div>
                        <div className="flex items-center gap-5 text-[12px] font-medium text-zinc-500">
                          <span className="flex items-center gap-1.5 italic"><User size={12} className="text-zinc-400"/> {item.professor} 교수</span>
                          <span className="flex items-center gap-1.5"><GraduationCap size={12} className="text-blue-500/70"/> <b className="text-blue-600 dark:text-blue-400">{item.credits}학점</b></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-zinc-900 dark:text-white">{formattedPrice(item.price)}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Amount</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-white dark:bg-[#0b0b0d]">
                   <Info size={32} className="mx-auto text-zinc-300 mb-4" />
                   <p className="text-zinc-500 font-bold tracking-tight">과목 상세 내역이 존재하지 않습니다.</p>
                   <p className="text-zinc-400 text-xs mt-1">결제는 성공했으나 신청 정보 기록 중 지연이 발생했을 수 있습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Totals */}
          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[28px] border border-blue-100 dark:border-blue-900/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">Total Credits</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400">{order.total_credits}학점</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">Total Amount</span>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                {formattedPrice(order.total_price)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4">
          <button 
            onClick={onClose}
            className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-all active:scale-95 shadow-xl"
          >
            확인
          </button>
        </div>
      </div>

      {/* Reusable Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          showCartButton={false}
        />
      )}

      {/* Loading Overlay for Course Fetching */}
      {isFetchingCourse && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>,
    document.body
  );
}
