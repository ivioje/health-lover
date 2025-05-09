import React from 'react'
import { Button } from '../ui/button';
import { FolderPlus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Tabs, TabsList } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface CreateCategoryProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    isLoading: boolean;
    handleCreateCategory: () => void;
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    categories: { id: string; name: string }[];
    tabTriggers: React.ReactNode;
    tabContents: React.ReactNode;
}

const CreateCategory: React.FC<CreateCategoryProps> = ({ 
    isDialogOpen, 
    setIsDialogOpen, 
    newCategoryName, 
    setNewCategoryName, 
    isLoading, 
    handleCreateCategory, 
    activeCategory, 
    setActiveCategory, 
    categories, 
    tabTriggers, 
    tabContents 
    }) => {
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
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeCategory} 
              onValueChange={setActiveCategory}
              defaultValue={categories[0]?.id}
            >
              <TabsList className="w-full justify-start mb-4 overflow-x-auto py-1 bg-transparent">
                {tabTriggers}
              </TabsList>
              {tabContents}
            </Tabs>
          </CardContent>
        </Card>
      );
}

export default CreateCategory