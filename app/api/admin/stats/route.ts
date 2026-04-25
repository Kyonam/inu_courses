import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Fetch base data for stats calculation
    const [ordersRes, itemsRes, coursesRes] = await Promise.all([
      supabase.from('orders').select('*').order('ordered_at', { ascending: true }),
      supabase.from('order_items').select('*'),
      supabase.from('courses').select('순번, 이수구분, 이수영역')
    ]);

    if (ordersRes.error) throw ordersRes.error;
    if (itemsRes.error) throw itemsRes.error;
    if (coursesRes.error) throw coursesRes.error;

    return NextResponse.json({
      orders: ordersRes.data || [],
      orderItems: itemsRes.data || [],
      courses: coursesRes.data || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
