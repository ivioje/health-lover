"use client";

import React, { useEffect, useState } from 'react';
import { DietCard } from '../diets/diet-card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { searchKetoDiets, mapKetoDietToAppDiet } from '@/lib/api';
import { Diet } from '@/lib/types';

const DietsPreview = () => {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiets = async () => {
      setLoading(true);
      try {
        const apiDiets = await searchKetoDiets();
        const mapped = apiDiets.map(mapKetoDietToAppDiet);
        setDiets(mapped.slice(0, 8));
      } catch (e) {
        setDiets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDiets();
  }, []);

  return (
    <div className='container py-8 px-4 sm:px-10 md:py-12 md:px-16'>
        <div className='flex items-center justify-center flex-col w-full py-5'>
            <h2 className='text-3xl font-bold mb-4'>Explore Healthy Diets</h2>
            <p className='text-muted-foreground max-w-3xl mb-8'>
                Discover a variety of healthy eating plans tailored to different lifestyles and health goals. Browse our collection of AI-recommended diets and find the perfect match for your needs.
            </p>
      </div>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
      {loading ? (
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
        ))
      ) : (
        diets.map(diet => (
          <DietCard key={diet.id} diet={diet} />
        ))
      )}
    </div>
    <div className='flex items-center justify-center mt-10'>
    <Button size="lg" className="bg-gradient-to-r from-chart-5 to-chart-4 hover:from-chart-5/90 hover:to-chart-4/90 text-white" asChild>
    <Link href="/diets">See All Diets</Link>
    </Button>
    </div>
    </div>
  )
}

export default DietsPreview;