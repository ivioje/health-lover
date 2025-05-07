import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';

// Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    
    // Create new category with unique ID
    const category = {
      name,
      dietIds: [],
    };
    
    // Add category to user's categories
    const updatedUser = await UserModel.findOneAndUpdate(
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
    
    // Update all categories
    const updatedUser = await UserModel.findOneAndUpdate(
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