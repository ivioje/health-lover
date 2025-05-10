"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Diet, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Heart, Plus, Folder, FolderPlus } from "lucide-react";
import { getUserData, createCategory as createCategoryAPI, updateCategories } from "@/lib/services/userService";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface DietDetailProps {
  diet: Diet;
}

export function DietDetail({ diet }: DietDetailProps) {
  const { data: session, status } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    const fetchCategories = async () => {
      try {
        const user = await getUserData();
        setCategories(user.categories || []);
      } catch (e) {
        toast({
          title: "Failed to load categories",
        })
        
      }
    };
    fetchCategories();
  }, [session]);

  const addToCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const updatedCategories = categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.includes(diet.id)
              ? category.dietIds
              : [...category.dietIds, diet.id],
          };
        }
        return category;
      });
      await updateCategories(updatedCategories);
      setCategories(updatedCategories);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const updatedCategories = categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.filter((id) => id !== diet.id),
          };
        }
        return category;
      });
      await updateCategories(updatedCategories);
      setCategories(updatedCategories);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (newCategoryName.trim()) {
      setLoading(true);
      try {
        const user = await createCategoryAPI(newCategoryName.trim());
        const newCat = user.categories[user.categories.length - 1];
        const updatedCategories = user.categories.map((cat) =>
          cat.id === newCat.id
            ? { ...cat, dietIds: [...cat.dietIds, diet.id] }
            : cat
        );
        await updateCategories(updatedCategories);
        setCategories(updatedCategories);
        setNewCategoryName("");
        setDialogOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
      await updateCategories(updatedCategories);
      setCategories(updatedCategories);
    } finally {
      setLoading(false);
    }
  };

  function toggleSave(): void {
    setIsSaved((prev) => !prev);
    toast({
      title: isSaved ? "Diet removed from saved" : "Diet saved successfully",
    });
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-3 sm:px-10 md:px-16">
      <div className="lg:col-span-2 space-y-8">
        <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden">
          <Image
            src={diet.imageUrl}
            alt={diet.name}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{diet.name}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {diet.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-secondary/50"
              >
                {tag.replace(/-/g, " ")}
              </Badge>
            ))}
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            {diet.description}
          </p>

          <h2 className="text-xl font-semibold mb-4">Health Benefits</h2>
          <ul className="space-y-2 mb-8">
            {diet.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-chart-5 mr-2 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-20 bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle>Nutritional Information</CardTitle>
            <CardDescription>
              Key macronutrients for this diet plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{diet.nutritionalFacts.calories} kcal</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-5"
                  style={{ width: `${(diet.nutritionalFacts.calories / 2500) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Carbs</span>
                <span className="font-medium">{diet.nutritionalFacts.carbs}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2"
                  style={{ width: `${diet.nutritionalFacts.carbs}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{diet.nutritionalFacts.protein}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-3"
                  style={{ width: `${diet.nutritionalFacts.protein}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Fat</span>
                <span className="font-medium">{diet.nutritionalFacts.fat}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-4"
                  style={{ width: `${diet.nutritionalFacts.fat}%` }}
                />
              </div>
            </div>

            <Separator className="my-4" />
            {!session && <span className="text-sm text-muted-foreground">Sign in to save and add diets to your categories.</span>}

            <div className="flex gap-4">
              <Button
                onClick={toggleSave}
                className={`flex-1 disabled:cursor-not-allowed ${
                  isSaved
                    ? "bg-chart-5 hover:bg-chart-5/90 text-white"
                    : "bg-card border border-chart-5/50 text-chart-5 hover:bg-chart-5/10"
                }`}
                disabled={!session}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`}
                />
                {isSaved ? "Saved" : "Save Diet"}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="disabled:cursor-not-allowed" disabled={!session}>
                    <Folder className="h-4 w-4 mr-2" />
                    Add to Category
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                  <div className="p-2">
                    <div className="text-sm font-medium mb-2">Your Categories</div>
                    <ScrollArea className="h-[180px]">
                      {categories.map((category) => {
                        const isInCategory = category.dietIds.includes(diet.id);
                        return (
                          <div
                            key={category.id}
                            className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                            onClick={() =>
                              isInCategory
                                ? removeFromCategory(category.id)
                                : addToCategory(category.id)
                            }
                          >
                            <span>{category.name}</span>
                            {isInCategory ? (
                              <Check className="h-4 w-4 text-chart-5" />
                            ) : (
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Button variant="ghost" onClick={() => deleteCategory(category.id)} disabled={loading}>Delete</Button>
                          </div>
                        );
                      })}
                    </ScrollArea>
                  </div>
                  <Separator />
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <div className="px-2 py-3 text-sm flex items-center hover:bg-accent cursor-pointer">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        <span>Create New Category</span>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                          Add a name for your new diet category.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="name" className="mb-2 block">
                          Category Name
                        </Label>
                        <Input
                          id="name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Breakfast Ideas"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createCategory}>Create</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}