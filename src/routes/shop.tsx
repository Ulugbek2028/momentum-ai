import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shop")({
  component: () => (
    <div className="min-h-[60dvh] grid place-items-center text-center">
      <div>
        <h1 className="font-display text-4xl">Магазин</h1>
        <p className="text-text-secondary mt-2 max-w-md">Бустеры, защита страйка и кастомизация — скоро.</p>
      </div>
    </div>
  ),
});
