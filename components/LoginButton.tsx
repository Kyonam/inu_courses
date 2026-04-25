'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoginButton() {
  const { user, signOut, loading: contextLoading } = useAuth();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [fallbackLoading, setFallbackLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Use effective loading state - if context is loading, we wait, 
  // but we also have a timeout safety.
  const isLoading = contextLoading && fallbackLoading;

  useEffect(() => {
    // Safety timeout: stop showing loading after 2.5 seconds regardless of context
    const timer = setTimeout(() => {
      setFallbackLoading(false);
    }, 2500);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === 'login-success') {
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update fallback loading when context loading finishes
  useEffect(() => {
    if (!contextLoading) {
      setFallbackLoading(false);
    }
  }, [contextLoading]);

  const handleLogin = () => {
    const width = 450;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open('/auth', 'inu_auth', `width=${width},height=${height},left=${left},top=${top}`);
  };

  if (isLoading) {
    return (
      <div className="w-[84px] h-9 bg-zinc-100 dark:bg-white/5 rounded-full animate-pulse border border-zinc-200 dark:border-white/10" />
    );
  }

  if (user) {
    const avatarUrl = user.user_metadata.avatar_url;
    const fullName = user.user_metadata.full_name;

    return (
      <div className="relative" ref={popoverRef}>
        <button 
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          onMouseEnter={() => setIsPopoverOpen(true)}
          className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-blue-500/50 transition-all shadow-sm group"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-white/20" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase">
              {fullName?.charAt(0) || 'U'}
            </div>
          )}
          <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {fullName?.split(' ')[0]}님
          </span>
          <ChevronDown size={14} className={cn("text-zinc-400 transition-transform duration-300", isPopoverOpen && "rotate-180")} />
        </button>

        {isPopoverOpen && (
          <div 
            onMouseLeave={() => setIsPopoverOpen(false)}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#09090b] rounded-[24px] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="p-5 bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                {avatarUrl && <img src={avatarUrl} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-white/10" />}
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{fullName}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="text-sm font-bold text-zinc-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
    >
      로그인
    </button>
  );
}
