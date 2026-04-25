import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { CourseCard } from '@/components/CourseCard';
import { getRandomCourses, getFilteredCourses } from '@/lib/courses';
import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight, Home as HomeIcon, Search } from 'lucide-react';
import { LoginButton } from '@/components/LoginButton';
import { CartButton } from '@/components/CartButton';
import { OrderButton } from '@/components/OrderButton';

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const area = typeof searchParams.area === 'string' ? searchParams.area : undefined;
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const type = typeof searchParams.type === 'string' ? searchParams.type : '교과목명';
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;

  const isFiltered = !!(category || area || query);

  if (isFiltered) {
    const { data: courses, count } = await getFilteredCourses({ 
      category, 
      area, 
      query, 
      searchType: type, 
      page 
    });
    const totalPages = Math.ceil(count / 24);
    
    let title = area || category || '검색 결과';
    if (query) title = `"${query}" 검색 결과`;

    return (
      <div className="flex h-screen bg-[#f8f9fa] dark:bg-[#000000] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <header className="mb-8 px-2 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link href="/" className="text-[11px] font-bold text-zinc-400 hover:text-blue-600 flex items-center gap-1 transition-colors uppercase tracking-widest">
                    <HomeIcon size={12} />
                    Home
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">/</span>
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                    {query ? 'Search' : (category ? 'Category' : 'Area')}
                  </span>
                </div>
                <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">INU 기초교육원 교양 교과목</h1>
                <p className="text-zinc-500 mt-2 text-lg">인천대학교 교양 과목을 한눈에 확인하세요.</p>
              </div>
              <div className="flex items-center gap-3">
                <OrderButton />
                <CartButton />
                <LoginButton />
              </div>
            </header>

            <SearchBar />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {courses.map((course) => (
                <CourseCard key={course.순번} course={course} />
              ))}
              {courses.length === 0 && (
                <div className="col-span-full py-40 text-center bg-white dark:bg-white/5 rounded-[40px] border border-dashed border-zinc-200 dark:border-white/10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-full">
                      <Search size={40} className="text-zinc-300 dark:text-zinc-700" />
                    </div>
                    <p className="text-xl font-medium text-zinc-400">검색 결과가 없습니다.</p>
                    <Link href="/" className="text-sm font-bold text-blue-600 hover:underline">모든 과목 보기</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pb-20">
                <PaginationLink 
                  page={page - 1} 
                  disabled={page <= 1} 
                  params={{ category, area, q: query, type }} 
                  icon={<ChevronLeft size={18} />} 
                />
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = page;
                  if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  
                  if (p < 1 || p > totalPages) return null;

                  return (
                    <Link
                      key={p}
                      href={buildUrl({ category, area, q: query, type, page: p })}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        p === page 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}

                <PaginationLink 
                  page={page + 1} 
                  disabled={page >= totalPages} 
                  params={{ category, area, q: query, type }} 
                  icon={<ChevronRight size={18} />} 
                />
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Home View
  const basics = await getRandomCourses('기초교양', 8);
  const core = await getRandomCourses('핵심교양', 8);
  const advanced = await getRandomCourses('심화교양', 8);

  const sections = [
    { title: '학문의 기초', category: '기초교양', area: '학문의기초', data: basics },
    { title: '핵심교양', category: '핵심교양', data: core },
    { title: '심화교양', category: '심화교양', data: advanced },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fa] dark:bg-[#000000] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          <header className="mb-8 px-2 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">INU 기초교육원 교양 교과목</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">인천대학교 교양 과목을 한눈에 확인하세요.</p>
            </div>
            <div className="flex items-center gap-3">
              <OrderButton />
              <CartButton />
              <LoginButton />
            </div>
          </header>

          <SearchBar />

          <div className="space-y-16 pb-20">
            {sections.map((section) => (
              <section key={section.title} className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                    {section.title}
                  </h2>
                  <Link 
                    href={buildUrl({ category: section.category, area: section.area })}
                    className="text-xs font-bold text-zinc-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                  >
                    전체보기+
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {section.data.map((course) => (
                    <CourseCard key={course.순번} course={course} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function buildUrl({ category, area, q, type, page }: { category?: string, area?: string, q?: string, type?: string, page?: number }) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (area) params.set('area', area);
  if (q) {
    params.set('q', q);
    if (type) params.set('type', type);
  }
  if (page && page > 1) params.set('page', page.toString());
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

function PaginationLink({ page, disabled, params, icon }: { page: number, disabled: boolean, params: any, icon: React.ReactNode }) {
  if (disabled) {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
        {icon}
      </div>
    );
  }

  return (
    <Link
      href={buildUrl({ ...params, page })}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all border border-zinc-200 dark:border-white/5 shadow-sm"
    >
      {icon}
    </Link>
  );
}
