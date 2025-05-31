// Proxy route for recommendation system stats API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function GET() {
  try {
    console.log(`Proxying recommendation system stats request to ${FASTAPI_BASE_URL}/recommendations/stats`);
    
    try {
      const response = await axios.get(
        `${FASTAPI_BASE_URL}/recommendations/stats`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 20000
        }
      );
      
      return NextResponse.json(response.data);
    } catch (error) {
      console.error('Failed to get recommendation system stats from FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to get recommendation system stats' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in recommendation system stats proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
