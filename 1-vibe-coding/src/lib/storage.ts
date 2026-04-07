import { Restaurant } from "@/lib/types";
import { defaultRestaurants } from "@/data/restaurants";

const STORAGE_KEY = "lunch-roulette-restaurants";

export function loadRestaurants(): Restaurant[] {
  if (typeof window === "undefined") return defaultRestaurants;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRestaurants));
    return defaultRestaurants;
  }

  try {
    return JSON.parse(stored) as Restaurant[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRestaurants));
    return defaultRestaurants;
  }
}

export function saveRestaurants(restaurants: Restaurant[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
}
