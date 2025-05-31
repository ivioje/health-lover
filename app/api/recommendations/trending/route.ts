// Proxy route for trending recipes API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const numRecommendations = url.searchParams.get('num_recommendations') || '10';
    
    console.log(`Proxying trending recipes request to ${FASTAPI_BASE_URL}/recommendations/trending?num_recommendations=${numRecommendations}`);
    
    try {
      const response = await axios.get(
        `${FASTAPI_BASE_URL}/recommendations/trending?num_recommendations=${numRecommendations}`,
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
      console.error('Failed to get trending recipes from FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to get trending recipes' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in trending recipes proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
