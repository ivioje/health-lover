"use client";

import { useState, useEffect } from "react";
import { Diet } from "@/lib/types";
import { DietCard } from "@/components/diets/diet-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { searchKetoDiets, mapKetoDietToAppDiet } from "@/lib/api";
import { SearchParams, KetoDiet } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DietGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [apiDiets, setApiDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const [proteinMin, setProteinMin] = useState("0");
  const [proteinMax, setProteinMax] = useState("500");
  const [carbsMax, setCarbsMax] = useState("500");
  const [caloriesMax, setCaloriesMax] = useState("2000");
  
  useEffect(() => {
    loadInitialApiData();
  }, []);

  const loadInitialApiData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: SearchParams = {
        protein_in_grams__gt: "0",
        protein_in_grams__lt: "500",
        carbohydrates_in_grams__lt: "500",
        calories__lt: "2000"
      };
      
      const response = await searchKetoDiets(params);
      
      if (response && Array.isArray(response)) {
        const mappedDiets = response
          .filter(diet => diet && diet.recipe)
          .map((diet: KetoDiet) => mapKetoDietToAppDiet(diet));
        setApiDiets(mappedDiets);
      } else {
        setApiDiets([]);
        console.warn("No API results found or invalid response format");
      }
    } catch (err: any) {
      console.error("Error fetching initial keto diets:", err);
      setError(err.message || "Failed to fetch initial diets from API");
    } finally {
      setLoading(false);
    }
  };

  const safeIncludes = (text: string | undefined, search: string): boolean => {
    if (!text) return false;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  const filteredDiets = apiDiets.filter((diet) => {
    if (!diet) return false;
    if (!searchTerm) return true;
    
    const lowerSearch = searchTerm.toLowerCase();
    
    return safeIncludes(diet.name, lowerSearch) || 
           safeIncludes(diet.description, lowerSearch) ||
           (diet.tags && diet.tags.some(tag => 
             tag && tag.toLowerCase().includes(lowerSearch)
           ));
  });

  const totalPages = Math.ceil(filteredDiets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDiets = filteredDiets.slice(startIndex, startIndex + itemsPerPage);

  const allTags = Array.from(
    new Set(filteredDiets.flatMap(diet => diet.tags || []).filter(Boolean))
  ).sort();

  const dietsByTag: Record<string, Diet[]> = {
    all: filteredDiets,
  };

  allTags.forEach((tag) => {
    if (tag) {
      dietsByTag[tag] = filteredDiets.filter(diet => 
        diet.tags && diet.tags.includes(tag)
      );
    }
  });
  
  const searchApiDiets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: SearchParams = {
        protein_in_grams__gt: proteinMin,
        protein_in_grams__lt: proteinMax,
        carbohydrates_in_grams__lt: carbsMax,
        calories__lt: caloriesMax
      };
      
      const response = await searchKetoDiets(params);
      
      if (response && Array.isArray(response)) {
        const mappedDiets = response
          .filter(diet => diet && diet.recipe)
          .map((diet: KetoDiet) => mapKetoDietToAppDiet(diet));
        setApiDiets(mappedDiets);
        setCurrentPage(1);
      } else {
        setApiDiets([]);
        setError("No results found or invalid response format");
      }
    } catch (err: any) {
      console.error("Error fetching keto diets:", err);
      setError(err.message || "Failed to fetch diets from API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search diets by name, description, or tag..."
              className="pl-10 bg-background/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {showFilters && (
          <div className="flex flex-col space-y-4 p-4 bg-muted/30 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Min Protein (g)</label>
                <Input 
                  type="number" 
                  value={proteinMin}
                  onChange={(e) => setProteinMin(e.target.value)}
                  min="0"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Max Protein (g)</label>
                <Input 
                  type="number" 
                  value={proteinMax}
                  onChange={(e) => setProteinMax(e.target.value)}
                  min="0"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Max Carbs (g)</label>
                <Input 
                  type="number" 
                  value={carbsMax}
                  onChange={(e) => setCarbsMax(e.target.value)}
                  min="0"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Max Calories</label>
                <Input 
                  type="number" 
                  value={caloriesMax}
                  onChange={(e) => setCaloriesMax(e.target.value)}
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="default" 
                onClick={searchApiDiets}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search Keto Diets"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({length: 8}).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full overflow-x-auto py-2 flex justify-start mb-4 bg-transparent">
            <TabsTrigger value="all" className="rounded-full">
              All Diets
            </TabsTrigger>
            {allTags.map((tag) => (
              <TabsTrigger
                key={tag}
                value={tag}
                className="rounded-full whitespace-nowrap"
              >
                {tag.replace(/-/g, " ")}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedDiets.length > 0 ? (
                paginatedDiets.map((diet) => (
                  <DietCard key={diet.id} diet={diet} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No diets found matching your search criteria.
                  </p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {filteredDiets.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(curr => Math.max(1, curr - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(curr => Math.min(totalPages, curr + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          {allTags.map((tag) => (
            <TabsContent key={tag} value={tag} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dietsByTag[tag]?.length > 0 ? (
                  dietsByTag[tag].map((diet) => (
                    <DietCard key={diet.id} diet={diet} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      No diets found in this category matching your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      <div className="flex justify-center mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(paginatedDiets.length, itemsPerPage)} of {filteredDiets.length} keto diet recipes.
        </p>
      </div>
    </div>
  );
}