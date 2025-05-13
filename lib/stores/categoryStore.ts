import { create } from 'zustand';
import { Category } from '@/lib/types';
import { getUserData, createCategory as createCategoryAPI, updateCategories } from '@/lib/services/userService';
import { toast } from '@/hooks/use-toast';

interface CategoryState {
  categories: Category[];
  activeCategory: string;
  isLoading: boolean;
  error: string | null;
  
  setCategories: (categories: Category[]) => void;
  setActiveCategory: (categoryId: string) => void;
  
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<Category | null>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addDietToCategory: (categoryId: string, dietId: string) => Promise<void>;
  removeDietFromCategory: (categoryId: string, dietId: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  activeCategory: "",
  isLoading: false,
  error: null,
  
  setCategories: (categories) => set({ categories }),
  setActiveCategory: (categoryId) => set({ activeCategory: categoryId }),
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const userData = await getUserData();
      const categories = userData.categories || [];
      set({ 
        categories,
        activeCategory: categories.length > 0 ? categories[0]._id : ""
      });
      return;
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ error: "Failed to load categories" });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createCategory: async (name) => {
    if (!name.trim()) return null;
    
    set({ isLoading: true, error: null });
    try {
      const userData = await createCategoryAPI(name.trim());
      const newCategories = userData.categories;
      const newCategory = newCategories[newCategories.length - 1];
      
      set({ 
        categories: newCategories,
        activeCategory: newCategory._id
      });
      
      toast({
        title: "Category created",
        description: `"${name.trim()}" has been created successfully.`,
      });
      
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      set({ error: "Failed to create category" });
      
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const { categories, activeCategory } = get();
      const updatedCategories = categories.filter(
        (category) => category._id !== categoryId
      );
      
      await updateCategories(updatedCategories);
      
      // If deleted category was active, set new active category
      let newActiveCategory = activeCategory;
      if (activeCategory === categoryId && updatedCategories.length > 0) {
        newActiveCategory = updatedCategories[0]._id;
      }
      
      set({ 
        categories: updatedCategories,
        activeCategory: newActiveCategory
      });
      
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      set({ error: "Failed to delete category" });
      
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addDietToCategory: async (categoryId, dietId) => {
    set({ isLoading: true, error: null });
    try {
      const { categories } = get();
      const updatedCategories = categories.map((category) => {
        if (category._id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.includes(dietId)
              ? category.dietIds
              : [...category.dietIds, dietId],
          };
        }
        return category;
      });
      
      await updateCategories(updatedCategories);
      set({ categories: updatedCategories });
      
      toast({
        title: "Diet added",
        description: "Diet has been added to the category.",
      });
    } catch (error) {
      console.error("Error adding diet to category:", error);
      set({ error: "Failed to add diet to category" });
      
      toast({
        title: "Error",
        description: "Failed to add diet to category. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeDietFromCategory: async (categoryId, dietId) => {
    set({ isLoading: true, error: null });
    try {
      const { categories } = get();
      const updatedCategories = categories.map((category) => {
        if (category._id === categoryId) {
          return {
            ...category,
            dietIds: category.dietIds.filter((id) => id !== dietId),
          };
        }
        return category;
      });
      
      await updateCategories(updatedCategories);
      set({ categories: updatedCategories });
      
      toast({
        title: "Diet removed",
        description: "Diet has been removed from the category.",
      });
    } catch (error) {
      console.error("Error removing diet from category:", error);
      set({ error: "Failed to remove diet from category" });
      
      toast({
        title: "Error",
        description: "Failed to remove diet from category. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));