"use client";

import { useEffect, useState } from "react";
import { diets, mockCategories, healthPredictions, recommendedDiets } from "@/lib/data";
import { UserProfile } from "@/lib/types";
import { UserSummary } from "@/components/dashboard/user-summary";
import { HealthPredictions } from "@/components/dashboard/health-predictions";
import { RecommendedDiets } from "@/components/dashboard/recommended-diets";
import { DietCategories } from "@/components/dashboard/diet-categories";
import { SummaryChart } from "@/components/dashboard/summary-chart";
import SavedDiets from "@/components/dashboard/saved-diets";

// Mock user data
const mockUser: UserProfile = {
  id: "1",
  name: "Alex Morgan",
  email: "alex@example.com",
  preferences: {
    dietaryRestrictions: ["gluten-free"],
    healthGoals: ["weight-loss", "increase-energy"],
    activityLevel: "moderate",
    age: 32,
  },
  categories: mockCategories,
  savedDiets: ["1", "3", "5"],
  healthPredictions: healthPredictions,
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // In a real app, this would fetch the user data from an API
    setUser(mockUser);
  }, []);

  if (!user) {
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

  return (
    <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Health Dashboard</h1>
          <span>Welcome back, <b>{user.name}</b></span> <br />
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
        <SavedDiets savedIds={recommendedDiets} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HealthPredictions predictions={user.healthPredictions} />
        <RecommendedDiets recommendedIds={recommendedDiets} />
      </div>

      <div className="mb-6">
        <DietCategories initialCategories={user.categories} />
      </div>
    </div>
  );
}