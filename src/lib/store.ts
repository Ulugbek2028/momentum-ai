import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// ─── Static user data ───────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpMax: number;
  streak: number;
  streakRecord: number;
  hearts: number;
  heartsMax: number;
  gems: number;
  league: string;
  leagueRank: number;
  plan: "free" | "pro" | "elite";
  joinedAt: string;
  totalSessions: number;
  totalXP: number;
}

export interface Quest {
  id: string;
  title: string;
  desc: string;
  type: "daily" | "weekly" | "epic" | "seasonal";
  progress: number;
  total: number;
  xpReward: number;
  gemReward?: number;
  done: boolean;
  locked?: boolean;
  deadline?: string;
  icon: string;
}

export interface LeaguePlayer {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  me?: boolean;
  avatar: string;
}

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  currency: "gem" | "xp";
  category: "streak" | "xp" | "cosmetic" | "access";
  icon: string;
  owned?: boolean;
  popular?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

// ─── Initial state ───────────────────────────────────────────────────────────
const INITIAL_USER: User = {
  id: "u1",
  name: "Алишер К.",
  email: "alisher@mfaktor.uz",
  avatar: "A",
  level: 7,
  xp: 4280,
  xpMax: 5000,
  streak: 47,
  streakRecord: 63,
  hearts: 3,
  heartsMax: 5,
  gems: 248,
  league: "Сапфир",
  leagueRank: 5,
  plan: "pro",
  joinedAt: "2024-11-01",
  totalSessions: 142,
  totalXP: 28640,
};

const INITIAL_QUESTS: Quest[] = [
  { id: "q1", title: "Чат с ментором", desc: "Проведи 20-минутную сессию с любым ментором", type: "daily", progress: 1, total: 1, xpReward: 50, done: true, icon: "💬" },
  { id: "q2", title: "Закрыть задачу", desc: "Отметь выполненной хотя бы 1 задачу из плана", type: "daily", progress: 1, total: 1, xpReward: 30, done: true, icon: "✅" },
  { id: "q3", title: "Изучить инсайт", desc: "Прочитай 3 ключевых заметки из сессий", type: "daily", progress: 2, total: 3, xpReward: 40, done: false, icon: "📖" },
  { id: "q4", title: "7 дней подряд", desc: "Заходи в приложение 7 дней без пропусков", type: "weekly", progress: 5, total: 7, xpReward: 200, gemReward: 15, done: false, icon: "🔥" },
  { id: "q5", title: "5 сессий с ментором", desc: "Проведи 5 сессий за неделю", type: "weekly", progress: 3, total: 5, xpReward: 150, done: false, icon: "🎙️" },
  { id: "q6", title: "Построй MVP за неделю", desc: "Выполни все шаги по запуску MVP: исследование, прототип, тест", type: "epic", progress: 2, total: 5, xpReward: 500, gemReward: 50, done: false, deadline: "4 дня", icon: "🚀" },
  { id: "q7", title: "Мастер стратегии", desc: "Пройди 10 сессий с Рэем Далио", type: "epic", progress: 7, total: 10, xpReward: 300, gemReward: 25, done: false, icon: "♟️" },
  { id: "q8", title: "Сезон 4: Рост", desc: "Заработай 10 000 XP за сезон", type: "seasonal", progress: 7240, total: 10000, xpReward: 1000, gemReward: 100, done: false, deadline: "18 дней", icon: "🏆", locked: false },
];

const INITIAL_LEAGUE: LeaguePlayer[] = [
  { rank: 1, name: "Дилшод М.", xp: 4820, streak: 21, avatar: "Д" },
  { rank: 2, name: "Камила Н.", xp: 4310, streak: 14, avatar: "К" },
  { rank: 3, name: "Бахтиёр У.", xp: 3990, streak: 9, avatar: "Б" },
  { rank: 4, name: "Зарина Х.", xp: 2740, streak: 5, avatar: "З" },
  { rank: 5, name: "Алишер К.", xp: 2480, streak: 47, me: true, avatar: "A" },
  { rank: 6, name: "Нодир Р.", xp: 2210, streak: 3, avatar: "Н" },
  { rank: 7, name: "Феруза Т.", xp: 1980, streak: 8, avatar: "Ф" },
  { rank: 8, name: "Санжар А.", xp: 1750, streak: 2, avatar: "С" },
  { rank: 9, name: "Ойдин К.", xp: 1340, streak: 6, avatar: "О" },
  { rank: 10, name: "Тимур М.", xp: 1020, streak: 1, avatar: "Т" },
];

const INITIAL_SHOP: ShopItem[] = [
  { id: "s1", name: "Защита страйка", desc: "Сохрани серию при пропуске одного дня", cost: 10, currency: "gem", category: "streak", icon: "🛡️", popular: true },
  { id: "s2", name: "Двойное XP (1ч)", desc: "Зарабатывай x2 XP в течение часа", cost: 20, currency: "gem", category: "xp", icon: "⚡", popular: true },
  { id: "s3", name: "Восполнить сердечки", desc: "Мгновенно восстанови все 5 сердечек", cost: 15, currency: "gem", category: "streak", icon: "❤️" },
  { id: "s4", name: "Заморозка страйка", desc: "Страйк не сгорит даже без входа (3 дня)", cost: 35, currency: "gem", category: "streak", icon: "❄️" },
  { id: "s5", name: "Тёмная тема Pro", desc: "Эксклюзивная тёмная тема с акцентом Ruby", cost: 500, currency: "xp", category: "cosmetic", icon: "🌑", owned: true },
  { id: "s6", name: "Значок Легенды", desc: "Покажи свой статус в таблице лиги", cost: 800, currency: "xp", category: "cosmetic", icon: "👑" },
  { id: "s7", name: "Ментор на 7 дней", desc: "Разблокируй премиум ментора на неделю", cost: 80, currency: "gem", category: "access", icon: "🔓" },
  { id: "s8", name: "100 💎 Гемов", desc: "Пополни баланс гемов", cost: 4990, currency: "xp", category: "cosmetic", icon: "💎" },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "Первые шаги", desc: "Завершить первую сессию", icon: "🌱", unlocked: true, unlockedAt: "2024-11-01" },
  { id: "a2", title: "Неделя роста", desc: "7 дней подряд без пропуска", icon: "🔥", unlocked: true, unlockedAt: "2024-11-08" },
  { id: "a3", title: "Стратег", desc: "Провести 10 сессий с ментором", icon: "♟️", unlocked: true, unlockedAt: "2024-11-20" },
  { id: "a4", title: "Месяц силы", desc: "30 дней подряд без пропуска", icon: "💪", unlocked: true, unlockedAt: "2024-12-01" },
  { id: "a5", title: "Знаток инсайтов", desc: "Прочитать 50 ключевых заметок", icon: "📚", unlocked: true, unlockedAt: "2024-12-15" },
  { id: "a6", title: "Мастер лиги", desc: "Войти в топ-3 лиги", icon: "🥉", unlocked: false },
  { id: "a7", title: "50 дней", desc: "Серия из 50 дней подряд", icon: "🏅", unlocked: false },
  { id: "a8", title: "Легенда", desc: "Достигнуть 10 уровня", icon: "👑", unlocked: false },
];

// ─── Context ─────────────────────────────────────────────────────────────────
interface AppState {
  user: User;
  quests: Quest[];
  league: LeaguePlayer[];
  shop: ShopItem[];
  achievements: Achievement[];
  // Actions
  completeQuest: (id: string) => void;
  buyItem: (id: string) => void;
  addXP: (amount: number) => void;
  addGems: (amount: number) => void;
  refillHearts: () => void;
  updateUser: (patch: Partial<User>) => void;
  // Admin actions
  adminUpdateUser: (patch: Partial<User>) => void;
  adminResetStreak: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [league] = useState<LeaguePlayer[]>(INITIAL_LEAGUE);
  const [shop, setShop] = useState<ShopItem[]>(INITIAL_SHOP);
  const [achievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const addXP = useCallback((amount: number) => {
    setUser((u) => {
      let xp = u.xp + amount;
      let level = u.level;
      let xpMax = u.xpMax;
      while (xp >= xpMax) {
        xp -= xpMax;
        level += 1;
        xpMax = Math.round(xpMax * 1.15);
      }
      return { ...u, xp, level, xpMax, totalXP: u.totalXP + amount };
    });
  }, []);

  const addGems = useCallback((amount: number) => {
    setUser((u) => ({ ...u, gems: Math.max(0, u.gems + amount) }));
  }, []);

  const completeQuest = useCallback((id: string) => {
    setQuests((qs) =>
      qs.map((q) => {
        if (q.id !== id || q.done) return q;
        const newProgress = Math.min(q.progress + 1, q.total);
        const done = newProgress >= q.total;
        return { ...q, progress: newProgress, done };
      })
    );
  }, []);

  const buyItem = useCallback((id: string) => {
    setShop((items) =>
      items.map((item) => {
        if (item.id !== id || item.owned) return item;
        if (item.currency === "gem" && user.gems >= item.cost) {
          setUser((u) => ({ ...u, gems: u.gems - item.cost }));
          return { ...item, owned: true };
        }
        if (item.currency === "xp" && user.xp >= item.cost) {
          setUser((u) => ({ ...u, xp: Math.max(0, u.xp - item.cost) }));
          return { ...item, owned: true };
        }
        return item;
      })
    );
  }, [user.gems, user.xp]);

  const refillHearts = useCallback(() => {
    if (user.gems >= 15) {
      setUser((u) => ({ ...u, hearts: u.heartsMax, gems: u.gems - 15 }));
    }
  }, [user.gems]);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((u) => ({ ...u, ...patch }));
  }, []);

  const adminUpdateUser = useCallback((patch: Partial<User>) => {
    setUser((u) => ({ ...u, ...patch }));
  }, []);

  const adminResetStreak = useCallback(() => {
    setUser((u) => ({ ...u, streak: 0 }));
  }, []);

  return (
    <AppContext.Provider value={{
      user, quests, league, shop, achievements,
      completeQuest, buyItem, addXP, addGems, refillHearts, updateUser,
      adminUpdateUser, adminResetStreak,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
