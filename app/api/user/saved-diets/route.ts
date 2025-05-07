import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    
    const { dietId } = await request.json();
    
    if (!dietId) {
      return NextResponse.json({ error: 'Diet ID is required' }, { status: 400 });
    }
    
    // Add diet to saved diets (if not already present)
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { 
        $addToSet: { savedDiets: dietId },
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error saving diet:', error);
    return NextResponse.json({ error: 'Failed to save diet' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const dietId = searchParams.get('dietId');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    
    if (!dietId) {
      return NextResponse.json({ error: 'Diet ID parameter is required' }, { status: 400 });
    }
    
    // Remove diet from saved diets
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { 
        $pull: { savedDiets: dietId },
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error removing saved diet:', error);
    return NextResponse.json({ error: 'Failed to remove diet' }, { status: 500 });
  }
}