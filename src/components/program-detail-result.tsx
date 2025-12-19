import { useMemo, useState } from "react";
import { Gift, Clock4, Hash } from "lucide-react";
import { TResultLuckyNumberItem } from "@/redux/api/campaign/campaign.response";

const formatDT = (v: string) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString("vi-VN");
};

const StatusPill = ({ win }: { win: boolean }) => (
  <span
    className={[
      "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ring-1",
      win
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-amber-50 text-amber-700 ring-amber-200",
    ].join(" ")}
  >
    {win ? (
      <>
        <Gift className="h-3.5 w-3.5" />
        Trúng thưởng
      </>
    ) : (
      "Đang chờ"
    )}
  </span>
);

const isWin = (r: TResultLuckyNumberItem) =>
  Boolean(r.gift_name || r.gift_image || r.award_name);
const CardKQ = ({ r }: { r: TResultLuckyNumberItem }) => {
  const win = isWin(r);
  const title = r.award_name || r.gift_name || "Giải thưởng";
  const img = r.gift_image;

  if (!win) {
    // Giữ nguyên layout cũ cho thẻ không trúng thưởng
    return (
      <li
        className="group relative overflow-hidden rounded-2xl p-4 bg-neutral-50/80 ring-1 ring-neutral-200"
        aria-label={`Số ${r.number} • Đang chờ`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock4 className="h-3.5 w-3.5" />
              {formatDT(r.time)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-neutral-900">
              <span className="inline-flex items-center gap-1">Số may mắn</span>
              <span className="rounded-md bg-neutral-900/5 px-2 py-0.5 text-neutral-900">
                {r.number}
              </span>
            </div>
          </div>
          <StatusPill win={false} />
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white/60 p-4 text-center">
          <div className="text-sm text-neutral-600">Đang chờ kết quả</div>
        </div>
      </li>
    );
  }

  // Layout trúng thưởng = ticket horizontal style
  return (
    <div className="overflow-hidden p-[1px]">
      <li className="bg-white ring-1 ring-amber-300/90 py-4 px-2 rounded-xl relative z-30">
        <div className="w-4 h-4 rounded-full ring-1 ring-amber-300/90 absolute top-[-8px] translate-x-[90px] bg-gray-50 z-50" />
        <div className="w-4 h-4 rounded-full ring-1 ring-amber-300/90 absolute bottom-[-8px] translate-x-[90px] bg-gray-50 z-50" />
        <div className="flex items-center gap-3">
          {/* Số may mắn */}
          <div className="w-[90px] shrink-0 text-center">
            <div className="text-[10px] leading-none text-neutral-500 mb-1">
              Số may mắn
            </div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center">
              <span className="text-4xl font-extrabold text-neutral-900 leading-none">
                {r.number}
              </span>
            </div>
          </div>

          {/* Giải thưởng */}
          <div className="min-w-0 space-y-1 flex-1">
            <div className="text-sm text-center font-bold text-neutral-900 leading-tight line-clamp-1">
              {title}
            </div>
            <div className="text-sm text-center text-neutral-700 leading-tight line-clamp-2">
              {r.gift_name || "Quà tặng"}
            </div>
          </div>

          {/* Hình quà */}
          <div className="w-20 shrink-0">
            <div className="h-12 w-20 overflow-hidden bg-white flex items-center justify-center">
              {img ? (
                <img
                  src={img}
                  alt={title}
                  className="h-full w-full object-fill"
                  loading="lazy"
                />
              ) : (
                <span className="text-[14px] font-bold text-white bg-[#5B8BD9] h-full w-full flex items-center justify-center">
                  {(r.gift_name?.[0] || "H").toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </li>
    </div>
  );
};
function usePageNumbers(page: number, maxPage: number, span = 1) {
  const pages = new Set<number>([1, maxPage, page]);
  for (let i = 1; i <= span; i++) {
    pages.add(page - i);
    pages.add(page + i);
  }
  return [...pages].filter((p) => p >= 1 && p <= maxPage).sort((a, b) => a - b);
}

export function ResultsGrid({
  items,
  pageSize = 6,
}: {
  items: TResultLuckyNumberItem[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    return [...(items || [])].sort((a, b) => {
      const aw = isWin(a) ? 1 : 0;
      const bw = isWin(b) ? 1 : 0;
      if (bw !== aw) return bw - aw; // trúng lên trước
      const at = new Date(a.time).getTime() || 0;
      const bt = new Date(b.time).getTime() || 0;
      if (bt !== at) return bt - at; // mới trước
      return +b.number - +a.number; // số lớn trước (tùy ý)
    });
  }, [items]);

  const total = sorted.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const arranged = useMemo(() => {
    const w: TResultLuckyNumberItem[] = [];
    const l: TResultLuckyNumberItem[] = [];
    (items ?? []).forEach((it) => (isWin(it) ? w.push(it) : l.push(it)));
    return [...w, ...l]; // winners (giữ thứ tự gốc) + losers (giữ thứ tự gốc)
  }, [items]);

  const { slice, pageItems } = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      slice: [start, end] as const,
      pageItems: arranged.slice(start, end),
    };
  }, [arranged, page, pageSize]);

  const nums = usePageNumbers(page, maxPage, 1);

  if (!total) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-white/70 px-6 py-10 text-center text-neutral-700">
        <div className="text-base font-semibold">Chưa có kết quả</div>
        <div className="mt-1 text-sm text-neutral-500">
          Vui lòng bấm “Quay 1 giải” hoặc “Quay tất cả”.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <p className="font-semibold text-black mb-2">Kết quả trúng thưởng</p>
      <ul className="space-y-3">
        {pageItems.map((r, idx) => (
          <CardKQ key={`${r.number}-${r.time}-${slice[0] + idx}`} r={r} />
        ))}
      </ul>

      <nav
        className="mx-auto mt-4 flex max-w-full flex-wrap items-center justify-center gap-2"
        aria-label="Phân trang kết quả"
      >
        <button
          className="rounded-full border px-3 py-1 text-sm font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
          disabled={page <= 1}
          onClick={() => setPage(1)}
        >
          Đầu
        </button>
        <button
          className="rounded-full border px-3 py-1 text-sm font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Trước
        </button>

        {nums.map((n, i) => {
          const prev = nums[i - 1];
          const showDots = i > 0 && n - (prev ?? n) > 1;
          return (
            <span key={n} className="inline-flex">
              {showDots && (
                <span className="px-1 text-sm text-neutral-500">…</span>
              )}
              <button
                onClick={() => setPage(n)}
                className={[
                  "rounded-full px-3 py-1 text-sm font-medium",
                  n === page
                    ? "bg-[#009345] text-white"
                    : "border text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </button>
            </span>
          );
        })}

        <button
          className="rounded-full border px-3 py-1 text-sm font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
          disabled={page >= maxPage}
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
        >
          Sau
        </button>
        <button
          className="rounded-full border px-3 py-1 text-sm font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
          disabled={page >= maxPage}
          onClick={() => setPage(maxPage)}
        >
          Cuối
        </button>

        <span className="ml-2 text-sm text-neutral-500">
          Trang {page}/{maxPage} • {total} mục
        </span>
      </nav>
    </div>
  );
}
