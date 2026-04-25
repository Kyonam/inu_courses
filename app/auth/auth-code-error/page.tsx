'use client';

import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#09090b] rounded-[32px] border border-red-100 dark:border-red-900/20 shadow-2xl p-8 lg:p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">로그인 오류</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-10">
          인증 과정에서 문제가 발생했습니다. <br />
          창을 닫고 다시 시도해 주세요.
        </p>
        <button 
          onClick={() => window.close()}
          className="w-full h-14 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-all active:scale-95 mb-4"
        >
          닫기
        </button>
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          메인으로 이동
        </Link>
      </div>
    </div>
  );
}
