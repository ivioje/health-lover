"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Diet } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSimilarDiets } from "@/lib/recommendation-api";
import { getUserPersonalizedRecommendations } from "@/lib/recommendation-service";

interface RecommendedDietsProps {
  recommendedIds?: string[];
  savedDiets?: string[];
}

// Uses AI recommendation engine to suggest diets
export function RecommendedDiets({ recommendedIds, savedDiets = [] }: RecommendedDietsProps) {
  const [recommendedDiets, setRecommendedDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Get AI-powered personalized recommendations based on user profile
        const personalizedDiets = await getUserPersonalizedRecommendations(5);
        
        if (personalizedDiets && personalizedDiets.length > 0) {
          setRecommendedDiets(personalizedDiets);
        } 
        // If no personalized recommendations or if we have saved diets, try to get recommendations based on saved diets
        else if (savedDiets && savedDiets.length > 0) {
          // Get similar diets based on the first saved diet
          const similarDiets = await getSimilarDiets(savedDiets[0], 5);
          setRecommendedDiets(similarDiets);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [savedDiets]);
  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI-Recommended Diets</CardTitle>
            <CardDescription>
              Personalized diet recommendations based on your preferences
            </CardDescription>
          </div>
          <Link href="/recommendations">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[280px] max-w-[300px]">
                <div className="rounded-lg overflow-hidden border border-border/50 h-[180px] bg-muted animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <ScrollArea className="-mx-4 px-4">
            <div className="flex space-x-4">
              {recommendedDiets.map((diet) => (
              <Link 
                key={diet.id} 
                href={`/diets/${diet.id}`} 
                className="min-w-[280px] max-w-[300px] transition-transform hover:scale-[1.02]"
              >
                <div className="rounded-lg overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm">
                  <div className="relative h-36 w-full">
                    <Image
                      src={diet.imageUrl}
                      alt={diet.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-chart-5" />
                      <span>Recommended</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{diet.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {diet.description}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{diet.nutritionalFacts.calories} kcal</span>
                      <span className="text-chart-5">View Diet</span>
                    </div>
                  </div>
                </div>
              </Link>            ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
      </CardContent>
    </Card>
  );
}