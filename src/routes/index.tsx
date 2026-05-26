import { createFileRoute } from "@tanstack/react-router";
import { Flame, Heart, Trophy, ArrowRight, CheckCircle2, Target, Sparkles } from "lucide-react";
import { Card, LevelRing, Tag, XPBar } from "@/components/ui-primitives";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const days = [true, true, true, true, true, true, "today"] as const;
  return (
    <div className="animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl">Доброе утро, Алишер 👋</h1>
        <p className="text-text-secondary mt-1 text-sm">47-дневная серия · Уровень 7 · Стратег</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr] gap-5">
        {/* LEFT: Streak hero */}
        <Card className="!p-7 text-center">
          <div className="text-5xl mb-2 animate-[flicker_2.5s_ease-in-out_infinite] inline-block">🔥</div>
          <div className="font-display text-[72px] leading-none text-gold text-glow-red">47</div>
          <div className="text-text-secondary text-sm mt-1">дней подряд</div>

          <div className="mt-6 grid grid-cols-7 gap-1.5">
            {days.map((d, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg border ${
                  d === "today"
                    ? "bg-red-dim border-red shadow-red-glow"
                    : d
                    ? "bg-gold-dim border-gold/30"
                    : "bg-white/[0.02] border-border-subtle"
                }`}
              />
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-border-default text-xs text-text-secondary">
            Личный рекорд: <span className="text-text-primary font-semibold">63</span> · До 50: <span className="text-gold font-semibold">3 дня</span> 🏆
          </div>
        </Card>

        {/* CENTER: XP + Hearts + Challenges */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Card>
              <div className="flex items-center gap-4">
                <LevelRing level={7} pct={86} />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-text-secondary">Опыт</div>
                  <div className="font-mono text-lg">4,280 <span className="text-text-tertiary">/ 5,000</span></div>
                  <div className="text-[11px] text-text-secondary">до ур. 8</div>
                </div>
              </div>
              <div className="mt-4"><XPBar value={4280} max={5000} /></div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-wider text-text-secondary">Сердечки</div>
                <Tag variant="danger">3/5</Tag>
              </div>
              <div className="flex gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Heart
                    key={i}
                    className={`size-6 ${i <= 3 ? "fill-red text-red" : "text-white/15"}`}
                  />
                ))}
              </div>
              <div className="text-[11px] text-text-secondary mb-3">Следующее через 1ч 40мин</div>
              <button className="w-full text-xs font-semibold py-2 rounded-md bg-gold-dim border border-gold/30 text-gold hover:bg-gold/20 transition">
                Восполнить 💎 15
              </button>
            </Card>
          </div>

          {/* Challenges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xl">Сегодня</h2>
              <span className="text-xs text-text-secondary">2 / 3 выполнено</span>
            </div>
            <div className="space-y-3">
              <ChallengeRow icon={CheckCircle2} title="Чат с ментором" desc="20 минут разговора" pct={100} done reward="+50 XP" />
              <ChallengeRow icon={Target} title="Закрыть 1 задачу" desc="Из плана действий" pct={100} done reward="+30 XP" />
              <ChallengeRow icon={Sparkles} title="Изучить инсайт" desc="Прочитать 3 заметки" pct={66} reward="+40 XP" />
            </div>
          </div>

          {/* Quick mentor access */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-gradient-to-br from-blue to-purple grid place-items-center font-display text-xl">RD</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs uppercase tracking-wider text-red">Продолжить с ментором</div>
                <div className="font-display text-lg leading-tight">Рэй Далио</div>
                <div className="text-xs text-text-secondary">47 сообщений в сессии</div>
              </div>
              <button className="hidden sm:inline-flex items-center gap-1.5 bg-red hover:bg-red-hover text-white font-semibold text-sm px-4 py-2 rounded-md transition shadow-red-glow">
                Открыть <ArrowRight className="size-4" />
              </button>
            </div>
          </Card>
        </div>

        {/* RIGHT: League */}
        <Card className="!p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-blue" />
              <span className="font-display text-lg">Сапфир</span>
            </div>
            <Tag variant="rare">5 место</Tag>
          </div>

          <div className="space-y-1.5 mb-4">
            {[
              { rank: 1, name: "Дилшод М.", xp: 4820 },
              { rank: 2, name: "Камила Н.", xp: 4310 },
              { rank: 3, name: "Бахтиёр У.", xp: 3990 },
              { rank: 4, name: "Зарина Х.", xp: 2740 },
              { rank: 5, name: "Алишер К.", xp: 2480, me: true },
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
          <button className="bg-red hover:bg-red-hover text-white font-semibold text-sm px-5 py-2.5 rounded-md transition shadow-red-glow">
            Продолжить
          </button>
        </Card>
      </div>
    </div>
  );
}

function ChallengeRow({
  icon: Icon, title, desc, pct, done, reward,
}: {
  icon: typeof Flame; title: string; desc: string; pct: number; done?: boolean; reward: string;
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
      </div>
    </Card>
  );
}
