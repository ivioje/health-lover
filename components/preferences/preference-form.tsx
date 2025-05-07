"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  Utensils, 
  User,
  Heart
} from "lucide-react";

const dietaryRestrictions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "nut-free", label: "Nut Free" },
  { id: "low-sugar", label: "Low Sugar" },
  { id: "low-sodium", label: "Low Sodium" },
  { id: "pescatarian", label: "Pescatarian" },
];

const healthGoals = [
  { id: "weight-loss", label: "Weight Loss" },
  { id: "weight-gain", label: "Weight Gain" },
  { id: "maintain-weight", label: "Maintain Weight" },
  { id: "increase-energy", label: "Increase Energy" },
  { id: "improve-digestion", label: "Improve Digestion" },
  { id: "heart-health", label: "Heart Health" },
  { id: "blood-sugar", label: "Balance Blood Sugar" },
  { id: "muscle-gain", label: "Muscle Gain" },
];

export function PreferenceForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    selectedRestrictions: [] as string[],
    selectedGoals: [] as string[],
    additionalNotes: "",
  });

  const handleRestrictionChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedRestrictions: checked
        ? [...prev.selectedRestrictions, id]
        : prev.selectedRestrictions.filter((item) => item !== id),
    }));
  };

  const handleGoalChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedGoals: checked
        ? [...prev.selectedGoals, id]
        : prev.selectedGoals.filter((item) => item !== id),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to the backend
    console.log("Form submitted:", formData);
    router.push("/dashboard");
  };

  const nextTab = () => {
    if (activeTab === "personal") setActiveTab("dietary");
    else if (activeTab === "dietary") setActiveTab("goals");
    else if (activeTab === "goals") setActiveTab("additional");
  };

  const prevTab = () => {
    if (activeTab === "dietary") setActiveTab("personal");
    else if (activeTab === "goals") setActiveTab("dietary");
    else if (activeTab === "additional") setActiveTab("goals");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <CardTitle>Your Health Preferences</CardTitle>
          <CardDescription>
            Tell us about yourself so we can provide personalized diet
            recommendations and health insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="personal" className="flex gap-2 data-[state=active]:bg-chart-5/10 data-[state=active]:text-chart-5">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="dietary" className="flex gap-2 data-[state=active]:bg-chart-5/10 data-[state=active]:text-chart-5">
                <Utensils className="h-4 w-4" />
                <span className="hidden sm:inline">Dietary</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex gap-2 data-[state=active]:bg-chart-5/10 data-[state=active]:text-chart-5">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="flex gap-2 data-[state=active]:bg-chart-5/10 data-[state=active]:text-chart-5">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Review</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="30"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) =>
                      handleSelectChange("activityLevel", value)
                    }
                    required
                  >
                    <SelectTrigger id="activityLevel" className="w-full">
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        Low (Mostly Sedentary)
                      </SelectItem>
                      <SelectItem value="moderate">
                        Moderate (Exercise 1-3 times/week)
                      </SelectItem>
                      <SelectItem value="high">
                        High (Exercise 4+ times/week)
                      </SelectItem>
                      <SelectItem value="very-high">
                        Very High (Daily intense exercise)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dietary" className="space-y-6 mt-0">
              <div>
                <h3 className="text-lg font-medium mb-4">Dietary Restrictions</h3>
                <p className="text-muted-foreground mb-4">
                  Select any dietary restrictions or preferences that apply to you.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryRestrictions.map((restriction) => (
                    <div key={restriction.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={restriction.id}
                        checked={formData.selectedRestrictions.includes(restriction.id)}
                        onCheckedChange={(checked) =>
                          handleRestrictionChange(
                            restriction.id,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={restriction.id}
                        className="text-sm font-normal"
                      >
                        {restriction.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6 mt-0">
              <div>
                <h3 className="text-lg font-medium mb-4">Health Goals</h3>
                <p className="text-muted-foreground mb-4">
                  Select the health goals you're looking to achieve. This helps us recommend the most appropriate diets.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {healthGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal.id}
                        checked={formData.selectedGoals.includes(goal.id)}
                        onCheckedChange={(checked) =>
                          handleGoalChange(goal.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={goal.id}
                        className="text-sm font-normal"
                      >
                        {goal.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="additional" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <p className="text-muted-foreground">
                  Please share any additional information that might help us provide better recommendations.
                </p>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Any allergies, medical conditions, or preferences we should know about..."
                />
              </div>

              <div className="mt-8 p-4 rounded-lg bg-chart-5/10 border border-chart-5/20">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-chart-5" />
                  <h3 className="font-medium">Ready for Your Personalized Health Journey</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our AI will analyze your information to create personalized diet recommendations
                  and health insights tailored specifically to your needs.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevTab}
            disabled={activeTab === "personal"}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {activeTab !== "additional" ? (
            <Button type="button" onClick={nextTab}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" className="bg-chart-5 hover:bg-chart-5/90">
              Submit
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}