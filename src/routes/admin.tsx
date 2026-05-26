import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Swords, ShoppingBag, TrendingUp,
  Edit2, Save, X, Flame, Zap, Heart, Trophy, Shield, AlertTriangle, CheckCircle
} from "lucide-react";
import { Card, Tag, XPBar } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

// Admin credentials (static for demo)
const ADMIN_EMAIL = "admin@mindai.uz";
const ADMIN_PASSWORD = "admin123";

const PLATFORM_STATS = [
  { label: "Всего пользователей", value: "2,847", change: "+142 за неделю", icon: Users, color: "text-blue" },
  { label: "Активных сегодня", value: "1,203", change: "42% DAU", icon: TrendingUp, color: "text-green" },
  { label: "Сессий за 7 дней", value: "18,492", change: "+23%", icon: Swords, color: "text-red" },
  { label: "Доход (месяц)", value: "₽ 284,700", change: "+18% vs прошлый", icon: ShoppingBag, color: "text-gold" },
];

const MOCK_USERS = [
  { id: "u1", name: "Алишер К.", email: "alisher@mfaktor.uz", plan: "pro", streak: 47, level: 7, xp: 4280, status: "active" },
  { id: "u2", name: "Дилшод М.", email: "dilshod@gmail.com", plan: "elite", streak: 21, level: 9, xp: 8100, status: "active" },
  { id: "u3", name: "Камила Н.", email: "kamila@example.com", plan: "pro", streak: 14, level: 6, xp: 3500, status: "active" },
  { id: "u4", name: "Бахтиёр У.", email: "bakhtiyor@biz.uz", plan: "free", streak: 9, level: 4, xp: 1800, status: "inactive" },
  { id: "u5", name: "Зарина Х.", email: "zarina@mail.ru", plan: "pro", streak: 5, level: 5, xp: 2740, status: "active" },
  { id: "u6", name: "Нодир Р.", email: "nodir@example.com", plan: "free", streak: 3, level: 3, xp: 1200, status: "active" },
];

type AdminSection = "overview" | "users" | "content" | "access";

function AdminPage() {
  const { user: currentUser, adminUpdateUser, adminResetStreak, quests, shop } = useApp();
  const [authed, setAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [section, setSection] = useState<AdminSection>("overview");
  const [editingUser, setEditingUser] = useState(false);
  const [editXP, setEditXP] = useState(String(currentUser.xp));
  const [editGems, setEditGems] = useState(String(currentUser.gems));
  const [editStreak, setEditStreak] = useState(String(currentUser.streak));
  const [editPlan, setEditPlan] = useState<"free" | "pro" | "elite">(currentUser.plan);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // ─── Login gate ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-[80dvh] flex items-center justify-center animate-fade-in">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="size-16 rounded-xl bg-red mx-auto grid place-items-center mb-4">
              <Shield className="size-8 text-white" />
            </div>
            <h1 className="font-display text-3xl">Панель администратора</h1>
            <p className="text-text-secondary text-sm mt-1">Mind AI · Только для персонала</p>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 bg-red-dim border border-red/20 text-red rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertTriangle className="size-4 shrink-0" /> {loginError}
            </div>
          )}

          <Card className="!p-6 space-y-4">
            <div>
              <label className="text-xs text-text-secondary mb-1.5 block">Email администратора</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@mindai.uz"
                className="w-full bg-bg-surface2 border border-border-default rounded-md px-3 py-2.5 text-sm placeholder:text-text-tertiary focus:border-red focus:outline-none focus:ring-2 focus:ring-red-dim transition"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1.5 block">Пароль</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full bg-bg-surface2 border border-border-default rounded-md px-3 py-2.5 text-sm placeholder:text-text-tertiary focus:border-red focus:outline-none focus:ring-2 focus:ring-red-dim transition"
              />
            </div>
            <div className="text-xs text-text-tertiary bg-bg-surface2 rounded p-2">
              Demo: <span className="text-text-secondary">admin@mindai.uz</span> / <span className="text-text-secondary">admin123</span>
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-red hover:bg-red-hover text-white font-semibold py-2.5 rounded-md transition shadow-red-glow"
            >
              Войти в панель
            </button>
          </Card>
        </div>
      </div>
    );
  }

  function handleLogin() {
    if (loginEmail === ADMIN_EMAIL && loginPass === ADMIN_PASSWORD) {
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Неверный email или пароль");
    }
  }

  function handleSaveUser() {
    adminUpdateUser({
      xp: Math.max(0, Number(editXP) || 0),
      gems: Math.max(0, Number(editGems) || 0),
      streak: Math.max(0, Number(editStreak) || 0),
      plan: editPlan,
    });
    setEditingUser(false);
    showNotif("Данные пользователя обновлены ✓");
  }

  function handleResetStreak() {
    adminResetStreak();
    setEditStreak("0");
    showNotif("Страйк пользователя сброшен");
  }

  const navItems: { key: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: "Обзор", icon: LayoutDashboard },
    { key: "users", label: "Пользователи", icon: Users },
    { key: "content", label: "Контент", icon: Swords },
    { key: "access", label: "Доступы", icon: Shield },
  ];

  return (
    <div className="animate-fade-in">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green text-black font-bold px-5 py-2 rounded-full text-sm shadow-lg animate-bounce pointer-events-none flex items-center gap-2">
          <CheckCircle className="size-4" /> {notification}
        </div>
      )}

      {/* Admin header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="size-5 text-red" />
            <span className="text-xs uppercase tracking-wider text-red font-semibold">Admin Panel</span>
          </div>
          <h1 className="font-display text-3xl">Mind AI Dashboard</h1>
          <p className="text-text-secondary text-sm mt-0.5">MFaktor Holding · Ташкент</p>
        </div>
        <button
          onClick={() => { setAuthed(false); setLoginEmail(""); setLoginPass(""); }}
          className="text-xs font-semibold px-4 py-2 rounded-md border border-border-default text-text-secondary hover:text-red hover:border-red/30 transition flex items-center gap-1.5"
        >
          <X className="size-3.5" /> Выйти
        </button>
      </div>

      {/* Section nav */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition border ${
              section === item.key
                ? "bg-red text-white border-red shadow-red-glow"
                : "border-border-default text-text-secondary hover:text-text-primary"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ──────────────────────────────────────────────────────── */}
      {section === "overview" && (
        <div className="space-y-6">
          {/* Platform stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORM_STATS.map((s) => (
              <Card key={s.label} className="!p-5">
                <s.icon className={`size-6 mb-3 ${s.color}`} />
                <div className="font-mono text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-text-secondary mt-1">{s.label}</div>
                <div className={`text-[11px] mt-0.5 ${s.color}`}>{s.change}</div>
              </Card>
            ))}
          </div>

          {/* Charts placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="!p-5">
              <h3 className="font-display text-lg mb-4">Активность по дням (7д)</h3>
              <div className="flex items-end gap-2 h-32">
                {[42, 68, 55, 80, 73, 91, 85].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-red to-orange transition-all hover:brightness-125"
                      style={{ height: `${h}%` }}
                    />
                    <div className="text-[10px] text-text-tertiary">
                      {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="!p-5">
              <h3 className="font-display text-lg mb-4">Распределение планов</h3>
              <div className="space-y-3">
                {[
                  { label: "Бесплатный", pct: 58, color: "bg-bg-surface3", count: "1,651" },
                  { label: "Pro", pct: 32, color: "bg-blue", count: "911" },
                  { label: "Elite", pct: 10, color: "bg-gold", count: "285" },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>{p.label}</span>
                      <span className="font-mono text-text-secondary">{p.count} ({p.pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-bg-surface3 overflow-hidden">
                      <div className={`h-full rounded-full ${p.color} transition-all`} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Top mentors */}
          <Card className="!p-5">
            <h3 className="font-display text-lg mb-4">Топ менторов по сессиям</h3>
            <div className="space-y-3">
              {[
                { name: "Навал Равикант", sessions: 3400, pct: 100, color: "from-purple to-blue" },
                { name: "Стив Джобс", sessions: 2900, pct: 85, color: "from-white/60 to-white/20" },
                { name: "Рэй Далио", sessions: 1200, pct: 35, color: "from-blue to-purple" },
                { name: "Нассим Талеб", sessions: 890, pct: 26, color: "from-orange to-red" },
              ].map((m, i) => (
                <div key={m.name} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-text-tertiary w-4">{i + 1}</span>
                  <div className={`size-8 rounded-full bg-gradient-to-br ${m.color} grid place-items-center text-[10px] font-bold text-white shrink-0`}>
                    {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">{m.name}</div>
                    <div className="h-1.5 rounded-full bg-bg-surface3 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-text-secondary shrink-0">{m.sessions.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── USERS ─────────────────────────────────────────────────────────── */}
      {section === "users" && (
        <div className="space-y-6">
          {/* Current user editor */}
          <Card className="!p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Демо-аккаунт: {currentUser.name}</h3>
              {!editingUser ? (
                <button
                  onClick={() => { setEditingUser(true); setEditXP(String(currentUser.xp)); setEditGems(String(currentUser.gems)); setEditStreak(String(currentUser.streak)); setEditPlan(currentUser.plan); }}
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md bg-bg-surface2 hover:bg-bg-surface3 border border-border-default transition"
                >
                  <Edit2 className="size-3.5" /> Редактировать
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUser}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md bg-green text-black hover:brightness-110 transition"
                  >
                    <Save className="size-3.5" /> Сохранить
                  </button>
                  <button
                    onClick={() => setEditingUser(false)}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md border border-border-default text-text-secondary hover:border-red/30 hover:text-red transition"
                  >
                    <X className="size-3.5" /> Отмена
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {[
                { label: "XP", icon: Zap, color: "text-gold", value: editXP, key: "xp", setter: setEditXP },
                { label: "Гемы 💎", icon: ShoppingBag, color: "text-blue", value: editGems, key: "gems", setter: setEditGems },
                { label: "Серия 🔥", icon: Flame, color: "text-orange", value: editStreak, key: "streak", setter: setEditStreak },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-text-secondary mb-1.5 block flex items-center gap-1">
                    <f.icon className={`size-3 ${f.color}`} /> {f.label}
                  </label>
                  {editingUser ? (
                    <input
                      type="number"
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                      className="w-full bg-bg-surface2 border border-border-default rounded-md px-3 py-2 text-sm font-mono focus:border-red focus:outline-none transition"
                    />
                  ) : (
                    <div className="font-mono text-lg font-bold">{f.value}</div>
                  )}
                </div>
              ))}

              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Тариф</label>
                {editingUser ? (
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value as "free" | "pro" | "elite")}
                    className="w-full bg-bg-surface2 border border-border-default rounded-md px-3 py-2 text-sm focus:border-red focus:outline-none transition"
                  >
                    <option value="free">Бесплатный</option>
                    <option value="pro">Pro</option>
                    <option value="elite">Elite</option>
                  </select>
                ) : (
                  <Tag variant={currentUser.plan === "elite" ? "legendary" : currentUser.plan === "pro" ? "rare" : "common"}>
                    {currentUser.plan}
                  </Tag>
                )}
              </div>
            </div>

            {/* XP bar live */}
            <div className="mb-4">
              <div className="text-xs text-text-secondary mb-1">XP прогресс (Ур. {currentUser.level})</div>
              <XPBar value={currentUser.xp} max={currentUser.xpMax} />
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleResetStreak}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-orange/30 text-orange hover:bg-orange/10 transition flex items-center gap-1.5"
              >
                <Flame className="size-3" /> Сбросить страйк
              </button>
              <button
                onClick={() => { adminUpdateUser({ hearts: 5 }); showNotif("Сердечки восполнены ✓"); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red/30 text-red hover:bg-red-dim transition flex items-center gap-1.5"
              >
                <Heart className="size-3" /> Восполнить сердечки
              </button>
              <button
                onClick={() => { adminUpdateUser({ gems: currentUser.gems + 100 }); showNotif("+100 гемов добавлено ✓"); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-blue/30 text-blue hover:bg-blue/10 transition flex items-center gap-1.5"
              >
                💎 +100 Гемов
              </button>
              <button
                onClick={() => { adminUpdateUser({ xp: Math.min(currentUser.xp + 500, currentUser.xpMax - 1) }); showNotif("+500 XP добавлено ✓"); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-gold/30 text-gold hover:bg-gold-dim transition flex items-center gap-1.5"
              >
                <Zap className="size-3" /> +500 XP
              </button>
            </div>
          </Card>

          {/* User table */}
          <Card className="!p-5">
            <h3 className="font-display text-xl mb-4">Все пользователи ({MOCK_USERS.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-text-secondary border-b border-border-default">
                    <th className="text-left pb-3 pr-4">Пользователь</th>
                    <th className="text-left pb-3 pr-4">Тариф</th>
                    <th className="text-right pb-3 pr-4">XP</th>
                    <th className="text-right pb-3 pr-4">Серия</th>
                    <th className="text-right pb-3 pr-4">Ур.</th>
                    <th className="text-left pb-3">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map((u) => (
                    <tr key={u.id} className={`border-b border-border-subtle hover:bg-bg-surface2 transition ${u.id === "u1" ? "bg-red-dim/30" : ""}`}>
                      <td className="py-3 pr-4">
                        <div className="font-medium">{u.name} {u.id === "u1" && <span className="text-[10px] text-red ml-1">DEMO</span>}</div>
                        <div className="text-[11px] text-text-secondary">{u.email}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <Tag variant={u.plan === "elite" ? "legendary" : u.plan === "pro" ? "rare" : "common"}>{u.plan}</Tag>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-text-secondary">{u.xp.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-right">
                        <span className="flex items-center justify-end gap-1 text-orange">
                          <Flame className="size-3" /> {u.streak}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono">{u.level}</td>
                      <td className="py-3">
                        <span className={`text-[11px] font-semibold ${u.status === "active" ? "text-green" : "text-text-tertiary"}`}>
                          {u.status === "active" ? "● Активен" : "○ Неактивен"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      {section === "content" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="!p-5 text-center">
              <div className="font-mono text-3xl font-bold text-red mb-1">{quests.length}</div>
              <div className="text-sm text-text-secondary">Квестов</div>
            </Card>
            <Card className="!p-5 text-center">
              <div className="font-mono text-3xl font-bold text-gold mb-1">{shop.length}</div>
              <div className="text-sm text-text-secondary">Товаров в магазине</div>
            </Card>
            <Card className="!p-5 text-center">
              <div className="font-mono text-3xl font-bold text-blue mb-1">6</div>
              <div className="text-sm text-text-secondary">Менторов</div>
            </Card>
          </div>

          <Card className="!p-5">
            <h3 className="font-display text-xl mb-4">Квесты</h3>
            <div className="space-y-3">
              {quests.map((q) => (
                <div key={q.id} className="flex items-center gap-4 py-2 border-b border-border-subtle last:border-0">
                  <div className="text-xl w-8 text-center">{q.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{q.title}</div>
                    <div className="text-[11px] text-text-secondary">{q.desc}</div>
                  </div>
                  <Tag variant={q.type === "daily" ? "common" : q.type === "weekly" ? "rare" : q.type === "epic" ? "epic" : "legendary"}>
                    {q.type}
                  </Tag>
                  <div className="text-xs font-mono text-gold">+{q.xpReward} XP</div>
                  <div className={`text-[11px] font-semibold ${q.done ? "text-green" : "text-text-secondary"}`}>
                    {q.done ? "✓ Выполнен" : `${q.progress}/${q.total}`}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="!p-5">
            <h3 className="font-display text-xl mb-4">Товары магазина</h3>
            <div className="space-y-3">
              {shop.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-border-subtle last:border-0">
                  <div className="text-xl w-8 text-center">{item.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-[11px] text-text-secondary">{item.desc}</div>
                  </div>
                  <div className="font-mono text-sm font-bold">
                    {item.currency === "gem" ? "💎" : "⚡"} {item.cost}
                  </div>
                  {item.popular && <Tag variant="legendary">Топ</Tag>}
                  {item.owned && <Tag variant="success">В инвентаре</Tag>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── ACCESS ────────────────────────────────────────────────────────── */}
      {section === "access" && (
        <div className="space-y-6">
          <Card className="!p-6">
            <h3 className="font-display text-xl mb-1">Управление доступами</h3>
            <p className="text-text-secondary text-sm mb-6">Настройте права доступа для менторов и функций по тарифу</p>

            <div className="space-y-4">
              {[
                { mentor: "Рэй Далио", access: { free: true, pro: true, elite: true } },
                { mentor: "Нассим Талеб", access: { free: true, pro: true, elite: true } },
                { mentor: "Навал Равикант", access: { free: true, pro: true, elite: true } },
                { mentor: "Алишер Усманов", access: { free: false, pro: true, elite: true } },
                { mentor: "Стив Джобс", access: { free: false, pro: false, elite: true } },
                { mentor: "Масаёси Сон", access: { free: false, pro: false, elite: true } },
              ].map((m) => (
                <div key={m.mentor} className="flex items-center gap-4 py-3 border-b border-border-subtle last:border-0">
                  <div className="flex-1 font-medium text-sm">{m.mentor}</div>
                  {(["free", "pro", "elite"] as const).map((plan) => (
                    <div key={plan} className="flex flex-col items-center gap-1">
                      <div className={`text-[10px] uppercase tracking-wider ${plan === "elite" ? "text-gold" : plan === "pro" ? "text-blue" : "text-text-tertiary"}`}>
                        {plan}
                      </div>
                      <div className={`size-5 rounded grid place-items-center ${m.access[plan] ? "bg-green/20 text-green" : "bg-bg-surface3 text-text-tertiary"}`}>
                        {m.access[plan] ? <CheckCircle className="size-3" /> : <X className="size-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          <Card className="!p-6">
            <h3 className="font-display text-xl mb-4">Функции по тарифам</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-text-secondary">
                    <th className="text-left pb-3">Функция</th>
                    <th className="text-center pb-3">Free</th>
                    <th className="text-center pb-3 text-blue">Pro</th>
                    <th className="text-center pb-3 text-gold">Elite</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Сессии с ментором", free: "3/день", pro: "∞", elite: "∞" },
                    { feature: "Квесты", free: "Ежедневные", pro: "Все", elite: "Все" },
                    { feature: "Лиги", free: "Бронза/Серебро", pro: "Все", elite: "Все" },
                    { feature: "Магазин", free: "Ограничен", pro: "Полный", elite: "VIP" },
                    { feature: "Двойное XP", free: "✗", pro: "✓", elite: "✓ x3" },
                    { feature: "Приоритетный AI", free: "✗", pro: "✗", elite: "✓" },
                    { feature: "Личный коуч", free: "✗", pro: "✗", elite: "✓" },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-border-subtle">
                      <td className="py-2.5 pr-4 text-text-secondary">{row.feature}</td>
                      <td className="py-2.5 text-center text-text-tertiary text-xs">{row.free}</td>
                      <td className="py-2.5 text-center text-blue text-xs font-medium">{row.pro}</td>
                      <td className="py-2.5 text-center text-gold text-xs font-medium">{row.elite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
