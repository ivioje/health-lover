import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';
import { generatePasswordResetToken, createEmailTransporter, createPasswordResetEmailOptions } from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If your email exists in our system, you will receive password reset instructions.' 
      });
    }
    
    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token valid for 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    const emailTransporter = createEmailTransporter();
    const emailOptions = createPasswordResetEmailOptions(email, resetUrl);
    
    await emailTransporter.sendMail(emailOptions);
    
    return NextResponse.json({ 
      success: true, 
      message: 'If your email exists in our system, you will receive password reset instructions.' 
    });
  } catch (error: any) {
    console.error('Error in forgot password API:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to process password reset request' 
    }, { status: 500 });
  }
}