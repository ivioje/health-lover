// Proxy route for similar diets API to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';
import { RecipeRecommendation } from '@/lib/types';
import { mapFastAPIRecommendationToAppDiet } from '@/lib/api';
import { logApiRequest, logApiSuccess, handleApiError } from '@/lib/utils/api-diagnostics';
import { getKetoDietById } from '@/lib/api';

// Use environment variable for API URL
const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';
console.log('FastAPI URL for similar API:', FASTAPI_BASE_URL);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const numRecommendations = url.searchParams.get('num_recommendations') || '4';
    const dietId = params.id;
    
    logApiRequest('FastAPI', `/recommendations/similar/${dietId}`, { num_recommendations: numRecommendations });
    
    try {
      // Try the recommendations/similar endpoint first
      const response = await axios.get(
        `${FASTAPI_BASE_URL}/recommendations/similar/${dietId}?num_recommendations=${numRecommendations}`, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (response.data && response.data.similar_recipes) {
        logApiSuccess('FastAPI', `/recommendations/similar/${dietId}`, { count: response.data.similar_recipes.length });
        const mappedResults = await Promise.all(
          response.data.similar_recipes.map(async (rec: RecipeRecommendation) => {
            let ketoDiet = null;
            try {
              ketoDiet = await getKetoDietById(Number(rec.id));
            } catch (e) {}
            return mapFastAPIRecommendationToAppDiet(rec, ketoDiet ? [ketoDiet] : undefined);
          })
        );
        return NextResponse.json({ similar_diets: mappedResults });
      } else {
        console.log('Response did not contain expected data structure:', response.data);
      }
    } catch (error) {
      handleApiError('FastAPI', `/recommendations/similar/${dietId}`, error);
      console.log('First similar endpoint failed, trying alternative endpoint');
      
      try {
        // Try the recommend/similar endpoint as backup
        logApiRequest('FastAPI', `/recommend/similar`, { diet_id: Number(dietId) });
        const response = await axios.post(
          `${FASTAPI_BASE_URL}/recommend/similar`, 
          Number(dietId),
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            timeout: 10000
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          logApiSuccess('FastAPI', `/recommend/similar`, { count: response.data.length });
          const mappedResults = await Promise.all(
            response.data.slice(0, Number(numRecommendations)).map(async (rec: RecipeRecommendation) => {
              let ketoDiet = null;
              try {
                ketoDiet = await getKetoDietById(Number(rec.id));
              } catch (e) {}
              return mapFastAPIRecommendationToAppDiet(rec, ketoDiet ? [ketoDiet] : undefined);
            })
          );
          return NextResponse.json({ similar_diets: mappedResults });
        } else {
          console.log('Response did not contain expected data structure:', response.data);
        }
      } catch (error) {
        handleApiError('FastAPI', `/recommend/similar`, error);
        return NextResponse.json(
          { error: 'Failed to fetch similar diets from recommendation engine' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'No similar diets found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in similar diets proxy API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch similar diets' },
      { status: 500 }
    );
  }
}
