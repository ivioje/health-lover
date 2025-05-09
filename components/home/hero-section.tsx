import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Brain, LineChart, Activity } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/60 dark:from-background dark:to-background/60 -z-10" />
      
      {/* Floating circles decoration */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-chart-5/10 blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-chart-2/10 blur-3xl -z-10" />
      <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-chart-4/10 blur-3xl -z-10" />
      
      <div className="container px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter">
            Discover the Perfect Diet with{" "}
            <span className="bg-gradient-to-r from-chart-5 to-chart-4 bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Health Insights
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            HealthLover uses advanced machine learning to recommend personalized
            dietary plans and predict potential health risks, helping you achieve
            your optimal wellbeing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:w-auto w-full">
            <Button
              size="lg"
              className="bg-gradient-to-r from-chart-5 to-chart-4 hover:from-chart-5/90 hover:to-chart-4/90 text-white sm:w-auto w-full"
              asChild
            >
              <Link href="/diets">Explore Diets</Link>
            </Button>
            <Button size="lg" variant="outline" className="sm:w-auto w-full" asChild>
              <Link href="/preferences">Get Personalized Plan</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}