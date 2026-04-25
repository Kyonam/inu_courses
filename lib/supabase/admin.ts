import { createClient } from '@supabase/supabase-js';

// 이 파일은 서버 사이드(API Routes, Server Components)에서만 사용해야 합니다.
// 클라이언트 측 코드에 이 파일을 가져오지 마십시오.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
}

export const createAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
