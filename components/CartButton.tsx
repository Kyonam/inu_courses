'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function CartButton() {
  const { cartCount, setIsLoginModalOpen } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      // If not logged in, trigger the login modal instead of navigating
      setIsLoginModalOpen(true);
      return;
    }
    router.push('/cart');
  };

  return (
    <button 
      onClick={handleClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 transition-all shadow-sm group"
    >
      <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#f8f9fa] dark:border-[#000000] animate-in zoom-in duration-300">
          {cartCount}
        </span>
      )}
    </button>
  );
}
