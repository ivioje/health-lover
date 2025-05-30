// Proxy route for tracking user views to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';
import { UserViewRequest } from '@/lib/types';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body: UserViewRequest = await request.json();
    
    console.log(`Proxying user view tracking request to ${FASTAPI_BASE_URL}/user/view`);
    
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/user/view`,
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
      console.error('Failed to track user view in FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to track user view' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in user view tracking proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
