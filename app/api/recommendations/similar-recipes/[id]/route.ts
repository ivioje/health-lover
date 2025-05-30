// Proxy route for similar recipes API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const numRecommendations = url.searchParams.get('num_recommendations') || '5';
    const recipeId = params.id;
    
    console.log(`Proxying similar recipes request to ${FASTAPI_BASE_URL}/recommendations/similar/${recipeId}?num_recommendations=${numRecommendations}`);
    
    try {
      const response = await axios.get(
        `${FASTAPI_BASE_URL}/recommendations/similar/${recipeId}?num_recommendations=${numRecommendations}`,
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
      console.error('Failed to get similar recipes from FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to get similar recipes' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in similar recipes proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
