import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/userModel';
import { 
  generateVerificationToken, 
  createEmailTransporter, 
  createVerificationEmailOptions,
  hashPassword
} from '@/lib/auth/auth-utils';
import { mockCategories, healthPredictions } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 });
    }
    
    // Create verification token
    const verificationToken = generateVerificationToken();
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      emailVerified: null,
      preferences: {
        dietaryRestrictions: [],
        healthGoals: [],
        activityLevel: 'moderate',
        age: 30,
      },
      categories: mockCategories.map(category => ({
        name: category.name,
        dietIds: category.dietIds
      })),
      savedDiets: [],
      healthPredictions: healthPredictions
    });
    
    // Remove password from the response
    const user = newUser.toObject();
    delete user.password;
    delete user.verificationToken;
    
    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
    const emailTransporter = createEmailTransporter();
    const emailOptions = createVerificationEmailOptions(email, verificationUrl);
    
    await emailTransporter.sendMail(emailOptions);
    
    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully. Please check your email to verify your account.',
      user 
    });
  } catch (error: any) {
    console.error('Error in register API:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to register user' 
    }, { status: 500 });
  }
}