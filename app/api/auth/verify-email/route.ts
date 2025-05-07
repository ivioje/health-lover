import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find user with the verification token
    const user = await UserModel.findOne({ verificationToken: token });
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid verification token' }, { status: 400 });
    }
    
    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: 'Email already verified' });
    }
    
    // Update user to mark as verified
    user.emailVerified = new Date();
    user.verificationToken = undefined; // Remove the token
    await user.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully. You can now log in.'
    });
  } catch (error: any) {
    console.error('Error in verify email API:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to verify email' 
    }, { status: 500 });
  }
}