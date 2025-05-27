"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { searchDiets, searchKetoDiets, mapKetoDietToAppDiet, getPersonalizedRecommendations, getHybridRecommendations, mapFastAPIRecommendationToAppDiet, UserPreferences } from "@/lib/api";
import { Diet } from "@/lib/types";

export default function RecommendationsPage() {
  const [recommendedDiets, setRecommendedDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        const storedPreferences = localStorage.getItem('userPreferences');
        const userPreferences = storedPreferences ? JSON.parse(storedPreferences) : {};
        const dietaryRestrictions = userPreferences.dietaryRestrictions || [];
        const healthGoals = userPreferences.healthGoals || [];
        const activityLevel = userPreferences.activityLevel || 'moderate';
        
        // Try FastAPI backend first
        try {
          const userId = localStorage.getItem('userId') || 'default_user';
          
          const fastApiPreferences: UserPreferences = {
            dietary_restrictions: dietaryRestrictions,
            health_goals: healthGoals,
            activity_level: activityLevel,
            preferred_cuisines: userPreferences.preferredCuisines || [],
            disliked_ingredients: userPreferences.dislikedIngredients || []
          };

          const request = {
            user_id: userId,
            preferences: fastApiPreferences,
            num_recommendations: 8
          };

          // Try personalized recommendations if user has liked recipes
          const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
          let fastApiResponse;
          
          if (likedRecipes.length > 0) {
            fastApiResponse = await getPersonalizedRecommendations({
              ...request,
              liked_recipes: likedRecipes
            });
          } else {
            fastApiResponse = await getHybridRecommendations(request);
          }

          if (fastApiResponse && fastApiResponse.recommendations.length > 0) {
            const mappedDiets = fastApiResponse.recommendations.map(rec => 
              mapFastAPIRecommendationToAppDiet(rec)
            );
            setRecommendedDiets(mappedDiets);
            console.log(`Found ${mappedDiets.length} AI-recommended diets`);
            return;
          }
        } catch (fastApiError) {
          console.log('FastAPI recommendations failed, falling back to existing logic:', fastApiError);
        }
        
        // Fallback to existing recommendation logic
        const ketoDiets = await searchKetoDiets({ number: 20 });
        let filteredDiets = ketoDiets;
        
        // Apply dietary restrictions filtering
        if (dietaryRestrictions.includes('gluten-free')) {
          filteredDiets = filteredDiets.filter((diet: any) => 
            !diet.ingredient_1?.includes('gluten') && 
            !diet.ingredient_2?.includes('gluten') &&
            !diet.ingredient_3?.includes('gluten')
          );
        }
        
        // Apply health goals filtering
        if (healthGoals.includes('weight-loss')) {
          filteredDiets = filteredDiets.filter((diet: any) => 
            diet.calories < 500
          );
        }
        
        if (healthGoals.includes('increase-energy')) {
          filteredDiets = filteredDiets.filter((diet: any) => 
            diet.protein_in_grams > 15
          );
        }
        
        // Sort by relevance (for now, just sort by protein content as an example)
        filteredDiets.sort((a: any, b: any) => 
          (b.protein_in_grams || 0) - (a.protein_in_grams || 0)
        );
        
        // Take only the first 8 diets
        const topDiets = filteredDiets.slice(0, 8);
        
        // Map to application diet format
        const mappedDiets = topDiets.map((diet: any) => mapKetoDietToAppDiet(diet));
        
        console.log(`Found ${mappedDiets.length} recommended diets`);
        
        // Set the diets in state
        if (mappedDiets.length > 0) {
          setRecommendedDiets(mappedDiets);
        } else {
          // Fallback if no filtered results found
          const defaultDiets = ketoDiets.slice(0, 8).map((diet: any) => mapKetoDietToAppDiet(diet));
          setRecommendedDiets(defaultDiets);
          console.log('Using default recommendations as no filtered results were found');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError("An error occurred while fetching your personalized recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
      <div className="mb-8">
        <Link href="/dashboard" passHref>
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-6 w-6 text-chart-5" />
          <h1 className="text-3xl font-bold">AI Recommended Diets</h1>
        </div>
        <p className="text-muted-foreground">
          Personalized diet recommendations tailored to your health profile, preferences, and goals
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length: 6}).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="bg-muted/30 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Oops! Something went wrong</h2>
          <p className="mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <>
          <div className="bg-muted/30 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-3">Why These Diets?</h2>
            <p className="mb-4">
              Our AI system has analyzed your health data, dietary preferences, and health goals to recommend these specific diets that may help you achieve optimal wellbeing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background/80 p-4 rounded-md">
                <h3 className="font-medium mb-2">Based on Your Health Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Your goals of weight loss and increased energy have been matched with diets proven to support these outcomes.
                </p>
              </div>
              <div className="bg-background/80 p-4 rounded-md">
                <h3 className="font-medium mb-2">Considering Your Restrictions</h3>
                <p className="text-sm text-muted-foreground">
                  These recommendations account for your gluten-free dietary restriction.
                </p>
              </div>
              <div className="bg-background/80 p-4 rounded-md">
                <h3 className="font-medium mb-2">Activity Level Optimized</h3>
                <p className="text-sm text-muted-foreground">
                  Nutrition plans suited for your moderate activity level with balanced macronutrients.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedDiets.map((diet) => (
              <Link 
                key={diet.id} 
                href={`/diets/${diet.id}`}
                className="transition-transform hover:scale-[1.01]"
              >
                <Card className="overflow-hidden h-full border border-border/50 bg-card/60 backdrop-blur-sm">
                  <div className="relative h-48 w-full">
                    <Image
                      src={diet.imageUrl}
                      alt={diet.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-chart-5" />
                      <span>AI Recommended</span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold mb-2">{diet.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{diet.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-muted/40 p-2 rounded text-xs">
                        <span className="block text-muted-foreground">Calories</span>
                        <span className="font-medium">{diet.nutritionalFacts.calories} kcal</span>
                      </div>
                      <div className="bg-muted/40 p-2 rounded text-xs">
                        <span className="block text-muted-foreground">Protein</span>
                        <span className="font-medium">{diet.nutritionalFacts.protein}g</span>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium mb-2">Benefits</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {diet.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-5"></div>
                          {benefit}
                        </li>
                      ))}
                      {diet.benefits.length > 2 && (
                        <li className="text-xs text-chart-5">+ {diet.benefits.length - 2} more benefits</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}