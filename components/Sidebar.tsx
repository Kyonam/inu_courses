'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MENU_DATA } from '@/lib/menu-data';
import { ChevronDown, ChevronRight, Shuffle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminAuthModal } from './AdminAuthModal';

export function Sidebar() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(MENU_DATA.map(section => [section.title, true]))
  );

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="w-64 h-[calc(100vh-2rem)] m-4 flex flex-col bg-[#1a1a1a] text-zinc-400 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <span className="text-sm font-medium text-white tracking-tight">기초교육원</span>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="py-2">
          {MENU_DATA.map((section) => (
            <div key={section.title} className="px-3 py-1">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 group transition-all duration-200"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    openSections[section.title] ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                  )}>
                    {section.title}
                  </span>
                </div>
                {openSections[section.title] ? (
                  <ChevronDown size={14} className="text-zinc-600" />
                ) : (
                  <ChevronRight size={14} className="text-zinc-600" />
                )}
              </button>

              {openSections[section.title] && (
                <div className="mt-1 ml-4 space-y-0.5 border-l border-white/5 pl-2">
                  {section.items.map((item) => (
                    <Link
                      key={item}
                      href={`/?area=${encodeURIComponent(item)}`}
                      className="w-full text-left px-3 py-2 text-[13px] rounded-lg hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Admin Button (Discreet) */}
      <div className="p-4 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsAdminModalOpen(true)}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          <Shield size={12} />
          관리자
        </button>
      </div>

      <AdminAuthModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
