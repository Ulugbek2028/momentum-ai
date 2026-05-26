import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Zap, Shield, Sparkles, Star } from "lucide-react";
import { Card, Tag } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";
import { useState } from "react";
import type { ShopItem } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
});

type Category = "all" | "streak" | "xp" | "cosmetic" | "access";

const CATEGORY_LABELS: Record<Exclude<Category, "all">, { label: string; icon: typeof ShoppingBag; color: string }> = {
  streak: { label: "Страйк", icon: Shield, color: "text-orange" },
  xp: { label: "Опыт", icon: Zap, color: "text-gold" },
  cosmetic: { label: "Косметика", icon: Sparkles, color: "text-purple" },
  access: { label: "Доступ", icon: Star, color: "text-blue" },
};

function ShopPage() {
  const { shop, buyItem, user } = useApp();
  const [category, setCategory] = useState<Category>("all");
  const [notification, setNotification] = useState<string | null>(null);
  const [buying, setBuying] = useState<string | null>(null);

  const visible = category === "all" ? shop : shop.filter((item) => item.category === category);

  const canAfford = (item: ShopItem): boolean => {
    if (item.owned) return false;
    if (item.currency === "gem") return user.gems >= item.cost;
    return user.xp >= item.cost;
  };

  const handleBuy = (item: ShopItem) => {
    if (!canAfford(item)) return;
    setBuying(item.id);
    setTimeout(() => {
      buyItem(item.id);
      setBuying(null);
      setNotification(`${item.name} — куплено!`);
      setTimeout(() => setNotification(null), 2000);
    }, 500);
  };

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "streak", label: "Страйк" },
    { key: "xp", label: "Опыт" },
    { key: "cosmetic", label: "Косметика" },
    { key: "access", label: "Доступ" },
  ];

  return (
    <div className="animate-fade-in">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green text-black font-bold px-5 py-2 rounded-full text-sm shadow-lg animate-bounce pointer-events-none">
          ✓ {notification}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl flex items-center gap-3">
            <ShoppingBag className="size-8 text-gold" /> Магазин
          </h1>
          <p className="text-text-secondary text-sm mt-1">Бустеры, защита и кастомизация</p>
        </div>

        {/* Balance */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-3 flex items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-lg text-gold font-bold">💎 {user.gems}</div>
            <div className="text-[11px] text-text-secondary">Гемов</div>
          </div>
          <div className="w-px h-8 bg-border-default" />
          <div className="text-center">
            <div className="font-mono text-lg text-yellow-400 font-bold">⚡ {user.xp.toLocaleString()}</div>
            <div className="text-[11px] text-text-secondary">XP</div>
          </div>
        </div>
      </div>

      {/* Featured banner */}
      <div className="relative rounded-xl overflow-hidden border border-gold/20 bg-gradient-to-r from-gold/10 via-orange/5 to-transparent p-6 mb-6">
        <div className="absolute top-3 right-3">
          <Tag variant="legendary">🔥 Горячее</Tag>
        </div>
        <div className="text-3xl mb-2">⚡</div>
        <div className="font-display text-2xl">Двойное XP (1ч)</div>
        <div className="text-sm text-text-secondary mt-1 mb-4">Зарабатывай x2 XP в течение часа — лучший способ прокачаться быстро</div>
        <button
          onClick={() => handleBuy(shop.find((s) => s.id === "s2")!)}
          className="bg-gold text-black font-bold px-6 py-2.5 rounded-md hover:brightness-110 transition shadow-gold-glow"
        >
          Купить за 💎 20
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
              category === c.key
                ? "bg-red text-white border-red shadow-red-glow"
                : "border-border-default text-text-secondary hover:text-text-primary hover:border-border-accent"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((item, idx) => {
          const affordable = canAfford(item);
          const catInfo = item.category !== "all" ? CATEGORY_LABELS[item.category as Exclude<Category, "all">] : null;

          return (
            <div
              key={item.id}
              style={{ animationDelay: `${idx * 50}ms` }}
              className="animate-fade-in opacity-0"
            >
              <Card className={`!p-5 h-full flex flex-col ${item.owned ? "border-green/30 bg-green/5" : ""} ${item.popular ? "border-gold/20" : ""}`}>
                {item.popular && (
                  <div className="flex justify-end mb-2">
                    <Tag variant="legendary">Популярное</Tag>
                  </div>
                )}
                {item.owned && (
                  <div className="flex justify-end mb-2">
                    <Tag variant="success">В инвентаре ✓</Tag>
                  </div>
                )}

                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-display text-lg leading-tight">{item.name}</div>
                <div className="text-xs text-text-secondary mt-1 mb-4 flex-1">{item.desc}</div>

                {catInfo && (
                  <div className={`flex items-center gap-1 text-[11px] mb-3 ${catInfo.color}`}>
                    <catInfo.icon className="size-3" />
                    {catInfo.label}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <div className="font-mono font-bold text-base">
                    {item.currency === "gem" ? "💎" : "⚡"} {item.cost.toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={item.owned || !affordable || buying === item.id}
                    className={`text-xs font-semibold px-4 py-2 rounded-md transition ${
                      item.owned
                        ? "bg-bg-surface3 text-text-tertiary cursor-not-allowed"
                        : affordable
                        ? buying === item.id
                          ? "bg-green/60 text-black animate-pulse"
                          : "bg-red hover:bg-red-hover text-white shadow-red-glow"
                        : "bg-bg-surface2 text-text-tertiary cursor-not-allowed"
                    }`}
                  >
                    {item.owned ? "Куплено" : !affordable ? "Не хватает" : buying === item.id ? "..." : "Купить"}
                  </button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Get more gems */}
      <Card className="!p-6 mt-6 border-purple/20 bg-gradient-to-r from-purple/10 to-transparent">
        <div className="flex items-center gap-4">
          <div className="text-4xl">💎</div>
          <div className="flex-1">
            <div className="font-display text-xl">Нужно больше гемов?</div>
            <div className="text-sm text-text-secondary mt-1">Выполняй квесты, поднимайся в лиге или пополни через приложение</div>
          </div>
          <button className="shrink-0 bg-purple/20 hover:bg-purple/30 border border-purple/30 text-purple font-semibold text-sm px-5 py-2.5 rounded-md transition">
            Пополнить
          </button>
        </div>
      </Card>
    </div>
  );
}
