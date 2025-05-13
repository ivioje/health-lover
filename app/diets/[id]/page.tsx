import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DietDetailClient from "@/components/diets/diet-detail-client";
interface DietPageParams {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function generateStaticParams() {
  return [];
}

export default async function DietDetailPage({
  params,
}: DietPageParams) {
  const id = params.id;
  
  return (
    <div className="container py-8 md:py-12">
      <Suspense fallback={
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-video rounded-lg" />
          </div>
          <div className="md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      }>
        <DietDetailClient dietId={id} />
      </Suspense>
    </div>
  );
}