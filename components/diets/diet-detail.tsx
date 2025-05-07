"use client";

import { useState } from "react";
import Image from "next/image";
import { Diet, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Check, 
  Heart, 
  Plus, 
  Folder, 
  FolderPlus
} from "lucide-react";
import { mockCategories } from "@/lib/data";

interface DietDetailProps {
  diet: Diet;
}

export function DietDetail({ diet }: DietDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const addToCategory = (categoryId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.includes(diet.id)
              ? category.dietIds
              : [...category.dietIds, diet.id],
          };
        }
        return category;
      })
    );
  };

  const removeFromCategory = (categoryId: string) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.filter((id) => id !== diet.id),
          };
        }
        return category;
      })
    );
  };

  const createCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `new-${Date.now()}`,
        name: newCategoryName.trim(),
        dietIds: [diet.id],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setDialogOpen(false);
    }
  };

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

            <div className="flex gap-4">
              <Button
                onClick={toggleSave}
                className={`flex-1 ${
                  isSaved
                    ? "bg-chart-5 hover:bg-chart-5/90 text-white"
                    : "bg-card border border-chart-5/50 text-chart-5 hover:bg-chart-5/10"
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`}
                />
                {isSaved ? "Saved" : "Save Diet"}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
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