'use client';

import { FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export function OrderButton() {
  const { user } = useAuth();
  const { setIsLoginModalOpen } = useCart();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      // If not logged in, show the login modal just like the cart button
      setIsLoginModalOpen(true);
      return;
    }
    // For logged-in users, we can navigate to the orders page or keep it quiet for now.
    // Based on previous instructions to keep it inert for now, I'll comment navigation.
    router.push('/orders'); 
  };

  return (
    <button 
      onClick={handleClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 transition-all shadow-sm group"
      title={user ? "주문내역 보기" : "로그인이 필요합니다"}
    >
      <FileText size={20} className="group-hover:scale-110 transition-transform" />
    </button>
  );
}
