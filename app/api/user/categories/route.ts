import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import userModel from '@/lib/models/userModel';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const { name } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid category name' }, { status: 400 });
    }
    const category = { name, dietIds: [] };
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { 
        $push: { categories: category },
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// Update categories (replace all categories)
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    
    const { categories } = await request.json();
    
    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: 'Categories array is required' }, { status: 400 });
    }
    
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { 
        $set: { categories },
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating categories:', error);
    return NextResponse.json({ error: 'Failed to update categories' }, { status: 500 });
  }
}