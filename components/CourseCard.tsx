'use client';

import { useState } from 'react';
import { Course } from '@/types/course';
import { User, Clock, Users, GraduationCap, Star, Plus, Info, Check, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { CourseDetailModal } from './CourseDetailModal';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [isActionLoading, setIsActionLoading] = useState(false);

  const inCart = isInCart(course.순번);
  const formattedPrice = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(course.수강가격 || 0);

  const handleCartAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <>
      <div className="group flex flex-col bg-white dark:bg-[#09090b] rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 overflow-hidden h-full">
        {/* Top Section with Category and Detail Button */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
            {course.이수영역 || course.이수구분}
          </span>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-zinc-50 dark:bg-white/5 rounded-full shadow-xs"
            title="자세히 보기"
          >
            <Info size={16} />
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Course Name */}
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            {course.교과목명}
          </h3>

          {/* Divider */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent mb-5" />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            {/* Professor */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <User size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Professor</span>
              </div>
              <p className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                {course.담당교수 || '미지정'}
              </p>
            </div>

            {/* Credits */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <GraduationCap size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Credits</span>
              </div>
              <p className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">
                {course.학점}학점
              </p>
            </div>

            {/* Schedule */}
            <div className="space-y-1 col-span-2">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Schedule</span>
              </div>
              <p className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-1">
                {course["시간표(교시)"] || '시간표 정보 없음'}
              </p>
            </div>

            {/* Capacity */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Users size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Capacity</span>
              </div>
              <p className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">
                {course.정원}명
              </p>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <DollarSign size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Price</span>
              </div>
              <p className="text-[13px] font-bold text-blue-600 dark:text-blue-400">
                {formattedPrice}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-[11px] font-bold px-2 py-1 bg-zinc-100 dark:bg-white/5 rounded w-fit text-zinc-600 dark:text-zinc-400">
              <Star size={12} />
              <span>성적평가: {course.성적평가}</span>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleCartAction}
            disabled={isActionLoading}
            className={cn(
              "group/btn relative w-full h-12 flex items-center justify-center gap-2 rounded-2xl text-[14px] font-bold transition-all duration-300 active:scale-95 shadow-lg",
              inCart 
                ? "bg-blue-600 text-white shadow-blue-500/30" 
                : "bg-[#09090b] dark:bg-white text-white dark:text-black shadow-black/10"
            )}
          >
            {isActionLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : inCart ? (
              <>
                <Check size={18} />
                <span>담기 완료</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>장바구니 담기</span>
              </>
            )}
          </button>
        </div>
      </div>

      <CourseDetailModal 
        course={course} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
