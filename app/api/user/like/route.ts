import { NextResponse } from 'next/server';
import axios from 'axios';
import { UserLikeRequest } from '@/lib/types';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body: UserLikeRequest = await request.json();
        
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/user/like`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 5000
        }
      );
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Failed to track user like in FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to track user like' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in user like tracking proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
