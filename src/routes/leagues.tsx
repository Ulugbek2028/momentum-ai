import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Flame, TrendingUp, Shield } from "lucide-react";
import { Card, Tag, XPBar } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/leagues")({
  component: LeaguesPage,
});

const LEAGUE_TIERS = [
  { name: "Бронза", icon: "🥉", color: "text-orange", minXP: 0, maxXP: 1000 },
  { name: "Серебро", icon: "🥈", color: "text-white/70", minXP: 1000, maxXP: 3000 },
  { name: "Золото", icon: "🥇", color: "text-gold", minXP: 3000, maxXP: 6000 },
  { name: "Сапфир", icon: "💎", color: "text-blue", minXP: 6000, maxXP: 12000, current: true },
  { name: "Рубин", icon: "🔴", color: "text-red", minXP: 12000, maxXP: 25000 },
  { name: "Легенда", icon: "👑", color: "text-purple", minXP: 25000, maxXP: Infinity },
];

function LeaguesPage() {
  const { league, user } = useApp();
  const [activeTab, setActiveTab] = useState<"table" | "tiers">("table");

  const promotionZone = league.slice(0, 3);
  const safeZone = league.slice(3, 7);
  const dangerZone = league.slice(7);

  const currentTierIndex = LEAGUE_TIERS.findIndex((t) => t.current);
  const currentTier = LEAGUE_TIERS[currentTierIndex];
  const nextTier = LEAGUE_TIERS[currentTierIndex + 1];
  const myXP = league.find((p) => p.me)?.xp ?? 0;

  const timeLeft = { days: 3, hours: 14, mins: 22 };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl lg:text-4xl flex items-center gap-3">
          <Trophy className="size-8 text-blue" /> Лиги
        </h1>
        <p className="text-text-secondary text-sm mt-1">Сапфировая лига · Сезон 4 · 10 участников</p>
      </div>

      {/* Countdown + My stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="!p-5 border-blue/20 bg-gradient-to-r from-blue/10 to-transparent">
          <div className="text-xs uppercase tracking-wider text-blue mb-2 flex items-center gap-2">
            <Trophy className="size-3.5" /> Текущая лига
          </div>
          <div className="font-display text-2xl">💎 {currentTier.name}</div>
          <div className="text-xs text-text-secondary mt-1">Сброс через</div>
          <div className="font-mono text-xl text-text-primary mt-0.5">
            {timeLeft.days}д {timeLeft.hours}ч {timeLeft.mins}м
          </div>
        </Card>

        <Card className="!p-5">
          <div className="text-xs uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-2">
            <TrendingUp className="size-3.5" /> Мой прогресс
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-display text-lg">#{user.leagueRank} место</span>
            <Tag variant="rare">{myXP} XP</Tag>
          </div>
          {nextTier && (
            <>
              <div className="text-xs text-text-secondary mb-2">До {nextTier.icon} {nextTier.name}: <span className="text-text-primary font-semibold">{nextTier.minXP - myXP} XP</span></div>
              <XPBar value={myXP - currentTier.minXP} max={currentTier.maxXP! - currentTier.minXP} />
            </>
          )}
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["table", "tiers"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition border ${
              activeTab === tab
                ? "bg-red text-white border-red shadow-red-glow"
                : "border-border-default text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab === "table" ? "Таблица" : "Уровни лиг"}
          </button>
        ))}
      </div>

      {activeTab === "table" && (
        <div className="space-y-2">
          {/* Promotion zone */}
          <div className="text-[11px] uppercase tracking-wider text-green font-semibold flex items-center gap-2 mb-2">
            <TrendingUp className="size-3.5" /> Зона повышения (топ-3)
          </div>
          {promotionZone.map((p) => (
            <PlayerRow key={p.rank} player={p} zone="promotion" />
          ))}

          <div className="my-3 h-px bg-border-default" />
          <div className="text-[11px] uppercase tracking-wider text-text-tertiary font-semibold flex items-center gap-2 mb-2">
            <Shield className="size-3.5" /> Безопасная зона
          </div>
          {safeZone.map((p) => (
            <PlayerRow key={p.rank} player={p} zone="safe" />
          ))}

          <div className="my-3 h-px bg-border-default" />
          <div className="text-[11px] uppercase tracking-wider text-red font-semibold flex items-center gap-2 mb-2">
            ⚠️ Зона вылета (нижние 3)
          </div>
          {dangerZone.map((p) => (
            <PlayerRow key={p.rank} player={p} zone="danger" />
          ))}
        </div>
      )}

      {activeTab === "tiers" && (
        <div className="space-y-3">
          {LEAGUE_TIERS.map((tier, i) => (
            <Card
              key={tier.name}
              className={`!p-5 ${tier.current ? "border-blue/40 bg-blue/5" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{tier.icon}</div>
                <div className="flex-1">
                  <div className={`font-display text-lg ${tier.color}`}>{tier.name}</div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {tier.maxXP === Infinity ? `${tier.minXP.toLocaleString()}+ XP` : `${tier.minXP.toLocaleString()} – ${tier.maxXP.toLocaleString()} XP`}
                  </div>
                </div>
                <div className="text-right">
                  {tier.current && <Tag variant="rare">Текущая</Tag>}
                  {i < currentTierIndex && <Tag variant="success">Пройдена ✓</Tag>}
                  {i > currentTierIndex && <Tag variant="common">Заблокировано</Tag>}
                </div>
              </div>
              {tier.current && (
                <div className="mt-3">
                  <div className="text-[11px] text-text-secondary mb-1">Прогресс до {nextTier?.name}</div>
                  <XPBar value={myXP - tier.minXP} max={tier.maxXP - tier.minXP} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerRow({
  player,
  zone,
}: {
  player: { rank: number; name: string; xp: number; streak: number; me?: boolean; avatar: string };
  zone: "promotion" | "safe" | "danger";
}) {
  const rankStyle =
    player.rank === 1
      ? "bg-gold text-black"
      : player.rank === 2
      ? "bg-white/40 text-black"
      : player.rank === 3
      ? "bg-orange/70 text-black"
      : "bg-bg-surface3 text-text-secondary";

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        player.me
          ? "bg-red-dim border-border-accent"
          : "bg-bg-surface border-border-default hover:border-border-accent"
      }`}
    >
      <span className={`size-7 grid place-items-center rounded-full text-xs font-mono font-bold shrink-0 ${rankStyle}`}>
        {player.rank}
      </span>
      <div className={`size-9 rounded-full grid place-items-center font-semibold text-sm shrink-0 ${
        player.me ? "bg-gradient-to-br from-red-hover to-red text-white" : "bg-bg-surface2 text-text-secondary"
      }`}>
        {player.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate ${player.me ? "text-white" : ""}`}>
          {player.name} {player.me && <span className="text-[10px] text-red uppercase tracking-wider ml-1">Это я</span>}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-text-secondary">
          <Flame className="size-3 text-orange" /> {player.streak} дней
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm font-semibold">{player.xp.toLocaleString()}</div>
        <div className="text-[10px] text-text-secondary">XP</div>
      </div>
      {zone === "promotion" && <div className="text-green text-xs">↑</div>}
      {zone === "danger" && <div className="text-red text-xs">↓</div>}
    </div>
  );
}
