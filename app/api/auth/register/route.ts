import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import userModel from '@/lib/models/userModel';
import { mockCategories, healthPredictions } from '@/lib/data';
import { generateVerificationToken, createEmailTransporter, createVerificationEmailOptions, hashPassword } from '@/lib/auth/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 });
    }
    
    const verificationToken = generateVerificationToken();
    const hashedPassword = await hashPassword(password);
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const userData = {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
      emailVerified: false,
      preferences: {
        dietaryRestrictions: [],
        healthGoals: [],
        activityLevel: 'moderate',
        age: 30,
      },
      categories: {
        name,
        dietIds: []
      },
      savedDiets: [],
      healthPredictions: healthPredictions
    };

    const newUser = await userModel.create(userData);
    
    const savedUser = await userModel.findById(newUser._id);
    if (!savedUser || !savedUser.verificationToken) {
      console.error('Verification token not saved properly', { 
        tokenGenerated: verificationToken,
        savedToken: savedUser?.verificationToken || 'missing'
      });
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to save verification information' 
      }, { status: 500 });
    }
    
    // Create a user object to return (excluding sensitive data)
    const userToReturn = { ...newUser.toObject() };
    delete userToReturn.password;
    delete userToReturn.verificationToken;
    
    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
    
    try {
      const emailTransporter = createEmailTransporter();
      const emailOptions = createVerificationEmailOptions(email, verificationUrl);
      await emailTransporter.sendMail(emailOptions);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully. Please check your email to verify your account.',
      user: userToReturn
    });
  } catch (error: any) {
    console.error('Error in register API:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to register user' 
    }, { status: 500 });
  }
}