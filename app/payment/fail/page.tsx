'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get('message') || '결제가 취소되었거나 오류가 발생했습니다.';
  const code = searchParams.get('code');

  useEffect(() => {
    // 1. Show descriptive toast alert
    toast.error(`결제에 실패했습니다: ${message}`, {
      duration: 3000,
      position: 'top-center',
    });

    // 2. Automatically redirect back to cart after 3 seconds
    const timer = setTimeout(() => {
      router.push('/cart');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, router]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#000000] flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white dark:bg-[#09090b] rounded-[40px] shadow-2xl border border-zinc-200 dark:border-white/10 p-12 space-y-8 animate-in zoom-in duration-500">
        
        {/* Animated Icon */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-600 relative">
            <AlertCircle size={48} className="animate-in fade-in zoom-in duration-700" />
            <div className="absolute inset-0 border-4 border-red-500/20 rounded-full animate-ping" />
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">결제가 중단되었습니다</h2>
          <div className="p-4 bg-red-50/50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-900/10">
            <p className="text-red-500 font-bold text-sm leading-relaxed">
              {message}
            </p>
            {code && (
              <p className="text-red-400 text-[10px] font-mono mt-2 uppercase tracking-widest">Error Code: {code}</p>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <div className="flex items-center gap-3 text-zinc-400 font-bold text-sm">
            <Loader2 className="animate-spin" size={18} />
            <span>잠시 후 장바구니로 돌아갑니다...</span>
          </div>
          
          <button 
            onClick={() => router.push('/cart')}
            className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-all active:scale-95 shadow-xl"
          >
            지금 돌아가기
          </button>
        </div>

      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#000000] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}
