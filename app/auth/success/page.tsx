'use client';

import { useEffect } from 'react';

export default function AuthSuccess() {
  useEffect(() => {
    // Check if opened as a popup
    if (window.opener) {
      window.opener.postMessage('login-success', window.location.origin);
      window.close();
    } else {
      // If opened directly, just go home
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000000]">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold tracking-tight">로그인 완료! 잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}
