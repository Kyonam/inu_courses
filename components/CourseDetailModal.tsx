'use client';

import { Course } from '@/types/course';
import { User, GraduationCap, Clock, MapPin, Users, DollarSign, BookOpen, Star, Globe, X, Plus, Trash2, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface CourseDetailModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  showCartButton?: boolean;
}

export function CourseDetailModal({ course, isOpen, onClose, showCartButton = true }: CourseDetailModalProps) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const inCart = isInCart(course.순번);

  if (!isOpen) return null;

  const formattedPrice = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(course.수강가격 || 0);

  const handleCartAction = async () => {
    setIsActionLoading(true);
    try {
      if (inCart) {
        await removeFromCart(course.순번);
      } else {
        await addToCart(course);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#09090b] rounded-[32px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10 animate-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="p-8 pb-0 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                {course.이수구분} • {course.이수영역}
              </span>
              {course.원어강의 !== 'N' && (
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Globe size={10} />
                  {course.원어강의}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
              {course.교과목명}
            </h2>
            <p className="text-zinc-500 mt-1">{course["교과목명(영문)"]}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} className="text-zinc-400" />
          </button>
        </div>

        {/* Modal Content - Bento Grid Style */}
        <div className="p-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailBox icon={<User size={16}/>} label="담당교수" value={course.담당교수 || '미지정'} />
            <DetailBox icon={<GraduationCap size={16}/>} label="학점 (이론/실습)" value={`${course.학점}학점 (${course.이론}/${course.실습})`} />
            <DetailBox icon={<Clock size={16}/>} label="시간표 (교시)" value={course["시간표(교시)"]} />
            <DetailBox icon={<MapPin size={16}/>} label="강의실" value={course.강의실 || '정보 없음'} />
            <DetailBox icon={<Users size={16}/>} label="정원 / 수업구분" value={`${course.정원}명 / ${course.수업구분}`} />
            <DetailBox icon={<DollarSign size={16}/>} label="수강가격 / 단가" value={`${formattedPrice} / ${course.단가.toLocaleString()}원`} />
            <DetailBox icon={<BookOpen size={16}/>} label="학수번호" value={course.학수번호} />
            <DetailBox icon={<Star size={16}/>} label="성적평가 / 수업유형" value={`${course.성적평가} / ${course.수업유형}`} />
          </div>

          <div className="mt-8 flex gap-4">
            {showCartButton && (
              <button 
                onClick={handleCartAction}
                disabled={isActionLoading}
                className={cn(
                  "flex-1 h-14 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2",
                  inCart
                    ? "bg-blue-600 text-white shadow-blue-500/20"
                    : "bg-[#09090b] dark:bg-white text-white dark:text-black shadow-black/10"
                )}
              >
                {isActionLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : inCart ? (
                  <>
                    <Check size={20} />
                    담기 완료
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    장바구니 담기
                  </>
                )}
              </button>
            )}
            <button 
              onClick={onClose}
              className="px-8 h-14 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white rounded-2xl font-bold transition-all active:scale-95"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function DetailBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
      <div className="flex items-center gap-2 text-zinc-400 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">{value}</p>
    </div>
  );
}
