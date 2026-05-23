import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quests")({
  component: () => <Stub title="Квесты" desc="Эпические задания и сезонные челленджи скоро здесь." />,
});

function Stub({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="min-h-[60dvh] grid place-items-center text-center">
      <div>
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="text-text-secondary mt-2 max-w-md">{desc}</p>
      </div>
    </div>
  );
}
