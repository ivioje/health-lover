"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Diet } from "@/lib/types";
import { diets as allDiets } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";

interface RecommendedDietsProps {
  recommendedIds: string[];
}

export function RecommendedDiets({ recommendedIds }: RecommendedDietsProps) {
  const [recommendedDiets, setRecommendedDiets] = useState<Diet[]>([]);

  useEffect(() => {
    // Find the diets that match the recommended IDs
    const foundDiets = allDiets.filter(diet => recommendedIds.includes(diet.id));
    setRecommendedDiets(foundDiets);
  }, [recommendedIds]);

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
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}