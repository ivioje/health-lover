import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Token generators
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Email service configuration
export const createEmailTransporter = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Production email service
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: true,
    });
  } else {
    // Development email service
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.DEV_EMAIL_USER,
        pass: process.env.DEV_EMAIL_PASSWORD,
      },
    });
  }
};

export const createVerificationEmailOptions = (to: string, verificationUrl: string) => {
  const appName = process.env.APP_NAME || 'HealthLover';
  
  return {
    from: `${appName} <${process.env.EMAIL_FROM || 'noreply@healthlover.com'}>`,
    to,
    subject: `Verify your email for ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to ${appName}!</h2>
        <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the link below:</p>
        <p style="margin: 20px 0;">
          <a href="${verificationUrl}" 
            style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >
            Verify Email Address
          </a>
        </p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best,<br>The ${appName} Team</p>
      </div>
    `,
    text: `Welcome to ${appName}! Please verify your email by clicking this link: ${verificationUrl}. If you did not create an account, please ignore this email. This link will expire in 24 hours.`,
  };
};

export const createPasswordResetEmailOptions = (to: string, resetUrl: string) => {
  const appName = process.env.APP_NAME || 'HealthLover';
  
  return {
    from: `${appName} <${process.env.EMAIL_FROM || 'noreply@healthlover.com'}>`,
    to,
    subject: `Reset your password for ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>You are receiving this email because you (or someone else) has requested a password reset for your account.</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" 
            style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >
            Reset Your Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best,<br>The ${appName} Team</p>
      </div>
    `,
    text: `You are receiving this email because you (or someone else) has requested a password reset for your account. Please use this link to reset your password: ${resetUrl}. If you did not request this, please ignore this email and your password will remain unchanged. This link will expire in 1 hour.`,
  };
};