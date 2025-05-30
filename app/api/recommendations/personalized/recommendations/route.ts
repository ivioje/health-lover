// Proxy route for personalized recommendations API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';
import { PersonalizedRequest } from '@/lib/types';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body: PersonalizedRequest = await request.json();
    
    console.log(`Proxying personalized recommendations request to ${FASTAPI_BASE_URL}/recommendations/personalized`);
    
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/recommendations/personalized`,
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
      console.error('Failed to get personalized recommendations from FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to get personalized recommendations' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in personalized recommendations proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
