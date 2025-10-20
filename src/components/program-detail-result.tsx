import { useMemo, useState } from "react";
import { TResultLuckyNumberItem } from "@/redux/api/campaign/campaign.response";

const formatDT = (v: string) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString("vi-VN");
};

const CardKQ = ({ r }: { r: TResultLuckyNumberItem }) => {
  const isWin = !!(r.gift_name || r.gift_image);
  return (
    <li
      className={[
        "group rounded-2xl p-4 shadow-sm ring-1 backdrop-blur transition",
        isWin
          ? "bg-white/90 ring-black/5 hover:shadow-md"
          : "bg-neutral-50/80 ring-neutral-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs text-neutral-500">{formatDT(r.time)}</div>
          <div className="mt-1 text-sm font-semibold tracking-wide text-neutral-900">
            Số may mắn #{r.number}
          </div>
        </div>
        <span
          className={[
            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
            isWin
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              : "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
          ].join(" ")}
        >
          {isWin ? "Trúng thưởng" : "Đang chờ"}
        </span>
      </div>

      {isWin ? (
        <>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
              <img
                src={r.gift_image}
                alt={r.gift_name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-neutral-900">
                {r.gift_name}
              </div>
              <div className="mt-0.5 text-xs text-neutral-500">
                Trao thưởng: {formatDT(r.award_time)}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
              <div className="text-2xs uppercase tracking-wide text-neutral-500">
                Mã giải
              </div>
              <div className="mt-0.5 font-semibold text-neutral-900">
                {r.award_number}
              </div>
            </div>
            <div className="rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
              <div className="text-2xs uppercase tracking-wide text-neutral-500">
                Số trúng
              </div>
              <div className="mt-0.5 font-semibold text-neutral-900">
                {r.number}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white/60 p-4 text-center">
          <div className="text-sm text-neutral-600">Đang chờ kết quả</div>
        </div>
      )}
    </li>
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
  pageSize = 4,
}: {
  items: TResultLuckyNumberItem[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const total = items?.length ?? 0;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const { slice, pageItems } = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      slice: [start, end] as const,
      pageItems: items?.slice(start, end) ?? [],
    };
  }, [items, page, pageSize]);
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
    <div className="mt-5 space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((r, idx) => (
          <CardKQ key={`${r.number}-${r.time}-${slice[0] + idx}`} r={r} />
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          className="rounded-full border px-3 py-1 text-xs font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
          disabled={page <= 1}
          onClick={() => setPage(1)}
        >
          Đầu
        </button>
        <button
          className="rounded-full border px-3 py-1 text-xs font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
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
                <span className="px-1 text-xs text-neutral-500">…</span>
              )}
              <button
                onClick={() => setPage(n)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium",
                  n === page
                    ? "bg-neutral-900 text-white"
                    : "border text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
              >
                {n}
              </button>
            </span>
          );
        })}

        <button
          className="rounded-full border px-3 py-1 text-xs font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
          disabled={page >= maxPage}
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
        >
          Sau
        </button>
        <button
          className="rounded-full border px-3 py-1 text-xs font-medium text-neutral-700 disabled:opacity-40 hover:bg-neutral-50"
          disabled={page >= maxPage}
          onClick={() => setPage(maxPage)}
        >
          Cuối
        </button>

        <span className="ml-2 text-xs text-neutral-500">
          Trang {page}/{maxPage} • {total} mục
        </span>
      </div>
    </div>
  );
}
