import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 sm:px-10 md:px-16 sm:shadow-sm">
      <div className="container px-4">
        <div className="relative overflow-hidden sm:rounded-2xl p-8 md:p-12 lg:p-16 bg-card sm:border sm:border-border/50">
          {/* Abstract background decorations */}
          {/* <div className="absolute right-20 bottom-0 w-36 h-36 rounded-full bg-chart-5/10 blur-3xl z-50 bg-yellow-100" /> */}
          <div className="absolute top-0 left-0 w-36 h-36 rounded-full bg-chart-4/10 blur-3xl z-50 bg-red-200" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Health Journey?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start your personalized nutrition plan today with HealthLover's
                AI-powered recommendations. Your optimal health is just a few
                clicks away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-5 to-chart-4 hover:from-chart-5/90 hover:to-chart-4/90 text-white"
                  asChild
                >
                  <Link href="/preferences">Get Started Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/diets">Explore Diet Options</Link>
                </Button>
              </div>
            </div>
            <div className="">
              <Image
                src="/assets/image.png"
                alt="Health lover"
                width={350}
                height={350}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}