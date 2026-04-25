'use client';

import { Sidebar } from '@/components/Sidebar';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingCart, ChevronRight, GraduationCap, DollarSign, BookOpen, Clock, Home, User, CreditCard, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CourseDetailModal } from '@/components/CourseDetailModal';
import { LoginButton } from '@/components/LoginButton';
import { OrderButton } from '@/components/OrderButton';
import { CartButton } from '@/components/CartButton';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { PaymentInfoModal } from '@/components/PaymentInfoModal';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

export default function CartPage() {
  const { cartItems, cartCount, totalCredits, totalPrice, removeFromCart, clearCart, loading: cartLoading, setIsLoginModalOpen } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

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

  const handleClearCart = () => {
    if (confirm('장바구니의 모든 과목을 삭제하시겠습니까?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (!user || cartCount === 0 || isSubmitting) return;
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (customerData: { name: string; email: string }) => {
    if (!user || cartCount === 0 || isSubmitting) return;

    setIsPaymentModalOpen(false);
    setIsSubmitting(true);

    try {
      // 1. Initialize Toss Payments
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        throw new Error('토스 결제 클라이언트 키가 설정되지 않았습니다.');
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({
        customerKey: user.id, // Current user's unique ID
      });

      // 2. Request Payment (Redirect mode)
      const orderId = `INU-${Date.now()}`;
      
      await payment.requestPayment({
        method: "CARD", // Defaulting to Card for now
        amount: {
          currency: "KRW",
          value: totalPrice,
        },
        orderId,
        orderName: "인천대학교 기초교육원 교양 교과목 결제",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: customerData.email,
        customerName: customerData.name,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });

    } catch (error) {
      console.error('Payment request error:', error);
      toast.error('결제 준비 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] dark:bg-[#000000] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto">
          {/* Breadcrumb & Profile Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-[11px] font-bold text-zinc-400 hover:text-blue-600 flex items-center gap-1 transition-colors uppercase tracking-widest">
                <Home size={12} />
                Home
              </Link>
              <ChevronRight size={12} className="text-zinc-300" />
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">장바구니</span>
            </div>
            <div className="flex items-center gap-3">
              <OrderButton />
              <LoginButton />
            </div>
          </div>

          <header className="mb-10 px-2">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
              <ShoppingCart className="text-blue-600" size={36} />
              장바구니
            </h1>
            <p className="text-zinc-500 mt-2 text-lg font-medium">인천대학교 교양 과목 목록을 확인하세요.</p>
          </header>

          {cartLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-500 font-medium">로딩 중...</p>
            </div>
          ) : cartCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-white/5 rounded-[40px] border border-dashed border-zinc-200 dark:border-white/10">
              <div className="w-20 h-20 bg-zinc-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-700 mb-6">
                <ShoppingCart size={40} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">장바구니가 비어 있습니다</h2>
              <p className="text-zinc-500 mb-8 max-w-xs text-center font-medium leading-relaxed">
                인천대학교 교양 역량을 확인하고 <br />
                핵심 역량을 키워보세요.
              </p>
              <Link 
                href="/" 
                className="bg-[#09090b] dark:bg-white text-white dark:text-black px-10 h-14 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center"
              >
                교과목 둘러보기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 pb-20">
              {/* Left Side: Course List (2/3) */}
              <div className="lg:w-2/3 space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.순번}
                    className="group bg-white dark:bg-[#09090b] rounded-[24px] border border-zinc-200 dark:border-white/10 p-6 flex gap-6"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-tight">
                          {item.이수구분} • {item.이수영역}
                        </span>
                      </div>
                      <button 
                        onClick={() => setSelectedCourse(item)}
                        className="text-xl font-bold text-zinc-900 dark:text-white mb-3 hover:text-blue-600 transition-colors text-left leading-tight"
                      >
                        {item.교과목명}
                      </button>
                      
                      <div className="grid grid-cols-2 gap-y-2">
                        <IconInfo icon={<User size={14}/>} text={item.담당교수 || '미지정'} />
                        <IconInfo icon={<GraduationCap size={14}/>} text={`${item.학점}학점`} />
                        <IconInfo icon={<Clock size={14}/>} text={item["시간표(교시)"]} />
                        <IconInfo icon={<DollarSign size={14}/>} text={formattedPrice(item.수강가격)} />
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.순번)}
                      className="h-10 w-10 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                      title="삭제"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Side: Summary Sticky (1/3) */}
              <div className="lg:w-1/3">
                <div className="sticky top-10 space-y-4">
                  <div className="bg-white dark:bg-[#09090b] rounded-[32px] border border-zinc-200 dark:border-white/10 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-8">수강 신청 요약</h2>
                    
                    <div className="space-y-6 mb-10">
                      <SummaryRow label="담긴 과목 수" value={`${cartCount}개`} />
                      <SummaryRow label="총 신청 학점" value={`${totalCredits}학점`} isBold />
                      <div className="h-px w-full bg-zinc-100 dark:bg-white/5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-zinc-400">총 수강가격 합계</span>
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                          {formattedPrice(totalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={handleCheckout}
                        disabled={isSubmitting || cartCount === 0}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CreditCard size={18} />
                            수강 신청하기
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleClearCart}
                        className="w-full h-14 bg-zinc-50 dark:bg-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={18} />
                        전체 삭제
                      </button>
                    </div>
                  </div>

                  {/* Policy Tip Box */}
                  <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-3">
                    <AlertCircle className="text-blue-600 shrink-0" size={18} />
                    <p className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                      수강 신청하기 버튼을 눌러 결제를 완료해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {isPaymentModalOpen && (
        <PaymentInfoModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}

function SummaryRow({ label, value, isBold = false }: { label: string, value: string, isBold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-zinc-400">{label}</span>
      <span className={cn("text-lg", isBold ? "font-black text-zinc-900 dark:text-white" : "font-bold text-zinc-600 dark:text-zinc-300")}>
        {value}
      </span>
    </div>
  );
}

function IconInfo({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[13px] font-semibold">
      <div className="text-zinc-400">{icon}</div>
      <span className="truncate">{text}</span>
    </div>
  );
}
