'use client';

import { Search } from 'lucide-react';
import { MENU_DATA } from '@/lib/menu-data';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || '교과목명');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [area, setArea] = useState(searchParams.get('area') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
      params.set('type', searchType);
    }
    if (category) params.set('category', category);
    if (area) params.set('area', area);
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3 mb-10 p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm">
      <div className="flex-1 flex gap-2">
        <select 
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="h-11 px-4 bg-zinc-50 dark:bg-black/20 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-zinc-600 dark:text-zinc-400"
        >
          <option value="교과목명">교과목명</option>
          <option value="담당교수">담당교수</option>
        </select>
        
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${searchType}으로 검색...`}
            className="w-full h-11 pl-11 pr-4 bg-zinc-50 dark:bg-black/20 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 px-4 bg-zinc-50 dark:bg-black/20 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none min-w-[120px]"
        >
          <option value="">이수구분 전체</option>
          {MENU_DATA.map(m => (
            <option key={m.title} value={m.title}>{m.title}</option>
          ))}
        </select>

        <select 
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="h-11 px-4 bg-zinc-50 dark:bg-black/20 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none min-w-[120px]"
        >
          <option value="">이수영역 전체</option>
          {MENU_DATA.flatMap(m => m.items).map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        
        <button type="submit" className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          검색
        </button>
      </div>
    </form>
  );
}
