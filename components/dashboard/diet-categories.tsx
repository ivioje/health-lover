"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Diet, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderPlus, Folder, Plus, X } from "lucide-react";
import { searchKetoDiets, mapKetoDietToAppDiet } from "@/lib/api";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { updateCategories, createCategory, getUserData } from "@/lib/services/userService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateCategory from "./create-category";
import CategoryTabs from "./category-tabs";

interface DietCategoriesProps {
  initialCategories: Category[];
}

export function DietCategories({ initialCategories }: DietCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0]?.id : ""
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [dietsLoading, setDietsLoading] = useState(true);

  useEffect(() => {
    const fetchDiets = async () => {
      setDietsLoading(true);
      try {
        const userData = await getUserData();
    
        const allDietIds = new Set<string>();
        categories.forEach(category => {
          if (category.dietIds) {
            category.dietIds.forEach(id => allDietIds.add(id));
          }
        });
        
        if (allDietIds.size === 0) {
          setDiets([]);
          setDietsLoading(false);
          return;
        }

        const userSavedDiets = userData.savedDiets || [];
        const dietsList: Diet[] = userSavedDiets.map((dietId) => {
          const diet = diets.find((d) => d.id === dietId);
          return diet || { 
            id: dietId, 
            name: "Unknown Diet", 
            imageUrl: "", 
            nutritionalFacts: { 
              calories: 0, 
              protein: 0, 
              carbs: 0, 
              fat: 0 
            }, 
            description: "No description available", 
            tags: [], 
            benefits: [], 
            sampleMeals: [] 
          };
        });
        
        const userDietIds = new Set(userSavedDiets);
        const missingDietIds = Array.from(allDietIds).filter(id => !userDietIds.has(id));
        
        if (missingDietIds.length > 0) {
          try {
            const ketoDiets = await searchKetoDiets();
            for (const id of missingDietIds) {
              const ketoDiet = ketoDiets.find((d: { id: { toString: () => string; }; }) => d.id.toString() === id);
              if (ketoDiet) {
                dietsList.push(mapKetoDietToAppDiet(ketoDiet));
              }
            }
          } catch (error) {
            console.error("Error fetching keto diets:", error);
          }
        }
        
        setDiets(dietsList);
      } catch (error) {
        console.error("Error fetching diets:", error);
        toast({
          title: "Error",
          description: "Failed to load diet information",
          variant: "destructive",
        });
      } finally {
        setDietsLoading(false);
      }
    };

    fetchDiets();
  }, [categories]);

  const handleCreateCategory = async () => {
    if (newCategoryName.trim()) {
      setIsLoading(true);
      try {
        const userData = await createCategory(newCategoryName.trim());
        setCategories(userData.categories);
        
        const newCategory = userData.categories[userData.categories.length - 1];
        setActiveCategory(newCategory.id);
        
        setNewCategoryName("");
        setIsDialogOpen(false);
        toast({
          title: "Category created",
          description: `"${newCategoryName.trim()}" has been created successfully.`,
        });
      } catch (error) {
        console.error("Error creating category:", error);
        toast({
          title: "Error",
          description: "Failed to create category. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryId
      );
      
      await updateCategories(updatedCategories);
      setCategories(updatedCategories);
      
      if (activeCategory === categoryId && updatedCategories.length > 0) {
        setActiveCategory(updatedCategories[0].id);
      }
      
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDietsForCategory = (categoryId: string): Diet[] => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category || !category.dietIds) return [];
    
    return diets.filter((diet) => category.dietIds.includes(diet.id));
  };

  const removeDietFromCategory = async (categoryId: string, dietId: string) => {
    setIsLoading(true);
    try {
      const updatedCategories = categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.filter((id) => id !== dietId),
          };
        }
        return category;
      });
      
      await updateCategories(updatedCategories);
      setCategories(updatedCategories);
      
      toast({
        title: "Diet removed",
        description: "The diet has been removed from this category.",
      });
    } catch (error) {
      console.error("Error removing diet from category:", error);
      toast({
        title: "Error",
        description: "Failed to remove diet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (categories.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Diet Categories</CardTitle>
              <CardDescription>
                Organize your saved diets into custom categories
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <FolderPlus className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
            <p className="text-muted-foreground mb-6">
              You haven't created any categories yet
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Create Your First Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a name for your new diet category.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="category-name-empty" className="mb-2 block">
                    Category Name
                  </Label>
                  <Input
                    id="category-name-empty"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Weekday Lunches"
                  />
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateCategory} 
                    disabled={!newCategoryName || isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Category"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tabTriggers = categories.map((category, index) => (
    <TabsTrigger
      key={`trigger-${category.id}-${index}`}
      value={category.id}
      className="flex items-center gap-1 data-[state=active]:bg-chart-5/10 data-[state=active]:text-chart-5"
    >
      <Folder className="h-4 w-4" />
      <span>{category.name}</span>
    </TabsTrigger>
  ));

  const tabContents = categories.map((category, index) => {
    const categoryDiets = getDietsForCategory(category.id);
    
    return (
      <CategoryTabs 
        key={`content-${category.id}-${index}`}
        category={category}
        index={index}
        categoryDiets={categoryDiets}
        handleDeleteCategory={handleDeleteCategory}
        isLoading={isLoading}
        dietsLoading={dietsLoading}
        dietIndex={index}
        diet={diets[index]}
        removeDietFromCategory={removeDietFromCategory}
      />
    );
  });

  <CreateCategory 
    isDialogOpen={isDialogOpen}
    setIsDialogOpen={setIsDialogOpen}
    newCategoryName={newCategoryName}
    setNewCategoryName={setNewCategoryName}
    isLoading={isLoading}
    handleCreateCategory={handleCreateCategory}
    activeCategory={activeCategory}
    setActiveCategory={setActiveCategory}
    categories={categories}
    tabTriggers={tabTriggers}
    tabContents={tabContents}
  />
}