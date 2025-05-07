"use client";

import { useState, useEffect } from "react";
import { DietDetail } from "@/components/diets/diet-detail";
import { notFound } from "next/navigation";
import { Diet } from "@/lib/types";
import { getKetoDietById, mapKetoDietToAppDiet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DietDetailClientProps {
  dietId: string;
}

export default function DietDetailClient({ dietId }: DietDetailClientProps) {
  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDiet() {
      try {
        const apiDiet = await getKetoDietById(parseInt(dietId));
        if (apiDiet) {
          setDiet(mapKetoDietToAppDiet(apiDiet));
        } else {
          notFound();
        }
      } catch (err: any) {
        console.error("Error fetching diet:", err);
        setError(err.message || "Failed to load diet details");
      } finally {
        setLoading(false);
      }
    }
    
    loadDiet();
  }, [dietId]);

  if (error) {
    return (
      <div className="space-y-6 px-3 sm:px-10 md:px-16">
        <Link href="/diets" passHref>
          <Button variant="outline" size="sm" className="mb-4 px-3 sm:px-10 md:px-16">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Diet Gallery
          </Button>
        </Link>
        
        <div className="bg-red-50 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!diet && !loading) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/diets" passHref>
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Diet Gallery
        </Button>
      </Link>
      
      {diet ? <DietDetail diet={diet} /> : null}
    </div>
  );
}