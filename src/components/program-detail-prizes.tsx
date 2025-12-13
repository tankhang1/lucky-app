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
      <div className="grid gap-4 grid-cols-2">
        {pageItems.map((p) => (
          <div key={p.id} className="rounded-xl bg-white overflow-hidden">
            {/* Ảnh giải thưởng */}
            <div className="relative w-44 h-36 border-b-[0.25px]">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.rewardName}
                  className="h-36 w-44 object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-neutral-100" />
              )}
              <div className="absolute left-[-16px] top-0 pl-3">
                <span className="inline-block rounded-br-xl bg-emerald-600 text-white px-3 py-1 text-xs font-semibold shadow">
                  {p.label}
                </span>
              </div>
            </div>

            {/* Nội dung */}
            <div className="flex flex-col justify-center px-4 min-w-0 flex-1 py-4">
              <div>
                <Text className="text-base text-center font-semibold truncate">
                  {p.rewardName}
                </Text>
              </div>

              {/* Hiển thị tùy chọn số lượng */}
              {p.count !== undefined && (
                <div className="mt-2 flex items-center justify-center gap-3">
                  <Text className="text-xs text-neutral-500">Số lượng:</Text>
                  <Text className="text-base font-semibold">{p.count}</Text>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {maxPage > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
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
            const dots = i > 0 && n - (prev ?? n) > 1;
            return (
              <span key={n} className="inline-flex">
                {dots && (
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
            Trang {page}/{maxPage} • {total} giải
          </span>
        </div>
      )}
    </>
  );
}
