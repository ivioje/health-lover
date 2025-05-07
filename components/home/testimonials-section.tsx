import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "HealthLover's AI recommendations helped me discover the Mediterranean diet, which lowered my cholesterol by 20% in just three months!",
    author: "Emily Johnson",
    role: "Fitness Enthusiast",
    avatar: "EJ",
  },
  {
    quote:
      "As someone with type 2 diabetes, the personalized nutrition insights have been invaluable for managing my blood sugar levels.",
    author: "Michael Chen",
    role: "Health Conscious Professional",
    avatar: "MC",
  },
  {
    quote:
      "The health prediction feature alerted me to my risk of nutrient deficiencies. After adjusting my diet, my energy levels have improved dramatically.",
    author: "Sarah Williams",
    role: "Busy Mom of Three",
    avatar: "SW",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from people who've transformed their health with HealthLover's
            AI-powered diet recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-md transition-all"
            >
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-chart-5/40 mb-4" />
                <p className="text-sm text-foreground/90 italic">
                  "{testimonial.quote}"
                </p>
              </CardContent>
              <CardFooter className="flex items-center pt-4 pb-6 border-t border-border/30">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-gradient-to-br from-chart-5 to-chart-4 text-white">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}