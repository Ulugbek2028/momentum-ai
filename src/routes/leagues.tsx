import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/leagues")({
  component: () => (
    <div className="min-h-[60dvh] grid place-items-center text-center">
      <div>
        <h1 className="font-display text-4xl">Лиги</h1>
        <p className="text-text-secondary mt-2 max-w-md">Сапфировая лига · Сезон 4. Полная таблица скоро.</p>
      </div>
    </div>
  ),
});
