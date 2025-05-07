"use client";

import { UserProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Salad, Bike, Calendar } from "lucide-react";

interface UserSummaryProps {
  user: UserProfile;
}

export function UserSummary({ user }: UserSummaryProps) {
  const getActivityLevelIcon = () => {
    switch (user.preferences.activityLevel.toLowerCase()) {
      case "low":
        return <Calendar className="h-4 w-4" />;
      case "moderate":
        return <Bike className="h-4 w-4" />;
      case "high":
        return <Bike className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-4 border-background">
            <AvatarFallback className="text-xl bg-gradient-to-br from-chart-5 to-chart-4 text-primary-foreground">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-3 rounded-lg bg-background/60 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 rounded-full bg-chart-5/20 flex items-center justify-center mb-1">
              <Salad className="h-4 w-4 text-chart-5" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Saved Diets</p>
            <p className="font-semibold">{user.savedDiets.length}</p>
          </div>

          <div className="p-3 rounded-lg bg-background/60 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 rounded-full bg-chart-2/20 flex items-center justify-center mb-1">
              <BarChart className="h-4 w-4 text-chart-2" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Categories</p>
            <p className="font-semibold">{user.categories.length}</p>
          </div>

          <div className="p-3 rounded-lg bg-background/60 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 rounded-full bg-chart-4/20 flex items-center justify-center mb-1">
              {getActivityLevelIcon()}
            </div>
            <p className="text-xs text-muted-foreground mb-1">Activity</p>
            <p className="font-semibold capitalize">
              {user.preferences.activityLevel}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}