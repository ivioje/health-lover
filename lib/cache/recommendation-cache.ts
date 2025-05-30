
import { Diet, PersonalizedRequest, RecommendationResponse } from '../types';

// Cache TTL in milliseconds (30 minutes)
const CACHE_TTL = 30 * 60 * 1000;

// Cache structure
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Cache storage
const cache: {
  [key: string]: CacheItem<any>
} = {};

/**
 * Generate a cache key from request parameters
 */
function generateCacheKey(type: string, params: any): string {
  return `${type}:${JSON.stringify(params)}`;
}

/**
 * Check if cache item is still valid
 */
function isCacheValid(item: CacheItem<any>): boolean {
  const now = Date.now();
  return (now - item.timestamp) < CACHE_TTL;
}

/**
 * Get item from cache
 */
export function getFromCache<T>(type: string, params: any): T | null {
  const key = generateCacheKey(type, params);
  const item = cache[key];
  
  if (item && isCacheValid(item)) {
    console.log(`Cache hit for ${type}`);
    return item.data;
  }
  
  console.log(`Cache miss for ${type}`);
  return null;
}

/**
 * Save item to cache
 */
export function saveToCache<T>(type: string, params: any, data: T): void {
  const key = generateCacheKey(type, params);
  cache[key] = {
    data,
    timestamp: Date.now()
  };
  console.log(`Saved to cache: ${type}`);
}

/**
 * Clear specific cache entry
 */
export function clearCache(type: string, params: any): void {
  const key = generateCacheKey(type, params);
  delete cache[key];
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  Object.keys(cache).forEach(key => delete cache[key]);
}

// Specific cache functions for recommendations

/**
 * Get personalized recommendations with caching
 */
export function getCachedPersonalizedRecommendations(request: PersonalizedRequest): RecommendationResponse | null {
  return getFromCache<RecommendationResponse>('personalized', request);
}

/**
 * Save personalized recommendations to cache
 */
export function cachePersonalizedRecommendations(request: PersonalizedRequest, response: RecommendationResponse): void {
  saveToCache('personalized', request, response);
}

/**
 * Get similar diets with caching
 */
export function getCachedSimilarDiets(dietId: string, count: number): Diet[] | null {
  return getFromCache<Diet[]>('similar', { dietId, count });
}

/**
 * Save similar diets to cache
 */
export function cacheSimilarDiets(dietId: string, count: number, diets: Diet[]): void {
  saveToCache('similar', { dietId, count }, diets);
}

/**
 * Get popular diets with caching
 */
export function getCachedPopularDiets(count: number): Diet[] | null {
  return getFromCache<Diet[]>('popular', { count });
}

/**
 * Save popular diets to cache
 */
export function cachePopularDiets(count: number, diets: Diet[]): void {
  saveToCache('popular', { count }, diets);
}
