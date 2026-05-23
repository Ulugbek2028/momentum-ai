import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: () => (
    <div className="min-h-[60dvh] grid place-items-center text-center">
      <div>
        <h1 className="font-display text-4xl">Настройки</h1>
        <p className="text-text-secondary mt-2 max-w-md">Язык, уведомления, подписка и безопасность.</p>
      </div>
    </div>
  ),
});
