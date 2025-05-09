"use client";

import { HealthPrediction } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthPredictionsProps {
  predictions: HealthPrediction[];
}

// to come from ML model
export function HealthPredictions({ predictions }: HealthPredictionsProps) {
  // determine icon based on risk level
  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
    }
  };

  // determine progress color based on risk level
  const getProgressColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-amber-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <CardTitle>Health Risk Predictions</CardTitle>
        <CardDescription>
          AI-powered analysis of potential health risks based on your diet and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {predictions.map((prediction) => (
            <div key={prediction.condition} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRiskIcon(prediction.risk)}
                  <span className="font-medium">{prediction.condition}</span>
                </div>
                <span className="text-sm text-muted-foreground capitalize">
                  {prediction.risk} Risk
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={prediction.score} 
                  max={100}
                  className={`h-2 ${prediction.risk === "low" ? "bg-secondary/70" : "bg-secondary/40"}`}
                />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(prediction.risk)}`} 
                  style={{ width: `${prediction.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{prediction.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}