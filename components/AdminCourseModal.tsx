'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, User, GraduationCap, MapPin, Clock, DollarSign, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AdminCourseModalProps {
  course: any | null; // null for add mode, object for edit mode
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminCourseModal({ course, isOpen, onClose, onSuccess }: AdminCourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    교과목명: '',
    담당교수: '',
    학수번호: '',
    이수구분: '',
    이수영역: '',
    학점: 3,
    강의실: '',
    강의시간: '',
    정원: 40,
    수강가격: 100000,
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        교과목명: '',
        담당교수: '',
        학수번호: '',
        이수구분: '',
        이수영역: '',
        학점: 3,
        강의실: '',
        강의시간: '',
        정원: 40,
        수강가격: 100000,
      });
    }
  }, [course, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const confirmMessage = course 
      ? `"${formData.교과목명}" 과목의 정보를 수정하시겠습니까?` 
      : `새로운 과목인 "${formData.교과목명}"을(를) 등록하시겠습니까?`;
      
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);

    try {
      const url = course 
        ? `/api/admin/courses/${course.순번}` 
        : '/api/admin/courses';
      
      const method = course ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('데이터 저장 실패');

      toast.success(course ? '교과목 정보가 수정되었습니다.' : '새 교과목이 등록되었습니다.');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast.error('저장 오류: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#09090b] rounded-[40px] shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
              {course ? <RefreshCw size={24} /> : <Plus size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                {course ? '교과목 정보 수정' : '새로운 교과목 등록'}
              </h2>
              <p className="text-zinc-500 text-sm font-medium">모든 필드를 정확하게 입력해주세요.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-400">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form id="courseForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">교과목명</label>
              <input 
                required
                value={formData.교과목명}
                onChange={e => setFormData({ ...formData, 교과목명: e.target.value })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 기초 인공지능"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">담당교수</label>
              <input 
                required
                value={formData.담당교수}
                onChange={e => setFormData({ ...formData, 담당교수: e.target.value })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                placeholder="교수명 입력"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">학수번호</label>
              <input 
                required
                value={formData.학수번호}
                onChange={e => setFormData({ ...formData, 학수번호: e.target.value })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-mono text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                placeholder="M1029.001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">이수구분</label>
              <select 
                value={formData.이수구분}
                onChange={e => setFormData({ ...formData, 이수구분: e.target.value })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none"
              >
                <option value="">선택하세요</option>
                <option value="교양필수">교양필수</option>
                <option value="전공필수">전공필수</option>
                <option value="교양선택">교양선택</option>
                <option value="전공선택">전공선택</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">이수영역</label>
              <input 
                value={formData.이수영역}
                onChange={e => setFormData({ ...formData, 이수영역: e.target.value })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 학문의 기초"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-zinc-100 dark:border-white/5 pt-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">학점</label>
              <input 
                type="number"
                value={formData.학점}
                onChange={e => setFormData({ ...formData, 학점: parseInt(e.target.value) })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">정원</label>
              <input 
                type="number"
                value={formData.정원}
                onChange={e => setFormData({ ...formData, 정원: parseInt(e.target.value) })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">수강가격</label>
              <input 
                type="number"
                value={formData.수강가격}
                onChange={e => setFormData({ ...formData, 수강가격: parseInt(e.target.value) })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-mono text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">강의실</label>
              <input 
                value={formData.강의실}
                onChange={e => setFormData({ ...formData, 강의실: e.target.value })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 5호관 301호"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest px-1">강의시간</label>
              <input 
                value={formData.강의시간}
                onChange={e => setFormData({ ...formData, 강의시간: e.target.value })}
                className="w-full h-14 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-2xl px-6 font-bold text-zinc-900 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                placeholder="예: 월 10:00-12:00"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-zinc-100 dark:border-white/5 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 h-14 bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white rounded-2xl font-bold transition-all hover:bg-zinc-200 dark:hover:bg-white/10 active:scale-[0.98]"
          >
            취소
          </button>
          <button 
            form="courseForm"
            type="submit"
            disabled={loading}
            className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
            {course ? '정보 수정하기' : '과목 등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
