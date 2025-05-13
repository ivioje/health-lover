import { create } from 'zustand';
import { Diet } from '@/lib/types';
import { searchKetoDiets, mapKetoDietToAppDiet } from '@/lib/api';
import { saveDiet, removeSavedDiet, getUserData } from '@/lib/services/userService';
import { toast } from '@/hooks/use-toast';

interface DietState {
  diets: Diet[];
  savedDiets: Diet[];
  savedDietIds: string[];
  isLoading: boolean;
  isSavingDiet: boolean;
  error: string | null;
  
  fetchDiets: (params?: any) => Promise<void>;
  fetchSavedDiets: () => Promise<void>;
  toggleSaveDiet: (dietId: string, isSaved: boolean) => Promise<boolean>;
  getDietById: (id: string) => Diet | undefined;
  searchDiets: (query: string) => Promise<void>;
}

export const useDietStore = create<DietState>((set, get) => ({
  diets: [],
  savedDiets: [],
  savedDietIds: [],
  isLoading: false,
  isSavingDiet: false,
  error: null,
  
  fetchDiets: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const apiDiets = await searchKetoDiets(params);
      
      if (apiDiets && Array.isArray(apiDiets)) {
        const mappedDiets = apiDiets.map((diet) => mapKetoDietToAppDiet(diet));
        set({ diets: mappedDiets });
      }
    } catch (error) {
      console.error("Error fetching diets:", error);
      set({ error: "Failed to load diets" });
      toast({
        title: "Error",
        description: "Failed to load diets. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchSavedDiets: async () => {
    set({ isLoading: true, error: null });
    try {
      const userData = await getUserData();
      const savedIds = userData?.savedDiets || [];
      set({ savedDietIds: savedIds });
      
      if (savedIds.length === 0) {
        set({ savedDiets: [], isLoading: false });
        return;
      }
      
      const apiDiets = await searchKetoDiets();
      
      if (apiDiets && Array.isArray(apiDiets)) {
        const savedIdsSet = new Set(savedIds);
        
        const mappedSavedDiets = apiDiets
          .filter(diet => {
            const dietId = diet.id.toString();
            return savedIdsSet.has(dietId);
          })
          .map(diet => mapKetoDietToAppDiet(diet));
        
        set({ savedDiets: mappedSavedDiets });
      }
    } catch (error) {
      console.error("Error fetching saved diets:", error);
      set({ error: "Failed to load saved diets" });
      toast({
        title: "Error",
        description: "Failed to load saved diets. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  toggleSaveDiet: async (dietId, isSaved) => {
    set({ isSavingDiet: true });
    try {
      if (isSaved) {
        await removeSavedDiet(dietId);
        
        const { savedDietIds, savedDiets } = get();
        set({ 
          savedDietIds: savedDietIds.filter(id => id !== dietId),
          savedDiets: savedDiets.filter(diet => diet.id !== dietId)
        });
        
        toast({
          title: "Diet removed",
          description: "Diet removed from your saved collection",
        });
        
        return false;
      } else {
        await saveDiet(dietId);
        
        const { savedDietIds, diets } = get();
        const dietToAdd = diets.find(diet => diet.id === dietId);
        
        if (dietToAdd) {
          set({ 
            savedDietIds: [...savedDietIds, dietId],
            savedDiets: [...get().savedDiets, dietToAdd]
          });
        }
        
        toast({
          title: "Diet saved",
          description: "Diet saved to your collection",
        });
        
        return true;
      }
    } catch (error) {
      console.error("Error toggling saved diet:", error);
      toast({
        title: "Error",
        description: "Failed to update saved diets. Please try again.",
        variant: "destructive",
      });
      return isSaved;
    } finally {
      set({ isSavingDiet: false });
    }
  },
  
  getDietById: (id) => {
    const { diets } = get();
    return diets.find(diet => diet.id === id);
  },
    searchDiets: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const apiDiets = await searchKetoDiets({ query });
      
      if (apiDiets && Array.isArray(apiDiets)) {
        const filteredDiets = apiDiets.filter(diet => 
          diet.recipe.toLowerCase().includes(query.toLowerCase()) ||
          (diet.ingredient_1 && diet.ingredient_1.toLowerCase().includes(query.toLowerCase())) ||
          (diet.ingredient_2 && diet.ingredient_2.toLowerCase().includes(query.toLowerCase()))
        );
        
        const mappedDiets = filteredDiets.map((diet) => mapKetoDietToAppDiet(diet));
        set({ diets: mappedDiets });
      }
    } catch (error) {
      console.error("Error searching diets:", error);
      set({ error: "Failed to search diets" });
      toast({
        title: "Error",
        description: "Failed to search diets. Please try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));