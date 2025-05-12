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
    
    // Find user with matching token and check if token has expired
    const user = await UserModel.findOne({ 
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      console.error('Token validation failed:', { 
        tokenProvided: token,
        userFound: !!user
      });
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired verification token'
      }, { status: 400 });
    }
    
    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: 'Email already verified' });
    }
    
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
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
    await connectToDatabase();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is missing" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      console.error('Token validation failed:', { 
        tokenProvided: token,
        userFound: !!user
      });
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    user.emailVerified = true;
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