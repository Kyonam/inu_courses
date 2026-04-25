'use client';

import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#000000] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-500">

        {/* Login Card */}
        <div className="bg-white dark:bg-[#09090b] rounded-[32px] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl border border-zinc-100 dark:border-white/5 overflow-hidden">
              <img src="/Mascot.jpg" alt="INU Mascot" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">기초교육원 서비스 이용</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              인천대학교 기초교육원 교양 교과목 검색 및 <br />
              개인 맞춤 서비스를 위해 로그인이 필요합니다.
            </p>
          </div>

          {/* Action Area */}
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] group relative overflow-hidden shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-zinc-700 dark:text-zinc-200 font-bold transition-colors">
                {loading ? '로그인 중...' : 'Google 계정으로 계속하기'}
              </span>
            </button>
            
            <div className="pt-4 flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-zinc-200 dark:bg-white/10" />
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[2px]">Secured by Supabase</span>
              <div className="h-px w-8 bg-zinc-200 dark:bg-white/10" />
            </div>
          </div>

          {/* Footer Footer */}
          <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-white/5 text-center px-4">
            <p className="text-[11px] text-zinc-400 leading-normal">
              로그인 시 이용약관 및 개인정보 처리방침에 <br />
              동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
        
        {/* Bottom Tagline */}
        <p className="mt-8 text-center text-zinc-400 text-xs font-medium">
          &copy; 2026 INU 기초교육원. All rights reserved.
        </p>
      </div>
    </div>
  );
}
