import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Lock, Flame } from "lucide-react";
import { Tag } from "@/components/ui-primitives";

export const Route = createFileRoute("/mentors")({
  component: MentorsPage,
});

const MENTORS = [
  { id: "rd", name: "Рэй Далио", country: "США · Инвестиции", color: "from-blue to-purple", initials: "РД", desc: "Принципы построения системного бизнеса и управления рисками.", tags: ["Стратегия", "Финансы"], sessions: "1.2k" },
  { id: "nt", name: "Нассим Талеб", country: "Ливан · Стратегия", color: "from-orange to-red", initials: "НТ", desc: "Антихрупкость, чёрные лебеди и принятие решений в неопределённости.", tags: ["Риски", "Мышление"], sessions: "890" },
  { id: "ng", name: "Навал Равикант", country: "США · Технологии", color: "from-purple to-blue", initials: "НР", desc: "Богатство, счастье и философия современного предпринимательства.", tags: ["Личный бренд", "Продукт"], sessions: "2.1k" },
  { id: "ak", name: "Алишер Усманов", country: "Узбекистан · Индустрия", color: "from-red to-orange", initials: "АУ", desc: "Опыт построения международных холдингов и работы с государством.", tags: ["Масштаб", "GR"], sessions: "640", locked: true },
  { id: "sj", name: "Стив Джобс", country: "США · Продукт", color: "from-white/60 to-white/20", initials: "СД", desc: "Продуктовое мышление, фокус и создание революционных категорий.", tags: ["Продукт", "Бренд"], sessions: "3.4k", locked: true },
  { id: "ms", name: "Масаёси Сон", country: "Япония · Венчур", color: "from-green to-blue", initials: "МС", desc: "Долгосрочное видение, технологические ставки и капитал.", tags: ["Инвестиции", "Рост"], sessions: "520", locked: true },
];

const FILTERS = ["Все", "Узбекистан", "Глобальные", "Бизнес", "Инвестиции", "Технологии", "Стратегия"];

function MentorsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="mb-6">
        <h1 className="font-display text-3xl lg:text-4xl">Выбери ментора</h1>
        <p className="text-text-secondary text-sm mt-1">12 AI-менторов · Эксперты мирового уровня</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
        <input
          placeholder="Поиск по имени или экспертизе..."
          className="w-full bg-bg-surface2 border border-border-default rounded-md py-3 pl-10 pr-4 text-sm placeholder:text-text-tertiary focus:border-red focus:outline-none focus:ring-2 focus:ring-red-dim transition"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
              i === 0 ? "bg-red text-white border-red shadow-red-glow" : "border-border-default text-text-secondary hover:text-text-primary hover:border-border-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MENTORS.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
            className="group relative rounded-lg border border-border-default bg-bg-surface overflow-hidden transition hover:-translate-y-1 hover:border-border-accent shadow-card"
          >
            <div className={`h-0.5 bg-gradient-to-r ${m.color}`} />
            <div className="p-6">
              <div className={`size-20 rounded-full bg-gradient-to-br ${m.color} grid place-items-center font-display text-2xl text-white mb-4`}>
                {m.initials}
              </div>
              <h3 className="font-display text-xl leading-tight">{m.name}</h3>
              <div className="text-[11px] uppercase tracking-wider text-red mt-0.5">{m.country}</div>
              <p className="text-sm text-text-secondary mt-3 line-clamp-2">{m.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {m.tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
              <button
                disabled={m.locked}
                className="mt-5 w-full bg-red hover:bg-red-hover disabled:bg-bg-surface2 disabled:text-text-tertiary text-white font-semibold text-sm py-2.5 rounded-md transition shadow-red-glow disabled:shadow-none"
              >
                {m.locked ? "Доступно в Pro" : "Начать сессию →"}
              </button>
              <div className="mt-4 pt-4 border-t border-border-default flex items-center gap-1.5 text-xs text-text-secondary">
                <Flame className="size-3.5 text-orange" /> {m.sessions} сессий
              </div>
            </div>
            {m.locked && (
              <div className="absolute inset-0 backdrop-blur-[3px] bg-bg-base/40 grid place-items-center pointer-events-none">
                <div className="size-12 rounded-full bg-bg-surface/90 border border-border-default grid place-items-center">
                  <Lock className="size-5 text-gold" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
