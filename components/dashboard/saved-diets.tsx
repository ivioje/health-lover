"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Diet } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart as HeartIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import { removeSavedDiet } from "@/lib/services/userService";
import { toast } from "@/hooks/use-toast";
import { searchKetoDiets, mapKetoDietToAppDiet } from "@/lib/api";

interface SavedDietsProps {
  savedIds: string[];
}

export default function SavedDiets({ savedIds }: SavedDietsProps) {
  const [savedDiets, setSavedDiets] = useState<Diet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSavedDiets = async () => {
      if (!savedIds || savedIds.length === 0) {
        setSavedDiets([]);
        return;
      }

      setIsLoading(true);
      try {
        const apiDiets = await searchKetoDiets();

        if (apiDiets && Array.isArray(apiDiets)) {
          const savedIdsSet = new Set(savedIds);
          
          const mapped = apiDiets
            .filter(diet => {
              const dietId = diet.id.toString();
              return savedIdsSet.has(dietId);
            })
            .map(diet => mapKetoDietToAppDiet(diet));

          setSavedDiets(mapped);
        }
      } catch (error) {
        console.error("Error fetching saved diets:", error);
        toast({
          title: "Error",
          description: "Failed to load saved diets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedDiets();
  }, [savedIds]);
  
  const handleRemoveDiet = async (dietId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsLoading(true);
    try {
      await removeSavedDiet(dietId);
      toast({
        title: "Diet removed",
        description: "The diet has been removed from your saved diets.",
      });
      setSavedDiets(savedDiets.filter(diet => diet.id !== dietId));
    } catch (error) {
      console.error("Error removing saved diet:", error);
      toast({
        title: "Error",
        description: "Failed to remove diet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-2">
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
        {isLoading && 
          <div className="flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[280px] max-w-[300px] rounded-lg overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm">
                <div className="h-36 w-full bg-muted animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
}
        {savedDiets.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <HeartIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">You haven't saved any diets yet</p>
            <Link href="/diets">
              <Button variant="outline" size="sm">Browse Diets</Button>
            </Link>
          </div>
          )}

        {savedDiets.length > 0 && (
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
                     <Button
                       variant="ghost"
                       size="sm"
                       className="absolute top-2 left-2 h-7 w-7 p-0 rounded-full bg-background/80 backdrop-blur-sm"
                       onClick={(e) => handleRemoveDiet(diet.id, e)}
                       disabled={isLoading}
                     >
                       <span className="sr-only">Remove</span>
                       <HeartIcon className="h-4 w-4 fill-chart-5 text-chart-5" />
                     </Button>
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
        )}

      </CardContent>
    </Card>
    </div>
  )
}