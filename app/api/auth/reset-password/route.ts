import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';
import { hashPassword } from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    
    if (!token || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Token and password are required' 
      }, { status: 400 });
    }
    
    if (password.length < 8) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password reset token is invalid or has expired' 
      }, { status: 400 });
    }
     const hashedPassword = await hashPassword(password);
    
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  } catch (error: any) {
    console.error('Error in reset password API:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to reset password' 
    }, { status: 500 });
  }
}