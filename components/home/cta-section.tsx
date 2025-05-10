import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <motion.section
      className="py-16 md:py-24 sm:px-10 md:px-16 sm:shadow-sm"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container px-4">
        <motion.div
          className="relative overflow-hidden sm:rounded-2xl p-8 md:p-12 lg:p-16 bg-card sm:border sm:border-border/50"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Abstract background decorations */}
          <motion.div
            className="absolute top-0 left-0 w-36 h-36 rounded-full bg-chart-4/10 blur-3xl z-50 bg-red-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            >
              <Image
                src="/assets/image.png"
                alt="Health lover"
                width={350}
                height={350}
                className="rounded-lg"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}