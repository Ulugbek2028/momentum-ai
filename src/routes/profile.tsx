import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: () => (
    <div className="min-h-[60dvh] grid place-items-center text-center">
      <div>
        <h1 className="font-display text-4xl">Профиль</h1>
        <p className="text-text-secondary mt-2 max-w-md">Бейджи, история сессий и статистика.</p>
      </div>
    </div>
  ),
});
