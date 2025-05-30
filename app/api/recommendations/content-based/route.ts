// Proxy route for content-based recommendations API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';
import { ContentBasedRequest } from '@/lib/types';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body: ContentBasedRequest = await request.json();
    
    console.log(`Proxying content-based recommendations request to ${FASTAPI_BASE_URL}/recommendations/content-based`);
    
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/recommendations/content-based`,
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
      console.error('Failed to get content-based recommendations from FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to get content-based recommendations' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in content-based recommendations proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
