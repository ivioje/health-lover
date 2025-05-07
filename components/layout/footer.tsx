import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 md:py-12 px-4 sm:px-10 md:px-16">
      <div className="container grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-chart-5" />
            <span className="font-bold bg-gradient-to-r from-chart-5 to-chart-4 bg-clip-text text-transparent">
              HealthLover
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered diet recommendations and health predictions to help you
            live a healthier life.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/diets"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Diet Gallery
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/preferences"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Preferences
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Health Articles
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Nutrition Guides
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Recipe Collections
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Expert Advice
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-sm mb-3">Subscribe to get weekly newsletters and updates!</p>
          <form className="mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-border rounded-md px-3 py-2 w-full placeholder:text-sm"
            />
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-chart-5 to-chart-4 text-white rounded-md px-4 py-2 w-full"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container mt-8 pt-8 border-t border-border/40">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HealthLover. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}