import { useMemo } from "react";

export type Tab = { key: string; label: string };

export default function SegmentedTabs({
  value,
  onChange,
  className = "",
  tabs,
}: {
  value: string;
  onChange: (k: string) => void;
  className?: string;
  tabs: Tab[];
}) {
  const idx = useMemo(
    () =>
      Math.max(
        0,
        tabs.findIndex((t) => t.key === value)
      ),
    [value]
  );
  const pct = 100 / tabs.length;

  return (
    <div className={`relative pt-1 ${className}`}>
      <div className={`grid grid-cols-${tabs.length}`}>
        {tabs.map((t, i) => {
          const active = i === idx;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`h-10 text-sm ${
                active ? "text-[#009345] font-semibold" : "text-neutral-500"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="relative h-[2px] bg-neutral-200">
        <div
          className="absolute top-0 h-[2px] bg-[#009345] transition-[left,width] duration-300"
          style={{ left: `${idx * pct}%`, width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
