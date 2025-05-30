// Proxy route for tracking user folder additions to avoid CORS issues
import { NextResponse } from 'next/server';
import axios from 'axios';
import { UserAddToFolderRequest } from '@/lib/types';

const FASTAPI_BASE_URL = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/v1` || '';

export async function POST(request: Request) {
  try {
    const body: UserAddToFolderRequest = await request.json();
    
    console.log(`Proxying user folder tracking request to ${FASTAPI_BASE_URL}/user/add-to-folder`);
    
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/user/add-to-folder`,
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
      console.error('Failed to track user folder addition in FastAPI:', error);
      return NextResponse.json(
        { error: 'Failed to track user folder addition' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in user folder tracking proxy API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
