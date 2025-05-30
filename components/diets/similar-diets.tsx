"use client";

import { useEffect, useState } from "react";
import { Diet } from "@/lib/types";
import { DietCard } from "@/components/diets/diet-card";
import { getSimilarDiets, trackDietView } from "@/lib/recommendation-api";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { getUserData } from "@/lib/services/userService";

interface SimilarDietsProps {
  dietId: string;
  userId?: string;
}

export default function SimilarDiets({ dietId, userId = 'default_user' }: SimilarDietsProps) {
  const [similarDiets, setSimilarDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  
  useEffect(() => {
    const fetchSimilarDiets = async () => {
      setLoading(true);
      try {
        if (userId) {
          await trackDietView(userId, dietId);
        }
        
        let userSavedDiets: string[] = [];
        if (status === 'authenticated') {
          try {
            const userData = await getUserData();
            userSavedDiets = userData.savedDiets || [];
          } catch (e) {
            console.log('Could not fetch user data for personalization');
          }
        }
        
        const diets = await getSimilarDiets(dietId, 4);
        
        if (userSavedDiets.length > 0) {
          diets.sort((a, b) => {
            const aIsSaved = userSavedDiets.includes(a.id);
            const bIsSaved = userSavedDiets.includes(b.id);
            
            if (aIsSaved && !bIsSaved) return -1;
            if (!aIsSaved && bIsSaved) return 1;
            return 0;
          });
        }
        
        setSimilarDiets(diets);
      } catch (error) {
        console.error('Error fetching similar diets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarDiets();
  }, [dietId, userId, status]);

  if (similarDiets.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : (
          similarDiets.map(diet => (
            <DietCard key={diet.id} diet={diet} />
          ))
        )}
      </div>
    </div>
  );
}
