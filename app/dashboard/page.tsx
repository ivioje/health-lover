"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";
import { UserSummary } from "@/components/dashboard/user-summary";
import { HealthPredictions } from "@/components/dashboard/health-predictions";
import { RecommendedDiets } from "@/components/dashboard/recommended-diets";
import { DietCategories } from "@/components/dashboard/diet-categories";
import { SummaryChart } from "@/components/dashboard/summary-chart";
import SavedDiets from "@/components/dashboard/saved-diets";
import { getUserData } from "@/lib/services/userService";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserData();
        console.log('Fetched user data:', userData);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex items-center justify-center h-[500px]">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 bg-muted rounded-md mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-muted rounded-md mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center justify-center h-[500px] text-center">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Health Dashboard</h1>
        <span>Welcome back, <b>{user.name || 'User'}</b></span> <br />
        <p className="text-muted-foreground text-left text-sm mt-2">
          Track your health metrics, view personalized recommendations, and manage your diet categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SummaryChart />
        </div>
        <div>
          <UserSummary user={user} />
          <SavedDiets savedIds={user.savedDiets || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {user.healthPredictions && user.healthPredictions.length > 0 ? (
          <HealthPredictions predictions={user.healthPredictions} />
        ) : (
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Health Predictions</h2>
            <p className="text-muted-foreground">
              No health predictions available yet. Complete your health profile to get personalized insights.
            </p>
          </div>
        )}
        <RecommendedDiets savedDiets={user.savedDiets || []} />
      </div>

      <p>Categories below</p>
      <div className="mb-6">
        <DietCategories userCategories={user.categories || []} />
      </div>
    </div>
  );
}