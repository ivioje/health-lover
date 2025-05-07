import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // Augment the request
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/login',
    },
    callbacks: {
      authorized({ token }) {
        // Only allow authenticated users to access protected routes
        return !!token;
      },
    },
  }
);

// Protect all routes that should only be accessible to authenticated users
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/preferences/:path*',
    '/recommendations/:path*',
    '/diets/:path*/save',
  ],
};