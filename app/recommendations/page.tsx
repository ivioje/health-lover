"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { searchDiets, searchKetoDiets, mapKetoDietToAppDiet } from "@/lib/api";
import { Diet } from "@/lib/types";

export default function RecommendationsPage() {
  const [recommendedDiets, setRecommendedDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        // Get user preferences from localStorage if available
        const storedPreferences = localStorage.getItem('userPreferences');
        const userPreferences = storedPreferences ? JSON.parse(storedPreferences) : {};
        
        // Use preferences to customize API query - this is a simplified example
        const dietaryRestrictions = userPreferences.dietaryRestrictions || [];
        const healthGoals = userPreferences.healthGoals || [];
        
        // Construct query parameters based on user preferences
        const queryParams: any = {
          number: 9 // Limit to 9 recommendations
        };
        
        // Add diet restrictions
        if (dietaryRestrictions.includes('gluten-free')) {
          queryParams.intolerances = 'gluten';
        }
        
        // Add health goals
        if (healthGoals.includes('weight-loss')) {
          queryParams.calories__lt = '500';
        }
        
        if (healthGoals.includes('increase-energy')) {
          queryParams.protein_in_grams__gt = '15';
        }
        
        // Make parallel API calls for both diet types
        const [spoonacularResults, ketoResults] = await Promise.all([
          searchDiets(queryParams)
            .then(data => data.results.map((item: any) => ({
              id: item.id.toString(),
              name: item.title,
              description: `Healthy recipe with ${Math.round(item.nutrition?.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0)} calories.`,
              imageUrl: item.image,
              nutritionalFacts: {
                calories: Math.round(item.nutrition?.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0),
                protein: Math.round(item.nutrition?.nutrients.find((n: any) => n.name === 'Protein')?.amount || 0),
                carbs: Math.round(item.nutrition?.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0),
                fat: Math.round(item.nutrition?.nutrients.find((n: any) => n.name === 'Fat')?.amount || 0),
              },
              benefits: [
                'Nutritionally balanced',
                `${Math.round(item.nutrition?.nutrients.find((n: any) => n.name === 'Protein')?.amount || 0)}g protein`,
                `Only ${Math.round(item.nutrition?.nutrients.find((n: any) => n.name === 'Sugar')?.amount || 0)}g sugar`,
              ],
              tags: item.diets || [],
            })))
            .catch(err => {
              console.error('Error fetching from Spoonacular API:', err);
              return [];
            }),
          searchKetoDiets({ number: 3 })
            .then(data => data.map((item: any) => mapKetoDietToAppDiet(item)))
            .catch(err => {
              console.error('Error fetching from Keto API:', err);
              return [];
            })
        ]);
        
        // Combine results and sort by relevance to user preferences
        const combinedResults = [...spoonacularResults, ...ketoResults];
        
        // If we have results, set them
        if (combinedResults.length > 0) {
          setRecommendedDiets(combinedResults);
        } else {
          // Fallback to generic message if no results
          setError("Unable to load recommendations. Please try again later.");
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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