import { createFileRoute } from "@tanstack/react-router";
import { Mic, Send, Lightbulb, ClipboardList, Check } from "lucide-react";
import { Tag } from "@/components/ui-primitives";
import { useApp } from "@/lib/store";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

interface Message {
  id: number;
  type: "user" | "assistant" | "insight" | "action";
  content: string;
  time: string;
  quote?: string;
  actionTitle?: string;
  actionDesc?: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, type: "assistant", content: "Привет, Алишер. Расскажи, какая ключевая задача стоит перед твоим бизнесом на этой неделе?", time: "11:32" },
  { id: 2, type: "user", content: "Думаю запустить новый продукт, но не уверен в timing. Конкуренция растёт.", time: "11:33" },
  { id: 3, type: "assistant", content: "Хороший вопрос. В условиях растущей конкуренции timing критичен, но не главный фактор. Гораздо важнее — твоё принципиальное преимущество. Давай разберём его по слоям.", time: "11:34" },
  { id: 4, type: "insight", content: "", time: "11:34", quote: "Принципы — это фундаментальные истины, которые служат основой поведения и позволяют получать желаемое в жизни." },
  { id: 5, type: "action", content: "", time: "11:35", actionTitle: "Сформулируй 3 ключевых принципа продукта", actionDesc: "Запиши их одним предложением каждый. Это станет фильтром для всех решений." },
];

const AI_RESPONSES = [
  "Отличная точка зрения. Давай глубже проанализируем ситуацию. Что является вашим главным конкурентным преимуществом на рынке прямо сейчас?",
  "Это важный вопрос. В принципах системного мышления есть одно правило: сначала понять систему, потом менять её части. Какие метрики вы отслеживаете?",
  "Я вижу паттерн в том, что вы описываете. Это классическая дилемма pioneer vs follower. Ваша аудитория — она уже сформирована или вы создаёте рынок?",
  "Честно? Timing — это миф для хорошего продукта. Правильный продукт с правильной командой найдёт свой момент. Что вас останавливает сильнее всего?",
  "По принципу антихрупкости: стресс должен делать вас сильнее, а не ломать. Как ваш бизнес реагирует на турбулентность?",
];

let aiIdx = 0;

function now() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function ChatPage() {
  const { user, addXP } = useApp();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [xpEarned, setXpEarned] = useState(50);
  const [msgCount, setMsgCount] = useState(12);
  const [duration, setDuration] = useState(8);
  const [addedToplan, setAddedToPlan] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: Date.now(),
      type: "user",
      content: text,
      time: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setMsgCount((c) => c + 1);
    setIsTyping(true);

    const delay = 1200 + Math.random() * 1000;
    setTimeout(() => {
      const response = AI_RESPONSES[aiIdx % AI_RESPONSES.length];
      aiIdx++;
      const xp = 10 + Math.floor(Math.random() * 15);
      addXP(xp);
      setXpEarned((x) => x + xp);
      setDuration((d) => d + 1);

      const aiMsg: Message = {
        id: Date.now() + 1,
        type: "assistant",
        content: response,
        time: now(),
      };
      setMessages((m) => [...m, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFinish = () => {
    const finalXP = 50 + xpEarned;
    addXP(finalXP);
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        type: "action",
        content: "",
        time: now(),
        actionTitle: `Сессия завершена! +${finalXP} XP`,
        actionDesc: "Action Plan сохранён в ваш профиль. Выполните задания из плана для дополнительного опыта.",
      },
    ]);
  };

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
          <Row label="XP заработано" value={<span className="font-mono text-gold">+{xpEarned} ⚡</span>} />
          <Row label="Сообщений" value={<span className="font-mono">{msgCount}</span>} />
          <Row label="Длительность" value={<span className="font-mono">{duration} мин</span>} />
        </div>

        <button
          onClick={handleFinish}
          className="mt-auto bg-red hover:bg-red-hover text-white font-semibold text-sm py-2.5 rounded-md transition shadow-red-glow"
        >
          Завершить и получить Action Plan
        </button>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-lg bg-bg-surface border border-border-default overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg) => {
            if (msg.type === "user") return <UserMsg key={msg.id} time={msg.time}>{msg.content}</UserMsg>;
            if (msg.type === "assistant") return <AssistantMsg key={msg.id} time={msg.time}>{msg.content}</AssistantMsg>;
            if (msg.type === "insight") return <InsightCard key={msg.id} quote={msg.quote!} />;
            if (msg.type === "action") return (
              <ActionItemCard
                key={msg.id}
                title={msg.actionTitle!}
                desc={msg.actionDesc!}
                added={addedToplan}
                onAdd={() => setAddedToPlan(true)}
              />
            );
            return null;
          })}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
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
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Задай вопрос Рэю Далио..."
              className="flex-1 resize-none bg-bg-surface2 border border-border-default rounded-md px-4 py-2.5 text-sm placeholder:text-text-tertiary focus:border-red focus:outline-none focus:ring-2 focus:ring-red-dim transition max-h-32"
            />
            <button
              aria-label="Отправить"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="size-11 rounded-md bg-red hover:bg-red-hover disabled:opacity-40 text-white grid place-items-center transition shadow-red-glow shrink-0"
            >
              <Send className="size-5" />
            </button>
          </div>
          <div className="text-[11px] text-text-tertiary mt-2 text-center">Enter — отправить · Shift+Enter — новая строка</div>
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

function ActionItemCard({ title, desc, added, onAdd }: { title: string; desc: string; added: boolean; onAdd: () => void }) {
  return (
    <div className="rounded-lg bg-bg-surface2 border-l-[3px] border-red p-4 max-w-[80%] animate-fade-in">
      <div className="flex items-center gap-2 text-red text-xs uppercase tracking-wider font-semibold mb-2">
        <ClipboardList className="size-4" /> Рекомендуемое действие
      </div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-text-secondary mt-1">{desc}</div>
      <button
        onClick={onAdd}
        className={`mt-3 text-xs font-semibold flex items-center gap-1 transition ${added ? "text-green cursor-default" : "text-red hover:text-red-hover"}`}
      >
        {added ? <><Check className="size-3" /> Добавлено в план</> : "+ Добавить в план"}
      </button>
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
