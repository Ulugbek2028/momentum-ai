import { motion } from "framer-motion";

export function XPBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="relative h-2 w-full rounded-full bg-bg-surface3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-red to-orange relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-shimmer animate-[shimmer_2s_linear_infinite]" />
      </motion.div>
    </div>
  );
}

export function Tag({
  children,
  variant = "common",
}: {
  children: React.ReactNode;
  variant?: "common" | "rare" | "epic" | "legendary" | "success" | "danger";
}) {
  const styles = {
    common: "bg-white/5 text-text-secondary",
    rare: "bg-blue/15 text-blue",
    epic: "bg-purple/15 text-purple",
    legendary: "bg-gold-dim text-gold",
    success: "bg-green-dim text-green",
    danger: "bg-red-dim text-red",
  }[variant];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${styles}`}>
      {children}
    </span>
  );
}

export function Card({
  children,
  accent,
  className = "",
}: {
  children: React.ReactNode;
  accent?: "red" | "gold" | "green";
  className?: string;
}) {
  const accentMap = {
    red: "border-border-accent bg-red-dim",
    gold: "border-gold/30 bg-gold-dim",
    green: "border-green/30 bg-green-dim",
  };
  const base = "rounded-lg border border-border-default bg-bg-surface p-6 transition-all hover:border-border-accent";
  const accentCls = accent ? accentMap[accent] : "";
  return <div className={`${base} ${accentCls} ${className}`}>{children}</div>;
}

export function LevelRing({ level, pct }: { level: number; pct: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-20">
      <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="var(--bg-surface3)" strokeWidth="6" fill="none" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          stroke="var(--red)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px rgba(232,25,44,0.6))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-[9px] text-text-secondary uppercase tracking-wider">Ур.</div>
          <div className="font-display text-2xl leading-none">{level}</div>
        </div>
      </div>
    </div>
  );
}
