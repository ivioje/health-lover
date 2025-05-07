"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Diet, Category } from "@/lib/types";
import { diets as allDiets } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus, Folder, Plus, X } from "lucide-react";
import { updateCategories, createCategory } from "@/lib/services/userService";
import { toast } from "@/hooks/use-toast";

interface DietCategoriesProps {
  initialCategories: Category[];
}

export function DietCategories({ initialCategories }: DietCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].id : ""
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCategory = async () => {
    if (newCategoryName.trim()) {
      setIsLoading(true);
      try {
        const userData = await createCategory(newCategoryName.trim());
        
        // Update local state with the new categories from the database
        setCategories(userData.categories);
        
        // Set the newly created category as active
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
    if (!category) return [];
    
    return allDiets.filter((diet) => category.dietIds.includes(diet.id));
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <FolderPlus className="h-4 w-4" />
                <span>New Category</span>
              </Button>
            </DialogTrigger>
            {isDialogOpen && (
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a name for your new diet category.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="category-name" className="mb-2 block">
                  Category Name
                </Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Weekday Lunches"
                />
              </div>
              <DialogFooter>
                <Button 
                  disabled={!newCategoryName || isLoading} 
                  onClick={handleCreateCategory}
                >
                  {isLoading ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
            )}
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          <Tabs 
            value={activeCategory} 
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-4 overflow-x-auto py-1 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-1 data-[state=active]:bg-chart-5/10 data-[state=active]:text-chart-5"
                >
                  <Folder className="h-4 w-4" />
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => {
              const categoryDiets = getDietsForCategory(category.id);
              
              return (
                <TabsContent key={category.id} value={category.id} className="mt-0">
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

                    {categoryDiets.length > 0 ? (
                      <div className="space-y-3">
                        {categoryDiets.map((diet) => (
                          <div 
                            key={diet.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-background/60 border border-border/30 hover:bg-background/80"
                          >
                            <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={diet.imageUrl}
                                alt={diet.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <Link href={`/diets/${diet.id}`}>
                                <h4 className="font-medium text-sm hover:text-chart-5 transition-colors truncate">
                                  {diet.name}
                                </h4>
                              </Link>
                              <div className="flex gap-2 items-center text-xs">
                                <span className="text-muted-foreground">
                                  {diet.nutritionalFacts.calories} kcal
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
            })}
          </Tabs>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}