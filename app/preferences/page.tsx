"use client";

import { useState, useEffect } from "react";
import { PreferenceForm } from "@/components/preferences/preference-form";
import { getUserData } from "@/lib/services/userService";
import { UserProfile } from "@/lib/types";

export default function PreferencesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Loading preferences...</h1>
        </div>
        <div className="animate-pulse">
          <div className="h-16 bg-muted rounded-lg mb-6"></div>
          <div className="h-40 bg-muted rounded-lg mb-6"></div>
          <div className="h-40 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Error</h1>
        </div>
        <p className="text-muted-foreground">
          Failed to load user preferences. Please refresh the page or try again later.
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Preferences</h1>
        <p className="text-muted-foreground">
          Customize your dietary restrictions, health goals, and personal preferences to get
          tailored recommendations.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <PreferenceForm initialPreferences={user.preferences} />
      </div>
    </div>
  );
}