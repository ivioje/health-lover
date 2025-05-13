"use client";

import Image from "next/image";
import Link from "next/link";
import { Diet } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, LoaderIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { saveDiet, removeSavedDiet, getUserData } from "@/lib/services/userService";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface DietCardProps {
  diet: Diet;
  initialSaved?: boolean;
}

export function DietCard({ diet, initialSaved = false }: DietCardProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();
  
  useEffect(() => {
    const checkIfSaved = async () => {
      if (session?.user) {
        try {
          const userData = await getUserData();
          const savedDiets = userData.savedDiets || [];
          setIsSaved(savedDiets.includes(diet.id));
        } catch (error) {
          console.error("Error checking saved status:", error);
        }
      }
    };
    
    checkIfSaved();
  }, [diet.id, session]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save diets",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    setIsLoading(true);
    
    try {
      if (isSaved) {
        await removeSavedDiet(diet.id);
        toast({
          title: "Diet removed",
          description: "Diet removed from your saved collection",
        });
      } else {
        await saveDiet(diet.id);
        toast({
          title: "Diet saved",
          description: "Diet saved to your collection",
        });
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling saved diet:", error);
      toast({
        title: "Error",
        description: "Failed to update saved diets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/diets/${diet.id}`} className="block h-full">
        <Card className="overflow-hidden h-full bg-card/80 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
          <div className="relative h-48 w-full">
            <Image
              src={diet.imageUrl}
              alt={diet.name}
              fill
              className="object-cover"
            />
            <Button
              size="icon"
              variant="secondary"
              className={`absolute top-2 right-2 rounded-full ${
                isSaved
                  ? "bg-chart-5 text-white hover:bg-chart-5/90"
                  : "bg-background/80 backdrop-blur-sm"
              }`}
              onClick={toggleSave}
              disabled={isLoading}
            >
              {saving ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-gray-800" />
              ) : <Heart
              className={`h-4 w-4 ${isSaved ? "fill-current" : ""} ${isLoading ? "animate-pulse" : ""}`}
            />}
            </Button>
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold mb-2">{diet.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {diet.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {diet.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-secondary/50 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">{diet.nutritionalFacts.calories}</span>{" "}
              <span className="text-muted-foreground">kcal</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-chart-5 hover:text-chart-5/90 hover:bg-chart-5/10"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}