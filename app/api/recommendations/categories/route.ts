import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function GET() {
  try {
    console.log(`Proxying recommendation categories request to ${FASTAPI_BASE_URL}/recommendations/categories`);
    
    try {
      const response = await axios.get(
        `${FASTAPI_BASE_URL}/recommendations/categories`,
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
      console.error('Failed to get recommendation categories from FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to get recommendation categories' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in recommendation categories proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
