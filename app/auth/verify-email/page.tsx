"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
      
      setIsVerifying(true);
      
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerified(true);
        } else {
          setError(data.message || "Failed to verify email. Please try again.");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token]);

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
          <CardContent className="flex flex-col items-center justify-center py-10">
            {isVerifying ? (
              <div className="flex flex-col items-center space-y-4">
                <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
                <p className="text-center text-muted-foreground">
                  Verifying your email address...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 rounded-full bg-red-100">
                  <Icons.close className="h-10 w-10 text-red-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">Verification Failed</h3>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            ) : verified ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 rounded-full bg-green-100">
                  <Icons.success className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">Email Verified Successfully</h3>
                  <p className="text-muted-foreground">
                    Thank you for verifying your email address. You can now log in to your account.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="p-3 rounded-full bg-amber-100">
                  <Icons.warning className="h-10 w-10 text-amber-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold">Invalid Request</h3>
                  <p className="text-muted-foreground">
                    No verification token was provided. Please use the link from your verification email.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="default" 
              onClick={() => router.push("/auth/login")}
              className="w-full sm:w-auto"
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}