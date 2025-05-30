// Proxy route for tracking diet views to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.user_id || !body.diet_id) {
      return NextResponse.json(
        { error: 'Missing user_id or diet_id' },
        { status: 400 }
      );
    }
    
    console.log(`Proxying view tracking request to ${FASTAPI_BASE_URL}/user/view`);
    
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/user/view`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 5000
        }
      );
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Failed to track view in FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to track view' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in track view proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
