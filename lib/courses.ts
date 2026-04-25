import { createClient } from './supabase/server';
import { Course } from '@/types/course';

export async function getRandomCourses(category: string, limit: number = 8): Promise<Course[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('이수구분', category)
    .limit(100);

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  return (data as Course[])
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

export async function getFilteredCourses(options: {
  category?: string;
  area?: string;
  query?: string;
  searchType?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Course[], count: number }> {
  const { category, area, query, searchType = '교과목명', page = 1, limit = 24 } = options;
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let dbQuery = supabase
    .from('courses')
    .select('*', { count: 'exact' });

  if (category) dbQuery = dbQuery.eq('이수구분', category);
  if (area) dbQuery = dbQuery.eq('이수영역', area);
  
  if (query) {
    const column = searchType === '담당교수' ? '담당교수' : '교과목명';
    dbQuery = dbQuery.ilike(column, `%${query}%`);
  }

  const { data, error, count } = await dbQuery
    .range(from, to)
    .order('교과목명', { ascending: true });

  if (error) {
    console.error('Error fetching filtered courses:', error);
    return { data: [], count: 0 };
  }

  return { data: (data as Course[]) || [], count: count || 0 };
}
