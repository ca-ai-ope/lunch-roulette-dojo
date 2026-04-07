import RestaurantList from "@/components/RestaurantList";
import Roulette from "@/components/Roulette";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          🍽️ ランチルーレット
        </h1>
        <p className="text-gray-500">
          お店を登録して、ルーレットで今日のランチを決めよう！
        </p>
      </header>
      <Roulette />
      <RestaurantList />
    </main>
  );
}
