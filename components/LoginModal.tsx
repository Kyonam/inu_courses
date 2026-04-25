'use client';

import { X, LogIn, ShieldCheck, Zap } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleLogin = () => {
    const width = 450;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open('/auth', 'inu_auth', `width=${width},height=${height},left=${left},top=${top}`);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-[380px] bg-white dark:bg-[#09090b] rounded-[28px] shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10 animate-in zoom-in duration-300 pointer-events-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          {/* Compact Icon */}
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner">
            <LogIn size={24} className="text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">로그인 후 사용 가능합니다</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-[13px] leading-relaxed mb-8">
            장바구니에 과목을 담고 <br />
            인천대학교 교양 역량을 키워보세요.
          </p>

          <div className="space-y-2 mb-8">
            <FeatureItem icon={<ShieldCheck size={14}/>} text="Google 계정으로 안전한 로그인" />
          </div>

          <button 
            onClick={handleLogin}
            className="w-full h-13 bg-[#09090b] dark:bg-white text-white dark:text-black rounded-xl font-bold text-[14px] shadow-lg shadow-black/10 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            지금 바로 로그인하기
          </button>
          
          <button 
            onClick={onClose}
            className="w-full mt-3 h-10 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-[13px] font-bold transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2 justify-center text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      <span>{text}</span>
    </div>
  );
}
