import { createFileRoute } from "@tanstack/react-router";
import { Swords, Trophy, Flame, Lock, CheckCircle, Clock } from "lucide-react";
import { Card, Tag, XPBar } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/quests")({
  component: QuestsPage,
});

const TYPE_LABELS = {
  daily: { label: "Ежедневное", variant: "common" as const, icon: "☀️" },
  weekly: { label: "Еженедельное", variant: "rare" as const, icon: "📅" },
  epic: { label: "Эпическое", variant: "epic" as const, icon: "⚔️" },
  seasonal: { label: "Сезонное", variant: "legendary" as const, icon: "🏆" },
};

type QuestFilter = "all" | "daily" | "weekly" | "epic" | "seasonal";

function QuestsPage() {
  const { quests, completeQuest, addXP, addGems, user } = useApp();
  const [filter, setFilter] = useState<QuestFilter>("all");
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);

  const filters: { key: QuestFilter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "daily", label: "Ежедневные" },
    { key: "weekly", label: "Еженедельные" },
    { key: "epic", label: "Эпические" },
    { key: "seasonal", label: "Сезонные" },
  ];

  const visible = filter === "all" ? quests : quests.filter((q) => q.type === filter);
  const totalDone = quests.filter((q) => q.done).length;

  const handleClaim = (qid: string) => {
    if (claimedIds.has(qid)) return;
    const q = quests.find((x) => x.id === qid);
    if (!q || !q.done) return;
    setClaimedIds((s) => new Set([...s, qid]));
    addXP(q.xpReward);
    if (q.gemReward) addGems(q.gemReward);
    setNotification(`+${q.xpReward} XP${q.gemReward ? ` · +${q.gemReward} 💎` : ""} получено!`);
    setTimeout(() => setNotification(null), 2000);
  };

  const handleProgress = (qid: string) => {
    completeQuest(qid);
  };

  return (
    <div className="animate-fade-in">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green text-black font-bold px-5 py-2 rounded-full text-sm shadow-lg animate-bounce pointer-events-none">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl flex items-center gap-3">
            <Swords className="size-8 text-red" /> Квесты
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {totalDone} / {quests.length} выполнено · Сезон 4
          </p>
        </div>
        <div className="bg-bg-surface border border-border-default rounded-lg p-3 flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="font-mono text-gold font-bold">{user.gems} 💎</div>
            <div className="text-[11px] text-text-secondary">Гемов</div>
          </div>
          <div className="w-px h-8 bg-border-default" />
          <div className="text-center">
            <div className="font-mono text-green font-bold">{totalDone}</div>
            <div className="text-[11px] text-text-secondary">Выполнено</div>
          </div>
        </div>
      </div>

      {/* Season progress */}
      <Card className="!p-5 mb-6 border-gold/20 bg-gradient-to-r from-gold-dim to-transparent">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-gold" />
            <span className="font-display text-lg">Сезон 4: Рост</span>
          </div>
          <span className="text-xs text-text-secondary">Осталось 18 дней</span>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1"><XPBar value={7240} max={10000} /></div>
          <span className="text-xs font-mono text-gold">7,240 / 10,000 XP</span>
        </div>
        <div className="text-[11px] text-text-secondary">Награда: 1000 XP + 100 💎 + Эксклюзивный значок</div>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
              filter === f.key
                ? "bg-red text-white border-red shadow-red-glow"
                : "border-border-default text-text-secondary hover:text-text-primary hover:border-border-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Quest list */}
      <div className="space-y-4">
        {visible.map((q, idx) => {
          const typeInfo = TYPE_LABELS[q.type];
          const pct = Math.round((q.progress / q.total) * 100);
          const claimed = claimedIds.has(q.id);
          const canClaim = q.done && !claimed;

          return (
            <div
              key={q.id}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="animate-fade-in opacity-0"
            >
              <Card className={`!p-5 ${q.locked ? "opacity-60" : ""} ${q.done && !claimed ? "border-green/30" : ""}`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`size-14 rounded-xl flex-shrink-0 grid place-items-center text-2xl border ${
                    q.done ? "bg-green/10 border-green/20" : q.locked ? "bg-bg-surface3 border-border-subtle" : "bg-bg-surface2 border-border-default"
                  }`}>
                    {q.locked ? <Lock className="size-6 text-text-tertiary" /> : q.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Tag variant={typeInfo.variant}>{typeInfo.label}</Tag>
                      {q.deadline && (
                        <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                          <Clock className="size-3" /> {q.deadline}
                        </span>
                      )}
                      {q.done && !claimed && (
                        <span className="flex items-center gap-1 text-[11px] text-green font-semibold">
                          <CheckCircle className="size-3" /> Готово!
                        </span>
                      )}
                    </div>
                    <div className="font-display text-lg leading-tight">{q.title}</div>
                    <div className="text-xs text-text-secondary mt-0.5 mb-3">{q.desc}</div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1"><XPBar value={q.progress} max={q.total} /></div>
                      <span className="text-xs font-mono text-text-secondary shrink-0">
                        {q.type === "seasonal" ? `${q.progress.toLocaleString()} / ${q.total.toLocaleString()}` : `${q.progress} / ${q.total}`}
                      </span>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-text-secondary">Награда:</span>
                      <span className="text-xs font-semibold text-gold">+{q.xpReward} XP</span>
                      {q.gemReward && <span className="text-xs font-semibold text-blue">+{q.gemReward} 💎</span>}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {q.locked ? (
                      <button disabled className="text-xs font-semibold px-4 py-2 rounded-md bg-bg-surface3 text-text-tertiary cursor-not-allowed">
                        Pro
                      </button>
                    ) : claimed ? (
                      <div className="flex items-center gap-1.5 text-xs text-green font-semibold px-3 py-2">
                        <CheckCircle className="size-4" /> Получено
                      </div>
                    ) : canClaim ? (
                      <button
                        onClick={() => handleClaim(q.id)}
                        className="text-xs font-semibold px-4 py-2 rounded-md bg-green text-black hover:brightness-110 transition shadow-[0_0_16px_rgba(0,200,150,0.3)]"
                      >
                        Получить
                      </button>
                    ) : (
                      <button
                        onClick={() => handleProgress(q.id)}
                        className="text-xs font-semibold px-4 py-2 rounded-md bg-red hover:bg-red-hover text-white transition shadow-red-glow"
                      >
                        +1 шаг
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Flame streak bonus */}
      <Card className="!p-5 mt-6 flex items-center gap-4">
        <div className="text-3xl animate-[flicker_2.5s_ease-in-out_infinite]">🔥</div>
        <div className="flex-1">
          <div className="font-display text-lg">Бонус серии</div>
          <div className="text-xs text-text-secondary mt-0.5">
            При серии 7+ дней все ежедневные квесты дают +20% XP
          </div>
        </div>
        <Tag variant={user.streak >= 7 ? "success" : "common"}>
          {user.streak >= 7 ? "Активен ✓" : `${user.streak}/7 дней`}
        </Tag>
      </Card>
    </div>
  );
}
