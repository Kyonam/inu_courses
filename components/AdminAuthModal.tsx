'use client';

import { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminAuthModal({ isOpen, onClose }: AdminAuthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Official password: '기초교육원' typed in English
    if (password === 'rlchrydbrdnjs') {
      sessionStorage.setItem('adminAuth', 'true');
      toast.success('관리자 인증에 성공했습니다.');
      onClose();
      router.push('/admin'); 
    } else {
      setError(true);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[360px] bg-zinc-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/20">
              <ShieldCheck size={32} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">관리자 인증</h2>
            <p className="text-zinc-500 font-medium tracking-tight">관리자 비밀번호를 입력하세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  autoFocus
                  placeholder="Password"
                  className={cn(
                    "w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white font-bold tracking-widest placeholder:tracking-normal placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all",
                    error && "border-red-500 focus:ring-red-500/20"
                  )}
                />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-red-500 text-[12px] font-bold px-1 animate-shimmer">
                  <AlertCircle size={14} />
                  <span>비밀번호가 올바르지 않습니다.</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                type="submit"
                className="w-full h-14 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
              >
                확인
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full h-14 bg-white/5 text-zinc-400 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
