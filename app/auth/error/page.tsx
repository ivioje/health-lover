import { Suspense } from 'react';
import ErrorClient from '@/components/auth/error-client'; 

export default function AuthErrorPage() {
  return (
    <div className="container max-w-lg py-12 flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading error information...</div>}>
        <ErrorClient />
      </Suspense>
    </div>
  );
}