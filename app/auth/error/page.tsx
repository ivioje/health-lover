import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to ensure the component is only rendered client-side
const ErrorClient = dynamic(() => import('@/components/auth/error-client'), { 
  ssr: false,
  loading: () => <div className="text-center p-4">Loading error information...</div>
});

// This page needs to be dynamically rendered because it relies on search params
export const dynamicRendering = 'force-dynamic';

export default function AuthErrorPage() {
  return (
    <div className="container max-w-lg py-12 flex flex-col items-center justify-center">
      <Suspense fallback={<div className="text-center p-4">Loading error details...</div>}>
        <ErrorClient />
      </Suspense>
    </div>
  );
}