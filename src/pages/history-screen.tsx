// pages/HistoryLuckyResultPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Page,
  Box,
  Text,
  Input,
  Icon,
  Avatar,
  Button,
  useNavigate,
  Header,
} from "zmp-ui";

type LuckyResult = {
  targetNumber: number;
  prizeLabel: string;
  prizeImage?: string;
  programTitle?: string;
  winnerName?: string;
  winnerPhone: string;
  time?: string;
  code?: string;
};

const maskPhone = (p: string) =>
  p.replace(/(\d{3})\d+(\d{2})$/, (_, a, b) => `${a}***${b}`);

const fmtDate = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleString();
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

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
const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
];
const HistoryLuckyResultPage = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">(
    "all"
  );
  const [tab, setTab] = useState<string>("all");
  const [data, setData] = useState<LuckyResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mock: LuckyResult[] = [
      {
        targetNumber: 1289,
        prizeLabel: "Áo thun Mappacific",
        programTitle: "Lucky Draw Mùa Vụ",
        winnerName: "Nguyễn An",
        winnerPhone: "0912345678",
        code: "TD-001",
        time: "2025-09-24T10:30:00+07:00",
        prizeImage:
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop",
      },
      {
        targetNumber: 77,
        prizeLabel: "Voucher 100K",
        programTitle: "Tri Ân Khách Hàng",
        winnerPhone: "0987654321",
        code: "TA-112",
        time: "2025-09-22T15:05:00+07:00",
      },
      {
        targetNumber: 456,
        prizeLabel: "Nón lưỡi trai",
        programTitle: "Quà Tặng Tháng 8",
        winnerName: "Trần Bình",
        winnerPhone: "0909090909",
        code: "QT-889",
        time: "2025-08-05T09:12:00+07:00",
      },
    ];
    setTimeout(() => {
      setData(mock);
      setLoading(false);
    }, 150);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const byQ = (r: LuckyResult) =>
      !s ||
      r.prizeLabel.toLowerCase().includes(s) ||
      (r.programTitle || "").toLowerCase().includes(s) ||
      (r.code || "").toLowerCase().includes(s) ||
      (r.winnerName || "").toLowerCase().includes(s) ||
      r.winnerPhone.includes(s) ||
      String(r.targetNumber).includes(s);

    const now = new Date();
    const boundary =
      filter === "today"
        ? startOfDay(now)
        : filter === "week"
        ? startOfWeek(now)
        : filter === "month"
        ? startOfMonth(now)
        : null;

    return data
      .filter(byQ)
      .filter((r) =>
        boundary ? new Date(r.time || Date.now()) >= boundary : true
      )
      .sort(
        (a, b) =>
          new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime()
      );
  }, [data, q, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, LuckyResult[]>();
    for (const r of filtered) {
      const d = r.time ? new Date(r.time) : new Date();
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([k, list]) => {
        const [y, m, d] = k.split("-").map((x) => parseInt(x, 10));
        const dateObj = new Date(y, m - 1, d);
        const label = isSameDay(dateObj, new Date())
          ? "Hôm nay"
          : dateObj.toLocaleDateString();
        return { label, list };
      });
  }, [filtered]);

  return (
    <Page className="min-h-screen bg-neutral-50">
      <Header title="Lịch sử quay thưởng" />
      <div className="px-5 pb-4 pt-20">
        <div className="rounded-2xl bg-white border border-neutral-200">
          <Input
            placeholder="Tìm kiếm chương trình…"
            value={q}
            onChange={(e) => setQ((e.target as HTMLInputElement).value)}
            prefix={
              <Box className="pl-4">
                <Icon icon="zi-search" className="text-neutral-400" />
              </Box>
            }
            className="!bg-white !border-0 !rounded-2xl"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => {
            const active = tab === t.key;

            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`h-10 rounded-full px-4 text-sm whitespace-nowrap transition ${
                  active
                    ? "bg-brand-gradient text-white shadow-[0_10px_24px_rgba(0,0,0,0.10)]"
                    : "bg-white border border-neutral-200 text-neutral-700"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <Box className="p-4 space-y-6">
        {loading ? (
          <Box className="grid place-items-center py-16 text-neutral-500">
            <Text className="text-sm">Đang tải…</Text>
          </Box>
        ) : groups.length === 0 ? (
          <Box className="grid place-items-center text-center text-neutral-600 py-16">
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 shadow-[0_16px_50px_rgba(0,0,0,0.08)]">
              <Text className="text-base font-semibold">Không có kết quả</Text>
              <Text className="mt-1 text-sm">Thử đổi từ khóa hoặc bộ lọc.</Text>
            </div>
          </Box>
        ) : (
          groups.map((g) => (
            <div key={g.label}>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                <Text className="text-sm font-semibold">{g.label}</Text>
                <Text className="text-xs text-neutral-500">
                  {g.list.length} mục
                </Text>
              </div>

              <div className="space-y-3">
                {g.list.map((r, i) => (
                  <Box
                    key={`${r.code || r.targetNumber}-${i}`}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3 bg-white hover:shadow-md transition"
                  >
                    {r.prizeImage ? (
                      <Avatar
                        src={r.prizeImage}
                        size={44}
                        className="ring-2 ring-amber-400"
                      />
                    ) : (
                      <Box className="h-11 w-11 rounded-xl bg-amber-100 grid place-items-center ring-2 ring-amber-200">
                        <Icon icon="zi-add-member" className="text-amber-700" />
                      </Box>
                    )}
                    <Box className="min-w-0 flex-1">
                      <Text className="text-sm font-medium truncate">
                        {r.prizeLabel}
                      </Text>
                      <Text className="text-xs text-neutral-600 truncate">
                        {r.programTitle || "Chương trình"}
                      </Text>
                      <Text className="text-[11px] text-neutral-500 truncate">
                        {(r.winnerName ? `${r.winnerName} • ` : "") +
                          maskPhone(r.winnerPhone)}
                        {r.code ? ` • Mã lượt: ${r.code}` : ""}
                      </Text>
                    </Box>
                    <Box className="text-right">
                      <Text className="text-[11px] text-neutral-500">
                        {fmtDate(r.time)}
                      </Text>
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] bg-neutral-100 text-neutral-700 border-neutral-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                        #{r.targetNumber}
                      </span>
                    </Box>
                  </Box>
                ))}
              </div>
            </div>
          ))
        )}
      </Box>
    </Page>
  );
};

export default HistoryLuckyResultPage;
