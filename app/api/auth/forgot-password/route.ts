import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';
import { 
  generatePasswordResetToken, 
  createEmailTransporter, 
  createPasswordResetEmailOptions 
} from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Find user by email
    const user = await UserModel.findOne({ email });
    
    // Don't reveal if the user exists or not (security best practice)
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        message: 'If your email exists in our system, you will receive password reset instructions.' 
      });
    }
    
    // Generate reset token and expiry
    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour
    
    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
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