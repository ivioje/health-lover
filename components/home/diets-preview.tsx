"use client";

import React, { useEffect, useState } from 'react';
import { DietCard } from '../diets/diet-card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Diet } from '@/lib/types';
import { getPopularDiets } from '@/lib/recommendation-api';

const DietsPreview = () => {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDiets = async () => {
      setLoading(true);
      try {
        const popularDiets = await getPopularDiets(8);
        setDiets(popularDiets);
      } catch (e) {
        console.error('Error fetching popular diets:', e);
        setDiets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDiets();
  }, []);

  return (
    <div className='container py-8 px-4 sm:px-10 md:py-12 md:px-16'>        <div className='flex items-center justify-center flex-col w-full py-5'>
            <h2 className='text-3xl font-bold mb-4'>Popular Diets</h2>
            <p className='text-muted-foreground max-w-3xl mb-8'>
                Check out these trending recipes that our community loves. Discover crowd favorites and AI-recommended diets that are currently popular among our users.
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