'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams as useNextSearchParams } from 'next/navigation';

// Define the error mapping outside the component
const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  'OAuthAccountNotLinked': {
    title: 'Account Already Exists',
    message: 'An account with this email already exists. Please sign in with the provider you used initially.'
  },
  'CredentialsSignin': {
    title: 'Invalid Credentials',
    message: 'The email or password you entered is incorrect. Please try again.'
  },
  'AccessDenied': {
    title: 'Access Denied',
    message: 'You do not have permission to access this resource.'
  },
  'Verification': {
    title: 'Verification Required',
    message: 'Please verify your email address before signing in.'
  },
  'Default': {
    title: 'Authentication Failed',
    message: 'An unknown error occurred during sign in. Please try again later.'
  }
};

export default function ErrorClient() {
  // Get search params directly from Next.js
  const searchParams = useNextSearchParams();
  
  // Use state to avoid hydration mismatch
  const [errorInfo, setErrorInfo] = useState({
    title: 'Authentication Error',
    message: 'An error occurred during authentication. Please try again.'
  });
  
  // Update error info after component mounts
  useEffect(() => {
    if (!searchParams) return;
    
    const errorCode = searchParams.get('error');
    if (errorCode && ERROR_MESSAGES[errorCode]) {
      setErrorInfo(ERROR_MESSAGES[errorCode]);
    }
  }, [searchParams]);  
  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertTriangleIcon className="h-5 w-5" />
        <AlertTitle>{errorInfo.title}</AlertTitle>
        <AlertDescription>{errorInfo.message}</AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/auth/login">Try Again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </>
  );
}
