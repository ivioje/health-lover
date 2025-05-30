// Proxy route for collaborative recommendations API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';
import { CollaborativeRequest } from '@/lib/types';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body: CollaborativeRequest = await request.json();
    
    console.log(`Proxying collaborative recommendations request to ${FASTAPI_BASE_URL}/recommendations/collaborative`);
    
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/recommendations/collaborative`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );
      
      return NextResponse.json(response.data);
    } catch (error) {
      console.error('Failed to get collaborative recommendations from FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to get collaborative recommendations' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in collaborative recommendations proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
