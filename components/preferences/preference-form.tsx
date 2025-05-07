"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { updateUserPreferences } from "@/lib/services/userService";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  age: z.string().min(1, { message: "Age is required" }),
  activityLevel: z.string().min(1, { message: "Activity level is required" }),
  dietaryRestrictions: z.array(z.string()).optional(),
  healthGoals: z.array(z.string()).optional(),
});

const dietaryRestrictionOptions = [
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "nut-free", label: "Nut Free" },
  { id: "low-sodium", label: "Low Sodium" },
];

const healthGoalOptions = [
  { id: "weight-loss", label: "Weight Loss" },
  { id: "muscle-gain", label: "Muscle Gain" },
  { id: "maintenance", label: "Maintenance" },
  { id: "increase-energy", label: "Increase Energy" },
  { id: "improve-digestion", label: "Improve Digestion" },
];

interface PreferenceFormProps {
  initialPreferences: {
    age: number;
    activityLevel: string;
    dietaryRestrictions: string[];
    healthGoals: string[];
  };
}

export function PreferenceForm({ initialPreferences }: PreferenceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: initialPreferences.age.toString(),
      activityLevel: initialPreferences.activityLevel,
      dietaryRestrictions: initialPreferences.dietaryRestrictions || [],
      healthGoals: initialPreferences.healthGoals || [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const preferences = {
        age: parseInt(values.age),
        activityLevel: values.activityLevel,
        dietaryRestrictions: values.dietaryRestrictions || [],
        healthGoals: values.healthGoals || [],
      };

      await updateUserPreferences(preferences);
      
      toast({
        title: "Preferences updated",
        description: "Your preferences have been updated successfully.",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low (Mostly Sedentary)</SelectItem>
                        <SelectItem value="moderate">
                          Moderate (Light Exercise)
                        </SelectItem>
                        <SelectItem value="high">
                          High (Regular Exercise)
                        </SelectItem>
                        <SelectItem value="very-high">
                          Very High (Intense Training)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Dietary Restrictions</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {dietaryRestrictionOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="dietaryRestrictions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthGoals"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Health Goals</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {healthGoalOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="healthGoals"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}