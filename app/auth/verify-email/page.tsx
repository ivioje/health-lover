"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("Verification token is missing");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          setIsVerified(true);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        } else {
          const postResponse = await fetch("/api/auth/verify-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          const postData = await postResponse.json();

          if (postResponse.ok) {
            setIsVerified(true);
            setTimeout(() => {
              router.push("/auth/login");
            }, 3000);
          } else {
            console.error("Verification error:", postData);
            setError(postData.message || "Failed to verify email address");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="container py-10 flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              Verifying your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 py-4">
            {isVerifying ? (
              <div className="flex flex-col items-center space-y-4">
                <Icons.spinner className="h-10 w-10 animate-spin text-primary" />
                <p>Verifying your email address...</p>
              </div>
            ) : isVerified ? (
              <>
                <div className="p-3 rounded-full bg-green-100">
                  <Icons.check className="h-10 w-10 text-green-600" />
                </div>
                <Alert className="border-green-500 bg-green-50">
                  <AlertDescription className="text-green-800">
                    Your email has been verified! Redirecting to login...
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-red-100">
                  <Icons.warning className="h-10 w-10 text-red-600" />
                </div>
                <Alert variant="destructive">
                  <AlertDescription>
                    {error || "Failed to verify your email address."}
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!isVerifying && !isVerified && (
              <div className="flex flex-col space-y-4 w-full">
                <Button 
                  className="w-full"
                  asChild
                >
                  <Link href="/auth/signup">
                    Try signing up again
                  </Link>
                </Button>
                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-primary hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
            {!isVerifying && isVerified && (
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}