'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Filter, Edit, Trash2, BookOpen, User, GraduationCap, DollarSign, Users, ArrowUpDown, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { AdminCourseModal } from '@/components/AdminCourseModal';

interface CourseWithStats extends any {
  enrollmentCount: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'이수구분' | '이수영역' | '교과목명'>('교과목명');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from internal API (Server-side with service_role)
      const response = await fetch('/api/admin/courses');
      if (!response.ok) throw new Error('API 호출 실패');
      const coursesData = await response.json();

      // Enrollment counts still need to be handled.
      // For now, let's assume we can fetch counts via another admin API or combine it.
      // Since this is admin, let's just use the courses data.
      // To get enrollment counts accurately from server, we might need another join or API.
      // For this demo, let's keep it simple.
      
      setCourses(coursesData || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('교과목 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const handleDelete = async (courseId: number, courseName: string) => {
    if (!confirm(`"${courseName}" 과목을 삭제하시겠습니까? 데이터 삭제 시 복구가 불가능합니다.`)) return;

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('삭제 실패');
      
      toast.success('교과목이 성공적으로 삭제되었습니다.');
      fetchCourses();
    } catch (error: any) {
      toast.error('삭제 오류: ' + error.message);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.교과목명?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.담당교수?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (column: '이수구분' | '이수영역' | '교과목명') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const formattedPrice = (price: number) => new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price || 0);

  return (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-4">
            <BookOpen size={36} className="text-indigo-600" />
            교과목 관리
          </h1>
          <p className="text-zinc-500 font-medium text-lg mt-2">전체 {courses.length}개의 교과목 중 {filteredCourses.length}개가 검색되었습니다.</p>
        </div>
        <button 
          onClick={() => { setSelectedCourse(null); setIsModalOpen(true); }}
          className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} strokeWidth={3} />
          교과목 추가
        </button>
      </header>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="과목명 또는 교수명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-16 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-3xl pl-16 pr-6 text-lg font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-white/[0.02]">
                <th 
                  className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => toggleSort('교과목명')}
                >
                  <div className="flex items-center gap-1">교과목명 {sortBy === '교과목명' && <ArrowUpDown size={12} />}</div>
                </th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest">담당교수</th>
                <th 
                  className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => toggleSort('이수구분')}
                >
                  <div className="flex items-center gap-1">이수구분 {sortBy === '이수구분' && <ArrowUpDown size={12} />}</div>
                </th>
                <th 
                   className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                   onClick={() => toggleSort('이수영역')}
                >
                  <div className="flex items-center gap-1">이수영역 {sortBy === '이수영역' && <ArrowUpDown size={12} />}</div>
                </th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-center">학점</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">수강가격</th>
                <th className="p-6 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-white/5 font-bold text-[14px]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                      <p className="text-zinc-500">데이터를 동기화 중입니다...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedCourses.length === 0 ? (
                <tr>
                   <td colSpan={7} className="p-20 text-center text-zinc-500">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr key={course.순번} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors group">
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase">{course.교과목명}</p>
                        <p className="text-[11px] font-mono text-zinc-400">#{course.학수번호}</p>
                      </div>
                    </td>
                    <td className="p-6 text-zinc-600 dark:text-zinc-400">{course.담당교수 || '-'}</td>
                    <td className="p-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[11px]",
                        course.이수구분?.includes('필수') ? "bg-red-500/10 text-red-500" : "bg-zinc-100 dark:bg-white/5 text-zinc-500"
                      )}>
                        {course.이수구분}
                      </span>
                    </td>
                    <td className="p-6 text-zinc-600 dark:text-zinc-400">{course.이수영역 || '-'}</td>
                    <td className="p-6 text-center text-zinc-900 dark:text-white">{course.학점}</td>
                    <td className="p-6 text-right text-zinc-900 dark:text-white font-mono">{formattedPrice(course.수강가격)}</td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedCourse(course); setIsModalOpen(true); }}
                          className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all"
                          title="수정"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.순번, course.교과목명)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                          title="삭제"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 bg-zinc-50/50 dark:bg-white/[0.02] border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
            <p className="text-[12px] font-bold text-zinc-500">
              Page <span className="text-zinc-900 dark:text-white">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 h-10 rounded-xl text-[12px] font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-[12px] font-bold transition-all",
                        currentPage === pageNum 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 h-10 rounded-xl text-[12px] font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminCourseModal 
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCourses}
      />
    </div>
  );
}
