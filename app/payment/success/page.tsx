'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalCredits, clearCart } = useCart();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createClient();
  
  // Use a ref to prevent double execution in development strict mode
  const confirmedRef = useRef(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (confirmedRef.current) return;
      
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount || !user) {
        setStatus('error');
        setErrorMessage('결제 정보가 누락되었습니다.');
        return;
      }

      try {
        confirmedRef.current = true;
        
        // 1. Call our API to confirm with Toss Payments
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || '결제 승인 중 오류가 발생했습니다.');
        }

        // 2. IMPORTANT: Fetch latest cart directly from DB to avoid empty context on page reload
        const { data: latestCart, error: cartError } = await supabase
          .from('cart_items')
          .select('added_at, courses(*)')
          .eq('user_id', user.id);

        if (cartError) throw cartError;
        
        if (!latestCart || latestCart.length === 0) {
          throw new Error('장바구니가 비어 있습니다. 이미 처리되었거나 데이터가 소실되었습니다.');
        }

        const itemsToInsert = latestCart.map((item: any) => ({
          ...item.courses,
          added_at: item.added_at,
        }));

        const calculatedTotalCredits = itemsToInsert.reduce((sum: number, item: any) => sum + (Number(item.학점) || 0), 0);

        // 3. On Success: Record in our DB
        // a. Create Order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            total_credits: calculatedTotalCredits,
            total_price: parseInt(amount),
            status: 'completed',
            toss_payment_key: paymentKey,
            toss_order_id: orderId
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // b. Create Order Items
        const orderItemsBatch = itemsToInsert.map((item: any) => ({
          order_id: orderData.id,
          course_id: item.순번,
          course_name: item.교과목명,
          professor: item.담당교수,
          credits: item.학점,
          price: item.수강가격
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsBatch);

        if (itemsError) {
          console.error('Order items insertion failed:', itemsError);
        }

        // c. Clear Cart
        await clearCart();
        
        setStatus('success');
        toast.success('수강 신청이 완료되었습니다!');

        // d. Redirect after delay
        setTimeout(() => {
          router.push('/orders');
        }, 1500);

      } catch (error: any) {
        console.error('Payment processing error:', error);
        setStatus('error');
        setErrorMessage(error.message || '결제 처리에 실패했습니다. 고객센터로 문의해주세요.');
      }
    };

    if (user) {
      confirmPayment();
    }
  }, [searchParams, user, router, cartItems, totalCredits, clearCart, supabase]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#000000] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#09090b] rounded-[40px] shadow-2xl border border-zinc-200 dark:border-white/10 p-10 text-center animate-in zoom-in duration-500">
        
        {status === 'processing' && (
          <div className="space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              <Loader2 className="absolute text-blue-600 animate-pulse" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">결제 처리 중</h2>
              <p className="text-zinc-500 font-medium">결제를 승인하고 수강 신청 내역을 기록하고 있습니다...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">결제 성공!</h2>
              <p className="text-zinc-500 font-medium leading-relaxed">
                곧 주문 내역 페이지로 이동합니다.<br />
                감사합니다.
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-600">
                <AlertCircle size={48} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">결제 처리 실패</h2>
              <p className="text-red-500 font-bold mb-6">{errorMessage || '결제 처리에 실패했습니다. 기초교육원으로 문의해주세요.'}</p>
              <button 
                onClick={() => router.push('/cart')}
                className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-all active:scale-95"
              >
                장바구니로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#000000] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
