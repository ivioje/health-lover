"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/ui/icons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration. Please try again later or contact support if this problem persists.";
      case "AccessDenied":
        return "Access denied. You don't have permission to sign in.";
      case "Verification":
        return "Your email verification link has expired or has already been used.";
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "OAuthAccountNotLinked":
        return "There was a problem with your social sign in. Please try again or use a different method.";
      case "EmailSignin":
        return "The email sign in link is invalid or has expired. Please request a new sign in email.";
      case "CredentialsSignin":
        return "Invalid login credentials. Please check your email and password and try again.";
      case "SessionRequired":
        return "You need to be signed in to access this page.";
      case "Default":
      default:
        return "An unexpected authentication error occurred. Please try again later.";
    }
  };

  return (
    <div className="container py-10 flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Authentication Error</CardTitle>
            <CardDescription className="text-center">
              There was a problem with your authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 py-4">
            <div className="p-3 rounded-full bg-red-100">
              <Icons.warning className="h-10 w-10 text-red-600" />
            </div>

            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage()}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full"
              asChild
            >
              <Link href="/auth/login">
                Return to Login
              </Link>
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link
                href="/"
                className="text-primary hover:underline"
              >
                Back to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}