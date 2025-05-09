import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    
    let user = await UserModel.findOne({ email });
    
    if (!user) {
      user = await UserModel.create({
        email,
        name: email.split('@')[0],
        preferences: {
          dietaryRestrictions: [],
          healthGoals: [],
          activityLevel: 'moderate',
          age: 30,
        },
        categories: [
          {
            id: uuidv4(),
            name: "Favorites",
            dietIds: []
          }
        ],
        savedDiets: [],
        healthPredictions: [],
      });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}