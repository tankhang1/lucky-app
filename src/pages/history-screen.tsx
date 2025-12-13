// pages/HistoryLuckyResultPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useGetListCampaignHistoryQuery,
  useSearchHistoryCampaignQuery,
} from "@/redux/api/campaign/campaign.api";
import { Page, Box, Text, Input, Icon, Avatar, Button, Header } from "zmp-ui";

export type TGetListCampaignHistoryItem = {
  number: number;
  time: string;
  name: string;
  award_name: string;
  award_time: string;
  gift_image: string;
  gift_name: string;
};
export type TGetListCampaignHistoryRes = TGetListCampaignHistoryItem[];

export type TSearchCampaignItem = {
  id: number;
  uuid: string;
  code: string; // dùng code để gọi API lịch sử
  name: string;
  time_create: string;
  time_create_number: number;
  time_start: string;
  time_start_number: number;
  time_end: string;
  time_end_number: number;
  time_deactive: string;
  time_deactive_number: number;
};

const TABS = [
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
  { key: "all", label: "Tất cả" },
] as const;
type TimeFilter = (typeof TABS)[number]["key"];

const fmtDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("vi-VN");
};
const startOfDay = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfWeek = (d = new Date()) => {
  const day = d.getDay() || 7;
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - (day - 1));
  return s;
};
const startOfMonth = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth(), 1);

function usePageNumbers(page: number, maxPage: number, span = 1) {
  const pages = new Set<number>([1, maxPage, page]);
  for (let i = 1; i <= span; i++) {
    pages.add(page - i);
    pages.add(page + i);
  }
  return [...pages].filter((p) => p >= 1 && p <= maxPage).sort((a, b) => a - b);
}

const CardItem = ({ r }: { r: TGetListCampaignHistoryItem }) => {
  const isWin = Boolean(r.gift_name || r.gift_image || r.award_name);
  return (
    <li
      className={[
        "group rounded-2xl p-3 sm:p-4 ring-1 backdrop-blur transition",
        isWin
          ? "bg-white/90 ring-black/5"
          : "bg-neutral-50/80 ring-neutral-200",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-neutral-500">{fmtDate(r.time)}</div>
          <div className="mt-0.5 text-sm font-semibold text-neutral-900 truncate">
            {r.name}
          </div>
          <div className="text-xs text-neutral-600 truncate">
            Số may mắn: #{r.number}
          </div>
        </div>
        <span
          className={[
            "shrink-0 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
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
          <div className="mt-3 flex items-center gap-3">
            {r.gift_image ? (
              <img src={r.gift_image} className="w-20 object-cover" />
            ) : (
              <Box className="h-11 w-11 rounded-xl bg-amber-100 grid place-items-center ring-2 ring-amber-200">
                <Icon icon="zi-file" className="text-amber-700" />
              </Box>
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-neutral-900">
                {r.gift_name || r.award_name || "Giải thưởng"}
              </div>
              <div className="mt-0.5 text-xs text-neutral-500">
                Trao thưởng: {fmtDate(r.award_time)}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
              <div className="text-2xs uppercase tracking-wide text-neutral-500">
                Giải thưởng
              </div>
              <div className="mt-0.5 font-semibold text-neutral-900 truncate">
                {r.award_name || "—"}
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
        <div className="mt-3 rounded-xl border border-dashed border-neutral-300 bg-white/60 p-3 text-center">
          <div className="text-sm text-neutral-600">Đang chờ kết quả</div>
        </div>
      )}
    </li>
  );
};

const HistoryLuckyResultPage = () => {
  const { p } = useSelector((state: RootState) => state.app);

  const [q, setQ] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [tab, setTab] = useState<TimeFilter>("all");

  // code chương trình đang chọn (KHÔNG có "all")
  const [programCode, setProgramCode] = useState<string | undefined>(undefined);

  // danh sách chương trình để user chọn
  const { data: searchCampaigns } = useSearchHistoryCampaignQuery(
    { k: "" },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  // chuẩn hóa options duy nhất theo code
  const programOptions = useMemo(() => {
    const seen = new Set<string>();
    const arr =
      (searchCampaigns as TSearchCampaignItem[] | undefined)?.filter((c) => {
        if (!c?.code) return false;
        if (seen.has(c.code)) return false;
        seen.add(c.code);
        return true;
      }) ?? [];
    return arr.map((c) => ({ code: c.code, name: c.name }));
  }, [searchCampaigns]);

  // nếu chưa có code được chọn → auto chọn chương trình đầu tiên
  useEffect(() => {
    if (!programCode && programOptions.length) {
      setProgramCode(programOptions[0].code);
    }
  }, [programOptions, programCode]);

  // gọi API lịch sử theo code chương trình đã chọn
  const { data: listGiftHistory, isLoading: isLoadingListGiftHistory } =
    useGetListCampaignHistoryQuery(
      { c: programCode ?? "", p },
      {
        skip: !p || !programCode,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );

  // lọc + sắp xếp + phân trang (toàn danh sách)
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const now = new Date();
    const boundary =
      timeFilter === "today"
        ? startOfDay(now)
        : timeFilter === "week"
        ? startOfWeek(now)
        : timeFilter === "month"
        ? startOfMonth(now)
        : null;

    return (
      (listGiftHistory ?? [])
        .filter((r) => {
          if (!s) return true;
          const hay =
            `${r.name} ${r.award_name} ${r.gift_name} ${r.number}`.toLowerCase();
          return hay.includes(s);
        })
        // KHÔNG lọc theo chương trình ở client nữa – API đã lọc theo "c"
        .filter((r) => (boundary ? new Date(r.time) >= boundary : true))
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    );
  }, [listGiftHistory, q, timeFilter]);

  useEffect(() => {
    setPage(1);
  }, [q, timeFilter, programCode]);

  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);
  const nums = usePageNumbers(page, maxPage, 1);

  return (
    <Page className="min-h-screen bg-neutral-50">
      <Header
        title="Lịch sử trúng thưởng"
        className="relative"
        showBackIcon={false}
      />
      <div className="px-5 pb-4 pt-5">
        <div className="rounded-2xl bg-white border border-neutral-200">
          <Input
            placeholder="Tìm kiếm (tên CT/giải/số trúng)…"
            value={q}
            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
            prefix={
              <Box className="pl-4">
                <Icon icon="zi-search" className="text-neutral-400" />
              </Box>
            }
            className="!bg-white !border-0 !rounded-2xl h-9"
          />
        </div>

        {/* Tabs mốc thời gian */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setTimeFilter(t.key as TimeFilter);
                }}
                className={`h-10 rounded-full px-4 text-sm whitespace-nowrap transition ${
                  active
                    ? "bg-[#009345] text-white"
                    : "bg-white border border-neutral-200 text-neutral-700"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Dải chọn CHƯƠNG TRÌNH – KHÔNG có 'Tất cả' */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {programOptions.length === 0 ? (
            <span className="text-xs text-neutral-500">
              Chưa có chương trình khả dụng
            </span>
          ) : (
            programOptions.map((opt) => {
              const active = programCode === opt.code;
              return (
                <button
                  key={opt.code}
                  onClick={() => setProgramCode(opt.code)}
                  className={`h-9 rounded-full px-3 text-xs whitespace-nowrap transition ${
                    active
                      ? "bg-[#E2672E] text-white"
                      : "bg-white border border-neutral-200 text-neutral-700"
                  }`}
                  title={opt.name}
                >
                  {opt.name}
                </button>
              );
            })
          )}

          {/* Xóa lọc chỉ reset keyword + time, KHÔNG đổi chương trình */}
          {(Boolean(q) || timeFilter !== "all") && (
            <Button
              size="small"
              className="ml-1 !h-9 !px-3 !text-xs !bg-neutral-100 !text-neutral-700 hover:!bg-neutral-200"
              onClick={() => {
                setQ("");
                setTimeFilter("all");
                setTab("all");
              }}
            >
              Xóa lọc
            </Button>
          )}
        </div>
      </div>

      <Box className="p-4 space-y-6">
        {(!programCode && programOptions.length > 0) ||
        isLoadingListGiftHistory ? (
          <Box className="grid place-items-center py-16 text-neutral-500">
            <Text className="text-sm">Đang tải…</Text>
          </Box>
        ) : !programCode ? (
          <Box className="grid place-items-center text-center text-neutral-600 py-16">
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12">
              <Text className="text-base font-semibold">
                Chưa chọn chương trình
              </Text>
              <Text className="mt-1 text-sm">
                Hãy chọn một chương trình để xem lịch sử.
              </Text>
            </div>
          </Box>
        ) : !total ? (
          <Box className="grid place-items-center text-center text-neutral-600 py-16">
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12">
              <Text className="text-base font-semibold">Không có kết quả</Text>
              <Text className="mt-1 text-sm">
                Thử đổi từ khóa hoặc mốc thời gian.
              </Text>
            </div>
          </Box>
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((r, idx) => (
                <CardItem key={`${r.number}-${r.time}-${start + idx}`} r={r} />
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-center gap-2">
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

              {nums.map((n, i, arr) => {
                const prev = arr[i - 1];
                const showDots = i > 0 && n - (prev ?? n) > 1;
                return (
                  <span key={n} className="inline-flex">
                    {showDots && (
                      <span className="px-1 text-sm text-neutral-500">…</span>
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
            </div>
          </>
        )}
      </Box>
    </Page>
  );
};

export default HistoryLuckyResultPage;
