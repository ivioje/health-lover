import { Brain, Heart, ChefHat, PieChart } from "lucide-react";

const features = [
  {
    title: "AI Health Predictions",
    description:
      "Our advanced AI models analyze your diet and lifestyle to predict potential health risks with remarkable accuracy.",
    icon: Brain,
  },
  {
    title: "Personalized Diet Plans",
    description:
      "Receive custom dietary recommendations tailored to your unique body, preferences, and health goals.",
    icon: Heart,
  },
  {
    title: "Nutritional Analysis",
    description:
      "Get detailed breakdowns of macro and micronutrients to ensure a balanced and optimal diet.",
    icon: PieChart,
  },
  {
    title: "Curated Recipes",
    description:
      "Discover delicious recipes that match your dietary preferences and nutritional requirements.",
    icon: ChefHat,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Advanced AI-Powered Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            HealthLover combines cutting-edge machine learning with nutritional
            science to provide you with personalized health insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:py-12 md:px-16 sm:px-10 px-3 py-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 transition-all hover:shadow-md hover:bg-card/80"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-chart-5/20 to-chart-4/20 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-chart-5" />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}