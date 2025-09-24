import ListLuckyResultModal from "@/components/lucky-list-result-modal";
import LuckySpinAllModal from "@/components/lucky-list-result-modal";
import LuckyResultModal from "@/components/lucky-result-modal";
import RotateLuckyNumber from "@/components/rotate-lucky-number";
import { useMemo, useState } from "react";
import { Page, Box, Text, Button, Input, Icon, Header, Modal } from "zmp-ui";

type Prize = { id: string; label: string; count: number; image: string };
type Participant = {
  id: string;
  name?: string;
  phone: string;
  joinedAt: string;
};
type ResultItem = {
  drawId: string;
  prizeId: string;
  prizeLabel: string;
  winner: { name?: string; phone: string };
  time: string;
};
type Program = {
  id: string;
  title: string;
  description?: string;
  rules?: string[];
  status: "open" | "closed" | "upcoming";
  startAt: string;
  endAt: string;
  banner?: string;
  prizes: Prize[];
  participantsCount: number;
  joined?: boolean;
};

const STATUS_LABEL: Record<Program["status"], string> = {
  open: "Đang mở",
  upcoming: "Sắp diễn ra",
  closed: "Đã kết thúc",
};

const statusBadge = (s: Program["status"]) =>
  s === "open"
    ? "bg-brand-200 text-brand-900 border-brand-200"
    : s === "upcoming"
    ? "bg-accent-100 text-accent-600 border-accent-100"
    : "bg-neutral-100 text-neutral-600 border-neutral-100";

const maskPhone = (p: string) =>
  p.replace(/\D/g, "").replace(/(\d{3})\d+(\d{3})$/, "$1***$2");

const TABS = [
  { key: "overview", label: "Tổng quan" },
  { key: "prizes", label: "Giải thưởng" },
  { key: "participants", label: "Người tham gia" },
  { key: "results", label: "Kết quả" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

type Props = {
  data?: {
    program: Program;
    participants: Participant[];
    results: ResultItem[];
  };
};
const data = {
  program: {
    id: "prog_001",
    title: "Lucky Draw Mùa Vụ",
    description:
      "Tri ân khách hàng mùa vụ. Tham gia bằng số điện thoại để nhận cơ hội trúng quà hấp dẫn.",
    rules: [
      "Mỗi số điện thoại được tham gia 1 lần.",
      "Một người chỉ có thể trúng 1 giải.",
      "BTC có quyền điều chỉnh trong trường hợp bất thường.",
    ],
    status: "open",
    startAt: "2025-09-20T08:00:00+07:00",
    endAt: "2025-09-25T23:59:59+07:00",
    banner:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop",
    prizes: [
      {
        id: "p1",
        label: "Giải Nhất",
        count: 1,
        image:
          "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "p2",
        label: "Giải Nhì",
        count: 3,
        image:
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "p3",
        label: "Giải Ba",
        count: 5,
        image:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    participantsCount: 128,
    joined: true,
  },
  participants: [
    {
      id: "u1",
      name: "Nguyễn An",
      phone: "+84912345678",
      joinedAt: "2025-09-21T09:10:00+07:00",
    },
    {
      id: "u2",
      name: "Trần Bình",
      phone: "+84876543210",
      joinedAt: "2025-09-21T10:05:00+07:00",
    },
    {
      id: "u3",
      name: "Lê C",
      phone: "+84987654321",
      joinedAt: "2025-09-21T11:20:00+07:00",
    },
  ],
  results: [
    {
      drawId: "draw_20250921_0001",
      prizeId: "p3",
      prizeLabel: "Giải Ba",
      winner: { name: "Nguyễn An", phone: "+84912345678" },
      time: "2025-09-21T14:05:09+07:00",
    },
    {
      drawId: "draw_20250921_0002",
      prizeId: "p3",
      prizeLabel: "Giải Ba",
      winner: { name: "Trần Bình", phone: "+84876543210" },
      time: "2025-09-21T14:06:40+07:00",
    },
  ],
};
const ProgramDetailScreen = () => {
  const { program, participants, results } = data;
  const [tab, setTab] = useState<TabKey>("overview");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [openedLucky, setOpenedLucky] = useState(false);
  const [openedListLucky, setOpenedListLucky] = useState(false);
  const [result, setResult] = useState({
    targetNumber: 83123,
    prizeLabel: "Voucher 200.000đ",
    prizeImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
    programTitle: "Lucky Day 9.9",
    winnerName: "Nguyễn An",
    winnerPhone: "0987654321",
    time: new Date().toISOString(),
    code: "TICKET-9X2F",
  });
  const isValidPhone = useMemo(
    () => /^[0-9+()\-\s]{8,}$/.test(phone.trim()),
    [phone]
  );
  const totalPrizeQty = useMemo(
    () => program.prizes.reduce((s, p) => s + p.count, 0),
    [program]
  );
  const usedQty = results.length;
  const remainQty = Math.max(totalPrizeQty - usedQty, 0);
  const prizeUsageMap = useMemo(() => {
    const m = new Map<string, number>();
    results.forEach((r) => m.set(r.prizeId, (m.get(r.prizeId) || 0) + 1));
    return m;
  }, [results]);
  const onRandomSingle = () => {
    setOpenedLucky(true);
  };
  const onRandomAll = () => {
    setOpenedListLucky(true);
  };
  return (
    <Page className="relative min-h-screen bg-neutral-50 text-neutral-900">
      <Header
        title={program.title}
        backgroundColor="bg-gradient-to-br from-brand-500/40 via-accent-400/40 to-brand-200/40"
      />

      <Box className="pt-16">
        <Box className="overflow-hidden border-neutral-200 bg-white shadow-[0_16px_50px_rgba(0,0,0,0.08)]">
          <div className="relative w-full aspect-[16/9]">
            {program.banner ? (
              <img
                src={program.banner}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-neutral-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            {program.joined && (
              <span className="absolute left-4 top-4 rounded-full bg-brand-600 text-white px-3 py-1 text-xs shadow">
                Đã tham gia
              </span>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/90 border border-neutral-200 px-3 py-1 text-xs">
                {new Date(program.startAt).toLocaleDateString()} –{" "}
                {new Date(program.endAt).toLocaleDateString()}
              </span>
              <span className="rounded-full bg-white/90 border border-neutral-200 px-3 py-1 text-xs">
                {program.participantsCount} người tham gia
              </span>
              <span className="rounded-full bg-white/90 border border-neutral-200 px-3 py-1 text-xs">
                Còn {remainQty}/{totalPrizeQty} giải
              </span>
            </div>
          </div>

          <div className="p-4 grid gap-3">
            {!!program.description && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <Text className="text-sm font-semibold">
                  Mô tả chương trình
                </Text>
                <Text className="mt-1 text-sm text-neutral-700">
                  {program.description}
                </Text>
              </div>
            )}

            {!!program.rules?.length && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <Text className="text-sm font-semibold">Quy tắc</Text>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700 list-disc pl-5">
                  {program.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Box>
      </Box>

      <Box className="px-4 pt-5">
        {/* Tabs */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative h-10 rounded-full px-5 text-sm font-medium transition whitespace-nowrap ${
                  tab === t.key
                    ? "bg-brand-gradient text-white"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tổng quan */}
        {tab === "overview" && (
          <div className="mt-5 grid gap-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "Tổng giải", v: totalPrizeQty },
                { k: "Đã trao", v: usedQty },
                { k: "Còn lại", v: remainQty },
                { k: "Người tham gia", v: program.participantsCount },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <Text className="text-xs text-neutral-500">{s.k}</Text>
                  <Text className="text-xl font-bold text-brand-600">
                    {s.v}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Giải thưởng */}
        {tab === "prizes" && (
          <div className="mt-5">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1">
              {program.prizes.map((p) => {
                const used = prizeUsageMap.get(p.id) || 0;
                const left = Math.max(p.count - used, 0);
                const ratio = p.count ? Math.min(used / p.count, 1) : 0;

                return (
                  <div
                    key={p.id}
                    className="snap-start shrink-0 w-[85%] first:ml-0 last:mr-0 ml-1 mr-1"
                  >
                    <div className="group relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-brand-500/35 via-accent-400/30 to-brand-200/35">
                      <div className="rounded-3xl border border-neutral-200 bg-white shadow-[0_16px_46px_rgba(0,0,0,0.08)] transition-all group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-3xl">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt=""
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="h-full w-full bg-neutral-100" />
                          )}

                          {/* overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

                          {/* ribbon */}
                          <div className="absolute left-0 top-4">
                            <div className="pl-4">
                              <span className="inline-block rounded-r-xl bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow">
                                {p.label}
                              </span>
                            </div>
                          </div>

                          {/* chip tổng / còn */}
                          <div className="absolute right-3 bottom-3 flex items-center gap-2 text-[11px]">
                            <span className="rounded-full bg-white/90 backdrop-blur px-2 py-0.5 border border-neutral-200 text-neutral-700">
                              Tổng: {p.count}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 border ${
                                left > 0
                                  ? "bg-brand-200/70 text-brand-900 border-brand-200"
                                  : "bg-neutral-100 text-neutral-600 border-neutral-200"
                              }`}
                            >
                              Còn: {left}
                            </span>
                          </div>
                        </div>

                        {/* body */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">
                              Đã trao
                            </span>
                            <span className="text-xs font-medium text-neutral-800">
                              {used}/{p.count}
                            </span>
                          </div>

                          {/* progress */}
                          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full bg-brand-500 transition-[width] duration-500"
                              style={{ width: `${ratio * 100}%` }}
                            />
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-neutral-600">
                              Tỉ lệ: {(ratio * 100).toFixed(0)}%
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] border ${
                                left > 0
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-neutral-100 text-neutral-600 border-neutral-200"
                              }`}
                            >
                              {left > 0 ? "Còn giải" : "Hết giải"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* gợi ý kéo */}
            <div className="mt-2 px-1 text-center text-[11px] text-neutral-500">
              Vuốt ngang để xem các giải thưởng →
            </div>
          </div>
        )}

        {/* Người tham gia */}
        {tab === "participants" && (
          <div className="mt-5 grid gap-3">
            {participants.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-200 text-brand-900 text-sm font-bold">
                    {(u.name || "Ẩn danh").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Text className="text-sm font-semibold">
                      {u.name || "Ẩn danh"}
                    </Text>
                    <div className="text-xs text-neutral-500">
                      {maskPhone(u.phone)}
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-neutral-50 px-3 py-1 text-xs text-neutral-600 border">
                  {new Date(u.joinedAt).toLocaleString()}
                </span>
              </div>
            ))}
            {!participants.length && (
              <div className="mt-8 grid place-items-center text-center text-neutral-600">
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-10">
                  <Text className="font-semibold">Chưa có người tham gia</Text>
                  <Text className="mt-1 text-sm">
                    Mời người dùng tham gia để bắt đầu quay.
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kết quả */}
        {tab === "results" && (
          <div className="mt-5 grid gap-4">
            {results.map((r) => (
              <div
                key={r.drawId}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <Text className="text-sm font-semibold">{r.prizeLabel}</Text>
                  <span className="text-xs text-neutral-500">
                    {new Date(r.time).toLocaleString()}
                  </span>
                </div>
                <div className="mt-1 text-sm text-neutral-700">
                  {r.winner.name ? `${r.winner.name} • ` : ""}
                  {maskPhone(r.winner.phone)}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  Mã quay: {r.drawId}
                </div>
              </div>
            ))}
            {!results.length && (
              <div className="mt-8 grid place-items-center text-center text-neutral-600">
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-10">
                  <Text className="font-semibold">Chưa có kết quả</Text>
                  <Text className="mt-1 text-sm">
                    Hãy bấm “Quay 1 giải” hoặc “Quay tất cả”.
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Box>

      <Box className="h-20" />
      <Box className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <Text className="text-xs text-neutral-600">Số lượt quay</Text>
            <Text className="text-lg font-bold">
              {remainQty}/{totalPrizeQty}
            </Text>
          </div>
          <Button
            disabled={program.status !== "open" || remainQty <= 0}
            onClick={onRandomSingle}
            className="h-12 flex-1 rounded-xl border border-neutral-300 font-semibold text-neutral-900 disabled:opacity-60 bg-white hover:bg-neutral-50"
          >
            Quay 1 giải
          </Button>
          <Button
            disabled={program.status !== "open" || remainQty <= 0}
            onClick={onRandomAll}
            className="h-12 flex-1 rounded-xl bg-brand-gradient text-white font-semibold disabled:opacity-60"
          >
            Quay tất cả
          </Button>
        </div>
      </Box>
      <LuckyResultModal
        openedLucky={openedLucky}
        onClose={() => setOpenedLucky(false)}
        onContinue={() => {
          // logic quay tiếp
          setOpenedLucky(false);
          // ... cập nhật result mới và setOpenedLucky(true) nếu cần
        }}
        result={result}
      />
      <ListLuckyResultModal
        openedLucky={openedListLucky}
        onClose={() => setOpenedListLucky(false)}
        queue={[result, result, result, result]} // LuckyResult[]
      />
    </Page>
  );
};

export default ProgramDetailScreen;
