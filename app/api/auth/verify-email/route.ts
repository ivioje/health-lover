import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';
import User from "@/lib/models/userModel";

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


export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the token from the request body
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is missing" },
        { status: 400 }
      );
    }

    // Find the user with the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update the user's email verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "Failed to verify email" },
      { status: 500 }
    );
  }
}