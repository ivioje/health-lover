import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectToDatabase from "../mongodb";
import UserModel from "../models/userModel";
import { mockCategories, healthPredictions } from "@/lib/data";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        try {
          await connectToDatabase();

          // Find user by email with password included
          const user = await UserModel.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          // For social login users that don't have a password
          if (!user.password) {
            throw new Error('Please use the provider you signed up with');
          }

          // Verify the password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Invalid password');
          }
          
          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('Please verify your email before signing in');
          }

          // Return user object without the password
          const userObject = user.toObject();
          delete userObject.password;
          return userObject;
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For OAuth providers
        if (account.provider !== "credentials") {
          await connectToDatabase();

          // Check if user already exists
          const existingUser = await UserModel.findOne({ email: user.email });
          
          if (existingUser) {
            // Update provider information if needed
            if (!existingUser.provider) {
              existingUser.provider = account.provider;
              existingUser.emailVerified = new Date();
              if (!existingUser.name && user.name) existingUser.name = user.name;
              if (!existingUser.image && user.image) existingUser.image = user.image;
              await existingUser.save();
            }

            // Add user ID to token
            token.id = existingUser._id.toString();
          } else {
            // Create new user for OAuth
            const newUser = await UserModel.create({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              emailVerified: new Date(),
              preferences: {
                dietaryRestrictions: [],
                healthGoals: [],
                activityLevel: "moderate",
                age: 30,
              },
              categories: mockCategories,
              savedDiets: [],
              healthPredictions: healthPredictions,
            });
            
            token.id = newUser._id.toString();
          }
        } else {
          // For credentials login
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        if (session.user) {
          session.user.id = token.id as string;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};