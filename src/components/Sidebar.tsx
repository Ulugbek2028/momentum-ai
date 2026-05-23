import { Link } from "@tanstack/react-router";
import { Home, Users, Swords, Trophy, ShoppingBag, User, Settings, Flame, Zap } from "lucide-react";

const navItems = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/mentors", label: "Менторы", icon: Users },
  { to: "/quests", label: "Квесты", icon: Swords, dot: true },
  { to: "/leagues", label: "Лиги", icon: Trophy },
  { to: "/shop", label: "Магазин", icon: ShoppingBag },
];

const bottomItems = [
  { to: "/profile", label: "Профиль", icon: User },
  { to: "/settings", label: "Настройки", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-dvh w-60 flex-col bg-bg-surface border-r border-border-default z-40">
      <div className="px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-red grid place-items-center text-white font-display text-lg">M</div>
          <span className="font-display text-xl tracking-tight">MindAI</span>
        </Link>
      </div>

      <div className="mx-4 mb-4 rounded-lg bg-bg-surface2 p-3 border border-border-default">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-red-hover to-red grid place-items-center text-white font-semibold">A</div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">Алишер К.</div>
            <div className="text-[11px] text-text-secondary flex items-center gap-2">
              <span className="flex items-center gap-1"><Flame className="size-3 text-orange" />47</span>
              <span className="flex items-center gap-1"><Zap className="size-3 text-gold" />Ур.7</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
        <div className="my-3 h-px bg-border-default" />
        {bottomItems.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
      </nav>

      <div className="p-4">
        <Link
          to="/shop"
          className="block text-center bg-gradient-to-r from-red to-red-hover text-white font-semibold py-2.5 rounded-md shadow-red-glow hover:brightness-110 transition"
        >
          Upgrade to Pro
        </Link>
      </div>
    </aside>
  );
}

function NavLink({ to, label, icon: Icon, dot }: { to: string; label: string; icon: typeof Home; dot?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="group flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface2 transition relative border-l-2 border-transparent"
      activeProps={{
        className: "bg-red-dim text-white border-l-2 border-red [&_svg]:text-red",
      }}
    >
      <Icon className="size-4" />
      <span className="flex-1">{label}</span>
      {dot && <span className="size-1.5 rounded-full bg-red" />}
    </Link>
  );
}

export function MobileTabBar() {
  const tabs = [
    { to: "/", label: "Главная", icon: Home },
    { to: "/mentors", label: "Менторы", icon: Users },
    { to: "/chat", label: "Чат", icon: Swords },
    { to: "/leagues", label: "Лиги", icon: Trophy },
    { to: "/profile", label: "Профиль", icon: User },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-bg-surface/90 backdrop-blur-xl border-t border-border-default flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-[10px] text-text-secondary"
          activeProps={{ className: "text-red [&_svg]:text-red" }}
        >
          <Icon className="size-5" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
