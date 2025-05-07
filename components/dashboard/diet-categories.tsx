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
import { set } from "date-fns";

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

  const createCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `category-${Date.now()}`,
        name: newCategoryName.trim(),
        dietIds: [],
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      setNewCategoryName("");
      setActiveCategory(newCategory.id);
      setIsDialogOpen(false);
    }
  };

  const deleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );
    setCategories(updatedCategories);
    if (activeCategory === categoryId && updatedCategories.length > 0) {
      setActiveCategory(updatedCategories[0].id);
    }
  };

  const getDietsForCategory = (categoryId: string): Diet[] => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return [];
    
    return allDiets.filter((diet) => category.dietIds.includes(diet.id));
  };

  const removeDietFromCategory = (categoryId: string, dietId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.filter((id) => id !== dietId),
          };
        }
        return category;
      })
    );
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
          <Dialog>
            <DialogTrigger onClick={() => setIsDialogOpen(true)} asChild>
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
                <Button disabled={!newCategoryName} onClick={createCategory}>Create Category</Button>
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
                  <span className="ml-1 text-xs bg-secondary/70 px-1.5 rounded-full">
                    {category.dietIds.length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => {
              const categoryDiets = getDietsForCategory(category.id);
              
              return (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">{category.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Delete Category
                    </Button>
                  </div>

                  <ScrollArea className="h-[240px] pr-4">
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
                                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                <span className="text-muted-foreground capitalize">
                                  {diet.tags[0].replace(/-/g, ' ')}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => removeDietFromCategory(category.id, diet.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <Folder className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                        <p className="text-muted-foreground mb-4">This category is empty</p>
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
                  <Button onClick={createCategory}>Create Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}