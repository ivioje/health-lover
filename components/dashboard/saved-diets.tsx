"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Diet } from "@/lib/types";
import { diets as allDiets } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShieldCheck, ArrowRight, HeartIcon } from "lucide-react";
import Image from "next/image";

interface SavedDietsProps {
  savedIds: string[];
}

const SavedDiets = ({ savedIds }: SavedDietsProps)  => {
    const [savedDiets, setSavedDiets] = useState<Diet[]>([]);

    useEffect(() => {
        // Find the diets that match the saved IDs
      const foundDiets = allDiets.filter(diet => savedIds.includes(diet.id));
      setSavedDiets(foundDiets);
    }, [savedIds]);

  return (
    <div>
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50 mt-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Saved Diets</CardTitle>
            <CardDescription>
              Find all your saved diets here.
            </CardDescription>
          </div>
          <Link href="/saved">
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="-mx-4 px-4">
          <div className="flex space-x-4">
            {savedDiets.map((diet) => (
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
                      <HeartIcon className="h-3 w-3 text-chart-5" />
                      <span>Saved</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{diet.name}</h3>
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
    </div>
  )
}

export default SavedDiets