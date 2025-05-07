import { diets } from "@/lib/data";
import { DietGallery } from "@/components/diets/diet-gallery";

export default function DietsPage() {
  return (
    <div className="container py-8 md:py-12 px-3 sm:px-10 md:px-16">
      <div className="mb-8 flex justify-center">
        <p className="text-muted-foreground max-w-5xl text-center">
          Discover a variety of healthy eating plans tailored to different
          lifestyles and health goals. Browse our collection of AI-recommended
          diets and find the perfect match for your needs.
        </p>
      </div>

      <DietGallery diets={diets} />
    </div>
  );
}