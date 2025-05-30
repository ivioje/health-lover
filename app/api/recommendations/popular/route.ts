// Proxy route for popular/trending diets API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';
import { RecipeRecommendation } from '@/lib/types';
import { mapFastAPIRecommendationToAppDiet } from '@/lib/recommendation-api';
import { logApiRequest, logApiSuccess, handleApiError } from '@/lib/utils/api-diagnostics';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const numRecommendations = url.searchParams.get('num_recommendations') || '8';
    
    logApiRequest('FastAPI', `/recommendations/trending`, { num_recommendations: numRecommendations });
    
    try {
      const response = await axios.get(
        `${FASTAPI_BASE_URL}/recommendations/trending?num_recommendations=${numRecommendations}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (response.data && response.data.trending_recipes) {
        logApiSuccess('FastAPI', `/recommendations/trending`, { count: response.data.trending_recipes.length });
        const mappedResults = response.data.trending_recipes.map((rec: RecipeRecommendation) => 
          mapFastAPIRecommendationToAppDiet(rec)
        );
        return NextResponse.json({ popular_diets: mappedResults });
      } else {
        console.log('Response did not contain expected data structure:', response.data);
      }
    } catch (error) {
      handleApiError('FastAPI', `/recommendations/trending`, error);
      console.log('Trending endpoint failed, trying alternative endpoint');
      
      try {
        logApiRequest('FastAPI', `/recommend/popular`);
        const response = await axios.get(
          `${FASTAPI_BASE_URL}/recommend/popular`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            timeout: 10000
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          logApiSuccess('FastAPI', `/recommend/popular`, { count: response.data.length });
          const mappedResults = response.data.slice(0, Number(numRecommendations)).map((rec: RecipeRecommendation) => 
            mapFastAPIRecommendationToAppDiet(rec)
          );
          return NextResponse.json({ popular_diets: mappedResults });
        } else {
          console.log('Response did not contain expected data structure:', response.data);
        }
      } catch (error) {
        handleApiError('FastAPI', `/recommend/popular`, error);
        return NextResponse.json(
          { error: 'Failed to fetch popular diets from recommendation engine' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'No popular diets found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in popular diets proxy API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular diets' },
      { status: 500 }
    );
  }
}
