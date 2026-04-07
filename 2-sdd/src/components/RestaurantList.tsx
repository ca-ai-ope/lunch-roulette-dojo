"use client";

import { useEffect, useState } from "react";
import { Restaurant } from "@/lib/types";
import { loadRestaurants } from "@/lib/storage";
import RestaurantCard from "@/components/RestaurantCard";

interface RestaurantListProps {
  selectedId?: string;
}

export default function RestaurantList({ selectedId }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    setRestaurants(loadRestaurants());
  }, []);

  if (restaurants.length === 0) {
    return <p className="text-center text-gray-400">お店が登録されていません</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isSelected={restaurant.id === selectedId}
        />
      ))}
    </div>
  );
}
