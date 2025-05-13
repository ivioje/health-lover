"use client";

import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDietStore } from '@/lib/stores/dietStore';

export default function SavedDietsPage() {
  const { savedDiets, isLoading, error, fetchSavedDiets, toggleSaveDiet } = useDietStore();
  
  useEffect(() => {
    fetchSavedDiets();
  }, [fetchSavedDiets]);
  
  const handleRemoveDiet = async (dietId: string) => {
    await toggleSaveDiet(dietId, true);
  };
  
  return (
    <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
      <div className="mb-8">
        <Link href="/dashboard" passHref>
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Your Saved Diets</h1>
        <p className="text-muted-foreground">
          All your favorite diets in one place
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({length: 8}).map((_, index) => (
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
          <Button onClick={() => fetchSavedDiets()}>Try Again</Button>
        </div>
      ) : savedDiets.length === 0 ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-muted-foreground"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Saved Diets Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't saved any diets to your collection yet.
            </p>
            <Link href="/diets">
              <Button>Browse Diets</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedDiets.map((diet) => (
            <Link 
              key={diet.id} 
              href={`/diets/${diet.id}`}
              className="transition-transform hover:scale-[1.01]"
            >
              <Card className="overflow-hidden h-full border border-border/50 bg-card/60 backdrop-blur-sm">
                <div className="relative h-48 w-full bg-muted">
                  {diet.imageUrl && (
                    <img 
                      src={diet.imageUrl} 
                      alt={diet.name} 
                      className="object-cover w-full h-full"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveDiet(diet.id);
                    }}
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-chart-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.46 12L4.93 5.47a.75.75 0 111.06-1.06L12 10.94l6.47-6.53a.75.75 0 111.06 1.06L13.06 12l6.47 6.47a.75.75 0 11-1.06 1.06L12 13.06l-6.47 6.47a.75.75 0 01-1.06-1.06L10.94 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{diet.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {diet.description.length > 100
                      ? `${diet.description.substring(0, 100)}...`
                      : diet.description}
                  </p>
                  
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}