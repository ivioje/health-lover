"use client";

import { useState, useEffect } from "react";
import { Diet, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { FolderPlus, Folder, Plus, X } from "lucide-react";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateCategory from "./create-category";
import CategoryTabs from "./category-tabs";
import { useCategoryStore } from "@/lib/stores/categoryStore"; 
import { useDietStore } from "@/lib/stores/dietStore";

interface DietCategoriesProps {
  userCategories: Category[];
}

export function DietCategories({ userCategories }: DietCategoriesProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dietsLoading, setDietsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [operation, setOperation] = useState("loading");
  
  const { 
    categories, 
    activeCategory, 
    setActiveCategory,
    setCategories,
    isLoading, 
    createCategory: createCategoryAction,
    deleteCategory,
    removeDietFromCategory: removeDietAction
  } = useCategoryStore();
  const { diets, fetchDiets, searchDiets, isLoading: dietsStoreLoading } = useDietStore();
  
  useEffect(() => {
    if (userCategories?.length > 0) {
      setCategories(userCategories);
      setActiveCategory(userCategories[0]?._id || "");
    }
  }, [userCategories, setCategories, setActiveCategory]);
  
  useEffect(() => {
    const loadDietsForCategories = async () => {
      setOperation("loading");
      setDietsLoading(true);
      
      const allDietIds = new Set<string>();
      categories.forEach(category => {
        if (category.dietIds) {
          category.dietIds.forEach(id => allDietIds.add(id));
        }
      });
      
      if (allDietIds.size === 0) {
        setDietsLoading(false);
        setOperation("empty");
        return;
      }

      try {
        if (searchQuery) {
          await searchDiets(searchQuery);
        } else {
          await fetchDiets();
        }
      } catch (error) {
        console.error("Error fetching diets:", error);
        toast({
          title: "Error",
          description: "Failed to load diet information",
          variant: "destructive",
        });
      } finally {
        setDietsLoading(false);
        setOperation("");
      }
    };

    loadDietsForCategories();
  }, [categories, fetchDiets, searchQuery, searchDiets]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setOperation("searching");
  };

  const handleCreateCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategory = await createCategoryAction(newCategoryName.trim());
      if (newCategory) {
        setNewCategoryName("");
        setIsDialogOpen(false);
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  const getDietsForCategory = (categoryId: string): Diet[] => {
    const category = categories.find((c) => c._id === categoryId);
    if (!category || !category.dietIds) return [];
    
    return diets.filter((diet) => category.dietIds.includes(diet.id));
  };

  const removeDietFromCategory = async (categoryId: string, dietId: string) => {
    await removeDietAction(categoryId, dietId);
  };

  if (categories.length === 0 && operation === "empty") {
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

  if (categories.length === 0 && operation === "searching") {
    return (
      <div className="text-muted-foreground">No diet found for <i className="font-semibold">{searchQuery}</i></div>
    )
  }


  const tabTriggers = categories.map((category, index) => (
    <TabsTrigger
      key={category._id}
      value={category._id}
      onClick={() => setActiveCategory(category._id)}
      className="flex items-center gap-1 data-[state=active]:bg-chart-5/10 data-[state=active]:text-chart-5"
    >
      <Folder className="h-4 w-4" />
      <span>{category.name}</span>
    </TabsTrigger>
  ));

  const tabContents = categories.map((category, index) => {
    const categoryDiets = getDietsForCategory(category._id);
    return (
      <TabsContent key={category._id} value={category._id}>
        <CategoryTabs
          category={{ ...category, id: category._id }}
          index={index}
          categoryDiets={categoryDiets}
          handleDeleteCategory={handleDeleteCategory}
          isLoading={isLoading}
          dietsLoading={dietsLoading || dietsStoreLoading}
          removeDietFromCategory={removeDietFromCategory}
        />
      </TabsContent>
    );
  });
  return (
    <CreateCategory 
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      newCategoryName={newCategoryName}
      setNewCategoryName={setNewCategoryName}
      isLoading={isLoading}
      handleCreateCategory={handleCreateCategory}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
      categories={categories.map(({ _id, name }) => ({ id: _id, name }))}
      tabTriggers={tabTriggers}
      tabContents={tabContents}
      searchQuery={searchQuery}
      handleSearch={handleSearch}
    />
  );
}