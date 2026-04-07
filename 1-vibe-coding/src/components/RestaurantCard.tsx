"use client";

import { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSelected?: boolean;
}

export default function RestaurantCard({ restaurant, isSelected }: RestaurantCardProps) {
  return (
    <div
      className={`rounded-xl border p-6 shadow-sm transition hover:shadow-md ${
        isSelected
          ? "border-green-400 bg-green-50 ring-2 ring-green-400"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        {restaurant.genre}
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{restaurant.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{restaurant.votes} 票</span>
      </div>
    </div>
  );
}
