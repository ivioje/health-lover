// Route handler for personalized recommendations
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth/auth';
import { UserProfile } from '@/lib/types';
import User from '@/lib/models/userModel';
import connectToDatabase from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfile: UserProfile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      preferences: user.preferences || {},
      categories: user.categories || [],
      savedDiets: user.savedDiets || [],
      healthPredictions: user.healthPredictions || [],
      emailVerified: user.emailVerified,
      image: session.user.image || null
    };

    return NextResponse.json({ 
      userProfile,
      message: 'User profile retrieved successfully' 
    });
  } catch (error) {
    console.error('Error in personalized recommendations API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
