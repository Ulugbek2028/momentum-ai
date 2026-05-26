import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Heart, Trophy, ArrowRight, CheckCircle2, Target, Sparkles, Zap, Plus } from "lucide-react";
import { Card, LevelRing, Tag, XPBar } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/")(({
  component: Dashboard,
}));

function Dashboard() {
  const { user, quests, refillHearts, addXP } = useApp();
  const [xpPopup, setXpPopup] = useState<string | null>(null);

  const dailyQuests = quests.filter((q) => q.type === "daily");
  const doneCount = dailyQuests.filter((q) => q.done).length;

  const days = Array.from({ length: 7 }, (_, i) => {
    if (i < 6) return "done";
    return "today";
  }) as ("done" | "today" | "empty")[];

  const handleAddXP = (amount: number, label: string) => {
    addXP(amount);
    setXpPopup(label);
    setTimeout(() => setXpPopup(null), 1600);
  };

  return (
    <div className="animate-fade-in relative">
      {xpPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gold text-black font-bold px-4 py-2 rounded-full text-sm shadow-gold-glow animate-bounce pointer-events-none">
          +{xpPopup} XP ⚡
        </div>
      )}

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl">Доброе утро, {user.name.split(" ")[0]} 👋</h1>
        <p className="text-text-secondary mt-1 text-sm">{user.streak}-дневная серия · Уровень {user.level} · Стратег</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr] gap-5">
        {/* LEFT: Streak hero */}
        <Card className="!p-7 text-center">
          <div className="text-5xl mb-2 animate-[flicker_2.5s_ease-in-out_infinite] inline-block select-none">🔥</div>
          <div className="font-display text-[72px] leading-none text-gold text-glow-red">{user.streak}</div>
          <div className="text-text-secondary text-sm mt-1">дней подряд</div>

          <div className="mt-6 grid grid-cols-7 gap-1.5">
            {days.map((d, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg border ${
                  d === "today"
                    ? "bg-red-dim border-red shadow-red-glow"
                    : d === "done"
                    ? "bg-gold-dim border-gold/30"
                    : "bg-white/[0.02] border-border-subtle"
                }`}
              />
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-border-default text-xs text-text-secondary">
            Личный рекорд: <span className="text-text-primary font-semibold">{user.streakRecord}</span> · До 50: <span className="text-gold font-semibold">{50 - user.streak} {50 - user.streak > 0 ? "дней" : "🏆"}</span>
          </div>
        </Card>

        {/* CENTER: XP + Hearts + Challenges */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Card>
              <div className="flex items-center gap-4">
                <LevelRing level={user.level} pct={Math.round((user.xp / user.xpMax) * 100)} />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-text-secondary">Опыт</div>
                  <div className="font-mono text-lg">{user.xp.toLocaleString()} <span className="text-text-tertiary">/ {user.xpMax.toLocaleString()}</span></div>
                  <div className="text-[11px] text-text-secondary">до ур. {user.level + 1}</div>
                </div>
              </div>
              <div className="mt-4"><XPBar value={user.xp} max={user.xpMax} /></div>
              <button
                onClick={() => handleAddXP(100, "100")}
                className="mt-3 w-full text-xs font-semibold py-1.5 rounded-md bg-bg-surface2 border border-border-default text-text-secondary hover:text-gold hover:border-gold/30 transition flex items-center justify-center gap-1"
              >
                <Zap className="size-3" /> Бонус +100 XP (тест)
              </button>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wider text-text-secondary">Сердечки</div>
                <Tag variant="danger">{user.hearts}/{user.heartsMax}</Tag>
              </div>
              <div className="flex gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Heart
                    key={i}
                    className={`size-6 ${i <= user.hearts ? "fill-red text-red" : "text-white/15"}`}
                  />
                ))}
              </div>
              <div className="text-[11px] text-text-secondary mb-3">Следующее через 1ч 40мин</div>
              <button
                onClick={refillHearts}
                disabled={user.hearts >= user.heartsMax || user.gems < 15}
                className="w-full text-xs font-semibold py-2 rounded-md bg-gold-dim border border-gold/30 text-gold hover:bg-gold/20 disabled:opacity-40 transition"
              >
                Восполнить 💎 15
              </button>
              <div className="mt-2 text-center text-[11px] text-text-secondary">💎 {user.gems} гемов</div>
            </Card>
          </div>

          {/* Challenges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl">Сегодня</h2>
              <span className="text-xs text-text-secondary">{doneCount} / {dailyQuests.length} выполнено</span>
            </div>
            <div className="space-y-3">
              {dailyQuests.map((q) => (
                <ChallengeRow
                  key={q.id}
                  icon={q.id === "q1" ? CheckCircle2 : q.id === "q2" ? Target : Sparkles}
                  title={q.title}
                  desc={q.desc}
                  pct={Math.round((q.progress / q.total) * 100)}
                  done={q.done}
                  reward={`+${q.xpReward} XP`}
                  onContinue={() => handleAddXP(q.xpReward, String(q.xpReward))}
                />
              ))}
            </div>
          </div>

          {/* Quick mentor access */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-gradient-to-br from-blue to-purple grid place-items-center font-display text-xl">РД</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider text-red">Продолжить с ментором</div>
                <div className="font-display text-lg leading-tight">Рэй Далио</div>
                <div className="text-xs text-text-secondary">{user.totalSessions} сессий всего</div>
              </div>
              <Link
                to="/chat"
                className="hidden sm:inline-flex items-center gap-1.5 bg-red hover:bg-red-hover text-white font-semibold text-sm px-4 py-2 rounded-md transition shadow-red-glow"
              >
                Открыть <ArrowRight className="size-4" />
              </Link>
            </div>
          </Card>
        </div>

        {/* RIGHT: League */}
        <Card className="!p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-blue" />
              <span className="font-display text-lg">{user.league}</span>
            </div>
            <Tag variant="rare">{user.leagueRank} место</Tag>
          </div>

          <div className="space-y-1.5 mb-4">
            {[
              { rank: 1, name: "Дилшод М.", xp: 4820 },
              { rank: 2, name: "Камила Н.", xp: 4310 },
              { rank: 3, name: "Бахтиёр У.", xp: 3990 },
              { rank: 4, name: "Зарина Х.", xp: 2740 },
              { rank: 5, name: user.name, xp: 2480, me: true },
            ].map((r) => (
              <div
                key={r.rank}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-xs ${
                  r.me ? "bg-red-dim border border-border-accent" : ""
                }`}
              >
                <span className={`size-5 grid place-items-center rounded-full font-mono ${
                  r.rank === 1 ? "bg-gold text-black" : r.rank === 2 ? "bg-white/30" : r.rank === 3 ? "bg-orange/60" : "bg-bg-surface3"
                }`}>{r.rank}</span>
                <span className="flex-1 truncate">{r.name}</span>
                <span className="font-mono text-text-secondary">{r.xp}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border-default text-xs text-text-secondary">
            Сброс через <span className="text-text-primary font-mono">3д 14ч</span>
          </div>
          <Link to="/leagues" className="mt-2 block text-center text-xs text-red hover:underline">
            Полная таблица →
          </Link>
        </Card>
      </div>

      {/* Active quest */}
      <div className="mt-6">
        <Card className="!p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="size-12 rounded-lg bg-purple/15 border border-purple/30 grid place-items-center">
            <Sparkles className="size-6 text-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Tag variant="epic">Эпический</Tag>
              <span className="text-xs text-text-secondary">Осталось 4 дня</span>
            </div>
            <div className="font-display text-lg mt-1">Построй MVP за неделю</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1"><XPBar value={2} max={5} /></div>
              <span className="text-xs font-mono text-text-secondary">2 / 5</span>
            </div>
          </div>
          <Link
            to="/quests"
            className="bg-red hover:bg-red-hover text-white font-semibold text-sm px-5 py-2.5 rounded-md transition shadow-red-glow"
          >
            Продолжить
          </Link>
        </Card>
      </div>
    </div>
  );
}

function ChallengeRow({
  icon: Icon, title, desc, pct, done, reward, onContinue,
}: {
  icon: typeof Flame; title: string; desc: string; pct: number; done?: boolean; reward: string; onContinue?: () => void;
}) {
  return (
    <Card className={`!p-4 ${done ? "opacity-70" : ""}`} accent={done ? "green" : undefined}>
      <div className="flex items-center gap-4">
        <div className={`size-10 rounded-lg grid place-items-center ${done ? "bg-green/15" : "bg-bg-surface2"}`}>
          <Icon className={`size-5 ${done ? "text-green" : "text-text-secondary"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm">{title}</div>
            <Tag variant={done ? "success" : "legendary"}>{reward}</Tag>
          </div>
          <div className="text-xs text-text-secondary mb-2">{desc}</div>
          <div className="h-1 rounded-full bg-bg-surface3 overflow-hidden">
            <div
              style={{ width: `${pct}%` }}
              className={`h-full ${done ? "bg-green" : "bg-gradient-to-r from-red to-orange"} transition-[width] duration-1000 ease-out`}
            />
          </div>
        </div>
        {!done && onContinue && (
          <button
            onClick={onContinue}
            className="shrink-0 size-8 rounded-md bg-bg-surface2 hover:bg-red-dim border border-border-default hover:border-red/30 grid place-items-center transition"
          >
            <Plus className="size-4 text-text-secondary hover:text-red" />
          </button>
        )}
      </div>
    </Card>
  );
}
