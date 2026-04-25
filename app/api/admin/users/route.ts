import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Fetch all users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('updated_at', { ascending: false });

    if (usersError) throw usersError;

    // Fetch orders to calculate stats (server-side aggregation for better security)
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('user_id, total_price, status');
    
    if (ordersError) throw ordersError;

    const statsMap: Record<string, { count: number, total: number }> = {};
    ordersData.forEach(order => {
      if (!statsMap[order.user_id]) statsMap[order.user_id] = { count: 0, total: 0 };
      if (order.status === 'completed') {
        statsMap[order.user_id].count += 1;
        statsMap[order.user_id].total += (order.total_price || 0);
      }
    });

    const enrichedUsers = (usersData || []).map(user => ({
      ...user,
      orderCount: statsMap[user.id]?.count || 0,
      totalSpent: statsMap[user.id]?.total || 0,
    }));

    return NextResponse.json(enrichedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
