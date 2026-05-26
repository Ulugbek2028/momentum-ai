import { createFileRoute } from "@tanstack/react-router";
import { Mic, Send, Lightbulb, ClipboardList } from "lucide-react";
import { Tag } from "@/components/ui-primitives";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100dvh-7rem)] lg:h-[calc(100dvh-5rem)]">
      {/* Mentor sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 rounded-lg bg-bg-surface border border-border-default p-6">
        <div className="size-20 rounded-full bg-gradient-to-br from-blue to-purple grid place-items-center font-display text-2xl text-white">РД</div>
        <h2 className="font-display text-xl mt-3">Рэй Далио</h2>
        <div className="text-[11px] uppercase tracking-wider text-red mt-0.5">США · Инвестиции</div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-text-secondary">
          <span className="size-1.5 rounded-full bg-green animate-pulse" />
          AI Mentor · Активен
        </div>

        <div className="my-5 h-px bg-border-default" />
        <div className="text-xs uppercase tracking-wider text-text-secondary mb-2">Экспертиза</div>
        <div className="flex flex-wrap gap-1.5">
          <Tag>Стратегия</Tag><Tag>Финансы</Tag><Tag>Системы</Tag>
        </div>

        <div className="my-5 h-px bg-border-default" />
        <div className="text-xs uppercase tracking-wider text-text-secondary mb-2">Эта сессия</div>
        <div className="space-y-1.5 text-sm">
          <Row label="XP заработано" value={<span className="font-mono text-gold">+50 ⚡</span>} />
          <Row label="Сообщений" value={<span className="font-mono">12</span>} />
          <Row label="Длительность" value={<span className="font-mono">8 мин</span>} />
        </div>

        <button className="mt-auto bg-red hover:bg-red-hover text-white font-semibold text-sm py-2.5 rounded-md transition shadow-red-glow">
          Завершить и получить Action Plan
        </button>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-lg bg-bg-surface border border-border-default overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <AssistantMsg time="11:32">
            Привет, Алишер. Расскажи, какая ключевая задача стоит перед твоим бизнесом на этой неделе?
          </AssistantMsg>
          <UserMsg time="11:33">
            Думаю запустить новый продукт, но не уверен в timing. Конкуренция растёт.
          </UserMsg>
          <AssistantMsg time="11:34">
            Хороший вопрос. В условиях растущей конкуренции timing критичен, но не главный фактор. Гораздо важнее — твоё <em>принципиальное преимущество</em>. Давай разберём его по слоям.
          </AssistantMsg>

          <InsightCard quote="Принципы — это фундаментальные истины, которые служат основой поведения и позволяют получать желаемое в жизни." />

          <ActionItemCard title="Сформулируй 3 ключевых принципа продукта" desc="Запиши их одним предложением каждый. Это станет фильтром для всех решений." />

          <TypingIndicator />
        </div>

        {/* Input bar */}
        <div className="border-t border-border-default bg-bg-surface/80 backdrop-blur-xl p-4">
          <div className="flex items-end gap-3">
            <button
              aria-label="Голосовой ввод"
              className="size-11 rounded-md bg-bg-surface2 hover:bg-bg-surface3 grid place-items-center text-text-secondary hover:text-red transition shrink-0"
            >
              <Mic className="size-5" />
            </button>
            <textarea
              rows={1}
              placeholder="Задай вопрос Рэю Далио..."
              className="flex-1 resize-none bg-bg-surface2 border border-border-default rounded-md px-4 py-2.5 text-sm placeholder:text-text-tertiary focus:border-red focus:outline-none focus:ring-2 focus:ring-red-dim transition max-h-32"
            />
            <button
              aria-label="Отправить"
              className="size-11 rounded-md bg-red hover:bg-red-hover text-white grid place-items-center transition shadow-red-glow shrink-0"
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary">{label}</span>
      {value}
    </div>
  );
}

function AssistantMsg({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <div className="flex gap-3 max-w-[80%] animate-fade-in">
      <div className="size-9 rounded-full bg-gradient-to-br from-blue to-purple grid place-items-center text-xs font-semibold text-white shrink-0">РД</div>
      <div className="min-w-0">
        <div className="text-[11px] text-text-secondary mb-1">Рэй Далио</div>
        <div className="rounded-tl-sm rounded-2xl rounded-br-2xl rounded-bl-2xl bg-bg-surface2 border border-border-default px-4 py-3 text-sm leading-relaxed">
          {children}
        </div>
        <div className="text-[10px] text-text-tertiary mt-1">{time}</div>
      </div>
    </div>
  );
}

function UserMsg({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <div className="flex justify-end animate-fade-in">
      <div className="max-w-[80%]">
        <div className="rounded-tr-sm rounded-2xl rounded-bl-2xl rounded-br-2xl bg-red-dim border border-border-accent px-4 py-3 text-sm leading-relaxed">
          {children}
        </div>
        <div className="text-[10px] text-text-tertiary mt-1 text-right">{time}</div>
      </div>
    </div>
  );
}

function InsightCard({ quote }: { quote: string }) {
  return (
    <div className="rounded-lg bg-gold-dim border-l-[3px] border-gold p-4 max-w-[80%] animate-fade-in">
      <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-wider font-semibold mb-2">
        <Lightbulb className="size-4" /> Ключевой инсайт
      </div>
      <p className="font-display text-base leading-snug">"{quote}"</p>
    </div>
  );
}

function ActionItemCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg bg-bg-surface2 border-l-[3px] border-red p-4 max-w-[80%] animate-fade-in">
      <div className="flex items-center gap-2 text-red text-xs uppercase tracking-wider font-semibold mb-2">
        <ClipboardList className="size-4" /> Рекомендуемое действие
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-text-secondary mt-1">{desc}</div>
      <button className="mt-3 text-xs font-semibold text-red hover:text-red-hover">+ Добавить в план</button>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[80%] animate-fade-in">
      <div className="size-9 rounded-full bg-gradient-to-br from-blue to-purple grid place-items-center text-xs font-semibold text-white shrink-0">РД</div>
      <div className="rounded-2xl bg-bg-surface2 border border-border-default px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 180}ms` }}
            className="size-1.5 rounded-full bg-text-secondary animate-pulse"
          />
        ))}
        <span className="text-[11px] text-text-tertiary ml-1">печатает...</span>
      </div>
    </div>
  );
}
