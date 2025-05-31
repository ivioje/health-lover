import { NextResponse } from 'next/server';
import axios from 'axios';
import { PersonalizedRequest, RecipeRecommendation } from '@/lib/types';
import { mapFastAPIRecommendationToAppDiet } from '@/lib/recommendation-api';
import { getKetoDietById } from '@/lib/api';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body: PersonalizedRequest = await request.json();
        
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
      if (response.data && response.data.recommendations) {
        const mappedResults = await Promise.all(
          response.data.recommendations.map(async (rec: RecipeRecommendation) => {
            let ketoDiet = null;
            try {
              ketoDiet = await getKetoDietById(Number(rec.id));
            } catch (e) {}
            return mapFastAPIRecommendationToAppDiet(rec, ketoDiet ? [ketoDiet] : undefined);
          })
        );
        return NextResponse.json({ ...response.data, recommendations: mappedResults });
      }
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
