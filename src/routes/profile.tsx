import { createFileRoute } from "@tanstack/react-router";
import { User, Flame, Zap, Trophy, Star, Calendar, MessageSquare } from "lucide-react";
import { Card, Tag, LevelRing, XPBar } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

const SESSION_HISTORY = [
  { id: 1, mentor: "Рэй Далио", topic: "Принципы принятия решений", xp: 80, date: "Сегодня, 11:32", duration: "24 мин" },
  { id: 2, mentor: "Навал Равикант", topic: "Личный бренд предпринимателя", xp: 60, date: "Вчера, 18:05", duration: "18 мин" },
  { id: 3, mentor: "Рэй Далио", topic: "Управление рисками портфеля", xp: 90, date: "25 мая, 14:20", duration: "31 мин" },
  { id: 4, mentor: "Нассим Талеб", topic: "Антихрупкость в бизнесе", xp: 70, date: "24 мая, 09:45", duration: "22 мин" },
  { id: 5, mentor: "Навал Равикант", topic: "Leverage и масштабирование", xp: 55, date: "23 мая, 16:30", duration: "16 мин" },
];

const PLAN_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: "Бесплатный", color: "text-text-secondary", bg: "bg-bg-surface3" },
  pro: { label: "Pro", color: "text-blue", bg: "bg-blue/15 border border-blue/30" },
  elite: { label: "Elite", color: "text-gold", bg: "bg-gold-dim border border-gold/30" },
};

function ProfilePage() {
  const { user, achievements } = useApp();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const planInfo = PLAN_BADGES[user.plan];

  const stats = [
    { label: "Всего сессий", value: user.totalSessions, icon: MessageSquare, color: "text-blue" },
    { label: "Всего XP", value: user.totalXP.toLocaleString(), icon: Zap, color: "text-gold" },
    { label: "Серия", value: `${user.streak} дн`, icon: Flame, color: "text-orange" },
    { label: "Рекорд", value: `${user.streakRecord} дн`, icon: Trophy, color: "text-purple" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl lg:text-4xl mb-6 flex items-center gap-3">
        <User className="size-8 text-red" /> Профиль
      </h1>

      {/* Profile card */}
      <Card className="!p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="size-24 rounded-full bg-gradient-to-br from-red-hover to-red grid place-items-center font-display text-4xl text-white">
              {user.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${planInfo.bg} ${planInfo.color}`}>
              {planInfo.label}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-display text-2xl">{user.name}</div>
            <div className="text-text-secondary text-sm mt-0.5">{user.email}</div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Tag variant="rare">Уровень {user.level}</Tag>
              <Tag variant="epic">Стратег</Tag>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Calendar className="size-3" /> С {user.joinedAt}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <LevelRing level={user.level} pct={Math.round((user.xp / user.xpMax) * 100)} />
            <div className="text-center mt-1">
              <div className="text-[11px] text-text-secondary">{user.xp} / {user.xpMax}</div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs text-text-secondary mb-2 flex items-center justify-between">
            <span>XP до уровня {user.level + 1}</span>
            <span className="font-mono">{Math.round((user.xp / user.xpMax) * 100)}%</span>
          </div>
          <XPBar value={user.xp} max={user.xpMax} />
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="!p-4 text-center">
            <s.icon className={`size-6 mx-auto mb-2 ${s.color}`} />
            <div className="font-mono text-xl font-bold">{s.value}</div>
            <div className="text-[11px] text-text-secondary mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Session history */}
        <div>
          <h2 className="font-display text-xl mb-4">История сессий</h2>
          <div className="space-y-3">
            {SESSION_HISTORY.map((s) => (
              <Card key={s.id} className="!p-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-blue to-purple grid place-items-center font-semibold text-xs text-white shrink-0">
                    {s.mentor.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{s.topic}</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">{s.mentor} · {s.duration}</div>
                    <div className="text-[11px] text-text-tertiary mt-0.5">{s.date}</div>
                  </div>
                  <Tag variant="legendary">+{s.xp} XP</Tag>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="font-display text-xl mb-4">
            Достижения <span className="text-text-secondary font-sans font-normal text-sm ml-1">{unlockedCount}/{achievements.length}</span>
          </h2>
          <div className="space-y-3">
            {achievements.map((a) => (
              <Card
                key={a.id}
                className={`!p-4 ${!a.unlocked ? "opacity-50" : ""}`}
                accent={a.unlocked ? "green" : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="text-[11px] text-text-secondary">{a.desc}</div>
                    {a.unlocked && a.unlockedAt && (
                      <div className="text-[10px] text-text-tertiary mt-0.5">{a.unlockedAt}</div>
                    )}
                  </div>
                  {a.unlocked ? (
                    <Star className="size-4 text-gold fill-gold shrink-0" />
                  ) : (
                    <div className="size-4 rounded-full border border-border-default shrink-0" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
