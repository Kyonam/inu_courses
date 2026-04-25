import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 1. Toss Payments Authorization Header (Secret Key + ":" Base64 encoded)
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error('TOSS_SECRET_KEY is missing');
      return NextResponse.json({ message: '서버 설정 오류입니다.' }, { status: 500 });
    }
    
    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

    // 2. Request Final Approval to Toss Payments Server
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Toss Confirmation Failed:', result);
      return NextResponse.json(
        { message: result.message || '결제 승인에 실패했습니다.' },
        { status: 400 } // Return 400 as per requirement
      );
    }

    // 3. Success returns the full response from Toss (status 200)
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Payment API Exception:', error);
    return NextResponse.json(
      { message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
