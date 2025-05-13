'use client';

import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorClient() {  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  let title = 'Authentication Error';
  let message = 'An error occurred during authentication. Please try again.';
  
  if (error === 'OAuthAccountNotLinked') {
    title = 'Account Already Exists';
    message = 'An account with this email already exists. Please sign in with the provider you used initially.';
  } else if (error === 'CredentialsSignin') {
    title = 'Invalid Credentials';
    message = 'The email or password you entered is incorrect. Please try again.';
  } else if (error === 'AccessDenied') {
    title = 'Access Denied';
    message = 'You do not have permission to access this resource.';
  } else if (error === 'Verification') {
    title = 'Verification Required';
    message = 'Please verify your email address before signing in.';
  } else if (error === 'Default') {
    title = 'Authentication Failed';
    message = 'An unknown error occurred during sign in. Please try again later.';
  }
  
  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertTriangleIcon className="h-5 w-5" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/auth/signin">Try Again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back Home</Link>
        </Button>
      </div>
    </>
  );
}
