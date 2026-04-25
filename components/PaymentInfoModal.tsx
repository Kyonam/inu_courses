'use client';

import { X, User, Mail, CreditCard, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface PaymentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; email: string }) => void;
}

export function PaymentInfoModal({ isOpen, onClose, onConfirm }: PaymentInfoModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.user_metadata?.full_name || '',
        email: user.email || ''
      });
      setErrors({ name: '', email: '' });
    }
  }, [isOpen, user]);

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

  const validate = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해 주세요.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해 주세요.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onConfirm(formData);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white dark:bg-[#09090b] rounded-[32px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10 animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600">
              <CreditCard size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Payment Info</span>
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">결제자 정보 입력</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} className="text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">이름</label>
            <div className="relative group">
              <div className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors",
                errors.name && "text-red-500"
              )}>
                <User size={18} />
              </div>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
                className={cn(
                  "w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-400",
                  errors.name && "border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50 dark:bg-red-500/5"
                )}
              />
            </div>
            {errors.name && (
              <div className="flex items-center gap-1.5 text-red-500 text-[12px] font-bold ml-1 animate-in slide-in-from-top-1">
                <AlertCircle size={14} />
                {errors.name}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">이메일</label>
            <div className="relative group">
              <div className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors",
                errors.email && "text-red-500"
              )}>
                <Mail size={18} />
              </div>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@inu.ac.kr"
                className={cn(
                  "w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-400",
                  errors.email && "border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50 dark:bg-red-500/5"
                )}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1.5 text-red-500 text-[12px] font-bold ml-1 animate-in slide-in-from-top-1">
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 h-14 bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white rounded-2xl font-bold transition-all active:scale-95"
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-[2] h-14 bg-[#09090b] dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-black/10"
            >
              결제하기
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
