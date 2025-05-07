import { PreferenceForm } from "@/components/preferences/preference-form";

export default function PreferencesPage() {
  return (
    <div className="container py-8 md:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Your Health Preferences</h1>
          <p className="text-muted-foreground">
            Tell us about your dietary preferences, health goals, and lifestyle
            to get personalized AI-powered recommendations tailored to your
            unique needs.
          </p>
        </div>

        <PreferenceForm />
      </div>
    </div>
  );
}