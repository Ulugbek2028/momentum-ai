import { createFileRoute } from "@tanstack/react-router";
import { Settings, Bell, Globe, Shield, CreditCard, Moon, ChevronRight, Check } from "lucide-react";
import { Card } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-red" : "bg-bg-surface3"
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingsPage() {
  const { user, updateUser } = useApp();

  const [notif, setNotif] = useState({
    dailyReminder: true,
    streakAlert: true,
    leagueUpdate: false,
    mentorNews: true,
    weeklyReport: false,
  });
  const [language, setLanguage] = useState("ru");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const plans = [
    {
      key: "free",
      name: "Бесплатный",
      price: "0 ₽",
      features: ["2 ментора", "3 сессии/день", "Базовые квесты"],
      color: "border-border-default",
    },
    {
      key: "pro",
      name: "Pro",
      price: "990 ₽/мес",
      features: ["6 менторов", "Безлимит сессии", "Все квесты", "Двойное XP"],
      color: "border-blue/40",
      highlight: true,
    },
    {
      key: "elite",
      name: "Elite",
      price: "2490 ₽/мес",
      features: ["Все менторы", "Приоритетный AI", "Личный коуч", "Кастомный аватар"],
      color: "border-gold/40",
    },
  ];

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="font-display text-3xl lg:text-4xl mb-6 flex items-center gap-3">
        <Settings className="size-8 text-text-secondary" /> Настройки
      </h1>

      {saved && (
        <div className="flex items-center gap-2 bg-green/10 border border-green/20 text-green rounded-lg px-4 py-3 mb-4 text-sm animate-fade-in">
          <Check className="size-4" /> Изменения сохранены
        </div>
      )}

      {/* Profile settings */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Shield className="size-3.5" /> Профиль
        </h2>
        <Card className="!p-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Имя</label>
            <input
              defaultValue={user.name}
              onChange={(e) => updateUser({ name: e.target.value })}
              className="bg-bg-surface2 border border-border-default rounded-md px-3 py-2 text-sm focus:border-red focus:outline-none focus:ring-2 focus:ring-red-dim transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Email</label>
            <input
              defaultValue={user.email}
              className="bg-bg-surface2 border border-border-default rounded-md px-3 py-2 text-sm focus:border-red focus:outline-none focus:ring-2 focus:ring-red-dim transition"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-red hover:bg-red-hover text-white font-semibold text-sm px-5 py-2.5 rounded-md transition shadow-red-glow"
          >
            Сохранить изменения
          </button>
        </Card>
      </section>

      {/* Notifications */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Bell className="size-3.5" /> Уведомления
        </h2>
        <Card className="!p-5 space-y-4">
          {(
            [
              { key: "dailyReminder" as const, label: "Ежедневное напоминание", desc: "Напомнить открыть приложение" },
              { key: "streakAlert" as const, label: "Алерт страйка", desc: "Если грозит потеря серии" },
              { key: "leagueUpdate" as const, label: "Обновления лиги", desc: "Изменения в таблице" },
              { key: "mentorNews" as const, label: "Новости менторов", desc: "Новый контент от ментора" },
              { key: "weeklyReport" as const, label: "Еженедельный отчёт", desc: "Итоги недели каждое воскресенье" },
            ] as const
          ).map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-[11px] text-text-secondary">{item.desc}</div>
              </div>
              <Toggle
                enabled={notif[item.key]}
                onToggle={() => setNotif((n) => ({ ...n, [item.key]: !n[item.key] }))}
              />
            </div>
          ))}
        </Card>
      </section>

      {/* Language */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Globe className="size-3.5" /> Язык
        </h2>
        <Card className="!p-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "ru", label: "Русский", flag: "🇷🇺" },
              { key: "uz", label: "O'zbek", flag: "🇺🇿" },
              { key: "en", label: "English", flag: "🇺🇸" },
            ].map((lang) => (
              <button
                key={lang.key}
                onClick={() => setLanguage(lang.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition text-sm ${
                  language === lang.key
                    ? "border-red bg-red-dim text-white"
                    : "border-border-default text-text-secondary hover:border-border-accent hover:text-text-primary"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-xs">{lang.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Appearance */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Moon className="size-3.5" /> Интерфейс
        </h2>
        <Card className="!p-5 space-y-3">
          {[
            { label: "Тёмная тема", desc: "Текущая тема оформления", locked: false, enabled: true },
            { label: "Компактный вид", desc: "Уменьшить размер карточек", locked: false, enabled: false },
            { label: "Анимации", desc: "Плавные переходы и эффекты", locked: false, enabled: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-[11px] text-text-secondary">{item.desc}</div>
              </div>
              <Toggle enabled={item.enabled} onToggle={() => {}} />
            </div>
          ))}
        </Card>
      </section>

      {/* Subscription */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <CreditCard className="size-3.5" /> Подписка
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-lg border p-4 ${plan.color} ${plan.key === user.plan ? "bg-blue/5" : "bg-bg-surface"} ${plan.highlight ? "ring-1 ring-blue/40" : ""} transition`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-lg">{plan.name}</div>
                {plan.key === user.plan && <div className="text-[10px] text-green font-semibold">ТЕКУЩИЙ</div>}
              </div>
              <div className="font-mono text-xl font-bold mb-3">{plan.price}</div>
              <ul className="space-y-1 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-text-secondary flex items-center gap-1.5">
                    <Check className="size-3 text-green shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.key === user.plan}
                className={`w-full text-xs font-semibold py-2 rounded-md transition ${
                  plan.key === user.plan
                    ? "bg-bg-surface3 text-text-tertiary cursor-not-allowed"
                    : plan.key === "elite"
                    ? "bg-gold text-black hover:brightness-110"
                    : "bg-blue/20 border border-blue/30 text-blue hover:bg-blue/30"
                }`}
              >
                {plan.key === user.plan ? "Текущий план" : "Переключиться"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-xs uppercase tracking-wider text-red mb-3 flex items-center gap-2">
          ⚠️ Опасная зона
        </h2>
        <Card className="!p-5 space-y-3">
          {[
            { label: "Сбросить прогресс квестов", desc: "Все квесты вернутся к началу" },
            { label: "Удалить историю сессий", desc: "Чаты будут удалены навсегда" },
            { label: "Удалить аккаунт", desc: "Все данные будут стёрты" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-[11px] text-text-secondary">{item.desc}</div>
              </div>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red/30 text-red hover:bg-red-dim transition flex items-center gap-1">
                <ChevronRight className="size-3" /> Далее
              </button>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
