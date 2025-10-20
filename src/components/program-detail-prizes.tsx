import { useMemo, useState } from "react";
import { Box, Text, Avatar, Button } from "zmp-ui";

type Prize = {
  id: string | number;
  label: string;
  rewardName: string;
  image?: string;
  count: number;
};

function usePageNumbers(page: number, maxPage: number, span = 1) {
  const pages = new Set<number>([1, maxPage, page]);
  for (let i = 1; i <= span; i++) {
    pages.add(page - i);
    pages.add(page + i);
  }
  return [...pages].filter((p) => p >= 1 && p <= maxPage).sort((a, b) => a - b);
}

export function PrizesList({
  prizes,
  pageSize = 6,
}: {
  prizes: Prize[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);

  const total = prizes?.length ?? 0;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pageItems = useMemo(
    () => prizes.slice(start, end),
    [prizes, start, end]
  );
  const nums = usePageNumbers(page, maxPage, 1);

  if (!total) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 backdrop-blur px-6 py-10 text-center text-neutral-600">
        <Text className="font-semibold">Chưa cấu hình giải thưởng</Text>
        <Text className="mt-1 text-sm">Thêm giải để bắt đầu chương trình.</Text>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((p) => (
          <div
            key={p.id}
            className="rounded-xl p-[1.5px] bg-gradient-to-br from-emerald-300/50 via-amber-200/50 to-white/60"
          >
            <div className="rounded-xl h-36 bg-white/80 backdrop-blur-md shadow-md ring-1 ring-white/60 overflow-hidden">
              <div className="flex">
                <div className="relative">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.rewardName}
                      className="h-36 w-44 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-36 w-44 bg-neutral-100" />
                  )}
                  <div className="absolute left-[-16px] top-0 pl-3">
                    <span className="inline-block rounded-br-xl bg-emerald-600 text-white px-3 py-1 text-xs font-semibold shadow">
                      {p.label}
                    </span>
                  </div>
                </div>

                <div className="p-4 min-w-0">
                  <div className="text-[11px] text-neutral-500">Mã: {p.id}</div>
                  <div className="mt-1">
                    <Text className="text-xs text-neutral-500">
                      Tên giải thưởng
                    </Text>
                    <Text className="text-base font-semibold truncate">
                      {p.rewardName}
                    </Text>
                  </div>
                  <div className="mt-2">
                    <Text className="text-xs text-neutral-500">Số lượng</Text>
                    <Text className="text-base font-semibold">{p.count}</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {maxPage > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
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
            const dots = i > 0 && n - (prev ?? n) > 1;
            return (
              <span key={n} className="inline-flex">
                {dots && (
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
            Trang {page}/{maxPage} • {total} giải
          </span>
        </div>
      )}
    </>
  );
}
