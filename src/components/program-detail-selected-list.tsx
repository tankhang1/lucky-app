import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Text } from "zmp-ui";

type SelectedItem = {
  number: number;
  isWin: boolean;
};

function usePageNumbers(page: number, maxPage: number, span = 1) {
  const pages = new Set<number>([1, maxPage, page]);
  for (let i = 1; i <= span; i++) {
    pages.add(page - i);
    pages.add(page + i);
  }
  return [...pages].filter((p) => p >= 1 && p <= maxPage).sort((a, b) => a - b);
}

export function SelectedNumberList({
  numbers,
  pageSize = 12,
}: {
  numbers: SelectedItem[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);

  const total = numbers.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pageItems = useMemo(
    () => numbers.slice(start, end),
    [numbers, start, end]
  );
  const nums = usePageNumbers(page, maxPage, 1);

  if (!total) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 backdrop-blur px-6 py-10 text-center text-neutral-600">
        <Text className="font-semibold">Chưa chọn số</Text>
        <Text className="mt-1 text-sm">Vui lòng chọn số may mắn</Text>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-2 justify-items-center">
        {pageItems.map((num, index) => (
          <div
            key={index}
            className={`relative flex items-center justify-center h-12 w-12 rounded-full text-base font-semibold border shadow-sm transition-all duration-200 ${
              num.isWin
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <span className="flex items-center justify-center leading-none">
              {num.number}
            </span>

            {num.isWin && (
              <span className="absolute -top-1.5 -right-1.5">
                <Star size={12} color="orange" />
              </span>
            )}
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
            Trang {page}/{maxPage} • {numbers.length} số
          </span>
        </div>
      )}
    </>
  );
}
