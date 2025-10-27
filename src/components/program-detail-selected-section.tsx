import { useMemo } from "react";
import { SelectedNumberList } from "./program-detail-selected-list";

export default function LuckyNumbersSection({
  programDetail,
  results,
}: {
  programDetail?: { number_get?: number; number_limit?: number };
  results?: { number: string | number; award_name?: string | null }[];
}) {
  const get = programDetail?.number_get ?? 0;
  const limit = programDetail?.number_limit ?? 0;
  const pct = useMemo(
    () => (limit ? Math.round((get / limit) * 100) : 0),
    [get, limit]
  );
  const remain = Math.max(0, limit - get);

  return (
    <div className="mt-2 space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Số may mắn</p>
            <p className="text-lg font-semibold">
              {get}
              <span className="mx-1 text-neutral-400">/</span>
              {limit}{" "}
              <span className="text-sm font-normal text-neutral-500">
                đã chọn
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-medium text-emerald-600 ring-1 ring-emerald-200">
              {pct}% hoàn thành
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[8px] font-medium text-amber-700 ring-1 ring-amber-200">
              Còn {remain}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs text-neutral-500">
            <span>0%</span>
            <span>{pct}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-medium">Danh sách số đã chọn</p>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Trúng
              thưởng
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-neutral-300" /> Bình
              thường
            </span>
          </div>
        </div>

        <SelectedNumberList
          numbers={(results ?? []).map((item) => ({
            isWin: !!item?.award_name,
            number: +item.number,
          }))}
          pageSize={30}
        />
      </div>
    </div>
  );
}
