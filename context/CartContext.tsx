'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';
import { Course } from '@/types/course';
import { toast } from 'sonner';

import { LoginModal } from '@/components/LoginModal';

type CartItem = Course & { added_at: string };

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (course: Course) => Promise<void>;
  removeFromCart: (courseId: number) => Promise<void>;
  isInCart: (courseId: number) => boolean;
  totalCredits: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
  clearCart: () => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const supabase = createClient();

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('added_at, courses(*)')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;

      const items = data.map((item: any) => ({
        ...item.courses,
        added_at: item.added_at,
      })) as CartItem[];

      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (course: Course) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isInCart(course.순번)) {
      toast.warning('이미 담긴 과목입니다.', {
        description: `"${course.교과목명}" 과목이 이미 장바구니에 있습니다.`
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          course_id: course.순번,
        });

      if (error) throw error;

      toast.success('장바구니에 추가되었습니다.', {
        description: `"${course.교과목명}" 과목을 장바구니에 담았습니다.`
      });
      refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('장바구니 추가 실패', {
        description: '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      });
    }
  };

  const removeFromCart = async (courseId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.순번 !== courseId));
      toast.info('장바구니에서 제거되었습니다.');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('장바구니 제거 실패');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      toast.success('장바구니가 모두 비워졌습니다.');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('장바구니 비우기 실패');
    }
  };

  const isInCart = (courseId: number) => {
    return cartItems.some(item => item.순번 === courseId);
  };

  const cartCount = cartItems.length;
  const totalCredits = cartItems.reduce((sum, item) => sum + (Number(item.학점) || 0), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (Number(item.수강가격) || 0), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        loading, 
        addToCart, 
        removeFromCart, 
        isInCart, 
        totalCredits, 
        totalPrice,
        refreshCart,
        clearCart,
        isLoginModalOpen,
        setIsLoginModalOpen
      }}
    >
      {children}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
