import React from 'react'
import { TabsContent } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { FolderPlus, Plus, X } from 'lucide-react';

interface Diet {
  id: string;
  name?: string;
  imageUrl?: string;
  nutritionalFacts?: {
    calories?: number;
  };
}

interface CategoryTabsProps {
  category: { id: string; name: string };
  index: number;
  categoryDiets: Diet[];
  handleDeleteCategory: (categoryId: string) => void;
  isLoading: boolean;
  dietsLoading: boolean;
  dietIndex?: number;
  diet?: Diet;
  removeDietFromCategory: (categoryId: string, dietId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
    category, 
    categoryDiets, 
    handleDeleteCategory, 
    isLoading, 
    dietsLoading, 
    removeDietFromCategory 
    }) => {
    return (
        <TabsContent 
          key={category.id} 
          value={category.id} 
          className="mt-0"
        >
          <ScrollArea className="h-[400px] pr-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {categoryDiets.length} {categoryDiets.length === 1 ? 'diet' : 'diets'}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleDeleteCategory(category.id)}
                disabled={isLoading}
              >
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Delete Category</span>
              </Button>
            </div>
  
            {dietsLoading ? (
              <div className="flex flex-col space-y-3">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg bg-background/60 border border-border/30 animate-pulse"
                  >
                    <div className="h-12 w-12 rounded-md bg-muted"></div>
                    <div className="flex-grow">
                      <div className="h-4 w-3/4 bg-muted rounded mb-1"></div>
                      <div className="h-3 w-1/4 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : categoryDiets.length > 0 ? (
              <div className="space-y-3">
                {categoryDiets.map((diet, dietIndex) => (
                  <div 
                    key={diet.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-background/60 border border-border/30 hover:bg-background/80"
                  >
                    <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={diet.imageUrl || "/assets/placeholder.jpg"}
                        alt={diet.name || "Diet"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link href={`/diets/${diet.id}`}>
                        <h4 className="font-medium text-sm hover:text-chart-5 transition-colors truncate">
                          {diet.name || "Unnamed Diet"}
                        </h4>
                      </Link>
                      <div className="flex gap-2 items-center text-xs">
                        <span className="text-muted-foreground">
                          {diet.nutritionalFacts?.calories || 0} kcal
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDietFromCategory(category.id, diet.id)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <FolderPlus className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                <p className="text-muted-foreground mb-4">
                  This category is empty
                </p>
                <Link href="/diets">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Diets
                  </Button>
                </Link>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      );
}

export default CategoryTabs