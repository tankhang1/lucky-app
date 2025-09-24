import { useMemo, useState } from "react";
import { Page, Box, Input, Text, Icon, useNavigate } from "zmp-ui";

type Program = {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed" | "upcoming" | "joined";
  startAt: string;
  endAt: string;
  participants: number;
  thumbnail?: string;
};

const STATUS_LABEL: Record<Program["status"], string> = {
  open: "Đang mở",
  upcoming: "Sắp diễn ra",
  closed: "Đã kết thúc",
  joined: "Đã tham gia",
};

const TABS: Array<{ key: "all" | Program["status"]; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "open", label: "Đang mở" },
  { key: "upcoming", label: "Sắp diễn ra" },
  { key: "closed", label: "Kết thúc" },
  { key: "joined", label: "Đã tham gia" },
];

const DATA: Program[] = [
  {
    id: "p1",
    title: "Lucky Draw Mùa Vụ",
    description: "Chương trình quay số trúng thưởng dành cho khách hàng",
    status: "open",
    startAt: "2025-09-20T08:00:00+07:00",
    endAt: "2025-09-25T23:59:59+07:00",
    participants: 128,
    thumbnail:
      "https://brandboost.vn/wp-content/uploads/2024/07/Ung-dung-cua-lucky-draw-CO-WELL-Asia.jpg",
  },
  {
    id: "p2",
    title: "Tri Ân Khách Hàng",
    description: "Chương trình tri ân khách hàng thân thiết",
    status: "upcoming",
    startAt: "2025-10-01T08:00:00+07:00",
    endAt: "2025-10-07T23:59:59+07:00",
    participants: 0,
    thumbnail:
      "https://dulichnewtour.vn/ckfinder/images/Tours/triankhachhang/tri-an-khach-hang%20(5).jpg",
  },
  {
    id: "p3",
    title: "Quà Tặng Tháng 8",
    description: "Chương trình quà tặng đặc biệt nhân dịp Quốc Khánh",
    status: "closed",
    startAt: "2025-08-01T08:00:00+07:00",
    endAt: "2025-08-10T23:59:59+07:00",
    participants: 342,
    thumbnail:
      "https://inogift.vn/wp-content/uploads/2025/05/qua-tang-cach-mang-thang-8-va-qua-tang-quoc-khanh-2-9.jpg",
  },
  {
    id: "p4",
    title: "Chương Trình Mùa Xuân",
    description: "Chương trình đặc biệt chào đón mùa xuân 2025",
    status: "joined",
    startAt: "2025-01-15T08:00:00+07:00",
    endAt: "2025-01-25T23:59:59+07:00",
    participants: 256,
    thumbnail:
      "https://media.vov.vn/sites/default/files/styles/large/public/2025-04/mua_xuan_thong_nhat_3.jpg",
  },
];

const badge = (s: Program["status"]) =>
  s === "open"
    ? "bg-brand-200 text-brand-900 border-brand-200"
    : s === "upcoming"
    ? "bg-accent-100 text-accent-600 border-accent-100"
    : s === "joined"
    ? "bg-blue-100 text-blue-600 border-blue-100"
    : "bg-neutral-100 text-neutral-600 border-neutral-100";

const dotColor = (s: Program["status"]) =>
  s === "open"
    ? "bg-brand-600"
    : s === "upcoming"
    ? "bg-accent-600"
    : s === "joined"
    ? "bg-blue-600"
    : "bg-neutral-600";

const Card = ({
  p,
  onClick,
  className = "",
}: {
  p: Program;
  onClick: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-brand-500/35 via-accent-400/30 to-brand-200/35 ${className}`}
  >
    <div className="rounded-3xl bg-white shadow-[0_18px_60px_rgba(0,0,0,0.10)] transition group-hover:shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-3xl">
        {p.thumbnail ? (
          <img
            src={p.thumbnail}
            alt=""
            className="h-60 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${badge(
            p.status
          )} backdrop-blur`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor(p.status)}`} />
          {STATUS_LABEL[p.status]}
        </span>
        <span className="absolute right-3 bottom-3 rounded-full bg-white/90 px-2.5 py-1 text-xs text-neutral-700 backdrop-blur">
          {p.participants} người
        </span>
      </div>

      <div className="p-4 h-56 flex flex-col">
        <div className="flex-1">
          <Text className="text-[16px] font-semibold leading-snug line-clamp-2 text-neutral-900">
            {p.title}
          </Text>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-600">
            <span className="rounded-md bg-neutral-50 px-2 py-1">
              {new Date(p.startAt).toLocaleDateString()} –{" "}
              {new Date(p.endAt).toLocaleDateString()}
            </span>
          </div>
          <Text className="mt-2 text-start text-sm text-neutral-700 line-clamp-2">
            {p.description}
          </Text>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
            Xem chi tiết
            <Icon icon="zi-chevron-right" size={16} className="opacity-90" />
          </span>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <div className={`h-1.5 w-1.5 rounded-full ${dotColor(p.status)}`} />
            <span>
              {p.status === "open"
                ? "Đang mở"
                : p.status === "upcoming"
                ? "Sắp mở"
                : p.status === "joined"
                ? "Đã tham gia"
                : "Đã kết thúc"}
            </span>
          </div>
        </div>
      </div>
    </div>
  </button>
);

const HomeScreen = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | Program["status"]>("all");

  const counts = useMemo(() => {
    const c = {
      all: DATA.length,
      open: 0,
      upcoming: 0,
      closed: 0,
      joined: 0,
    } as Record<"all" | Program["status"], number>;
    DATA.forEach((p) => (c[p.status] = (c[p.status] || 0) + 1));
    return c;
  }, []);

  const list = useMemo(() => {
    const byQ = (p: Program) =>
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.description.toLowerCase().includes(q.toLowerCase()) ||
      STATUS_LABEL[p.status].toLowerCase().includes(q.toLowerCase());
    const byTab = (p: Program) => tab === "all" || p.status === tab;
    return DATA.filter((p) => byQ(p) && byTab(p));
  }, [q, tab]);

  const joined = useMemo(() => DATA.filter((p) => p.status === "joined"), []);
  const others = useMemo(
    () => list.filter((p) => p.status !== "joined"),
    [list]
  );

  const onProgramDetail = (id: string) => navigate(`/program/${id}`);

  return (
    <Page className="relative min-h-screen bg-neutral-50 text-neutral-900">
      <Box className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80">
        <div className="px-5 py-3 flex items-center gap-3 pt-14">
          <img
            src="https://www.mappacific.com/wp-content/uploads/2021/08/logo.png"
            alt=""
            className="h-8 w-auto object-contain"
          />
          <Text className="text-base font-semibold">Mappacific Programs</Text>
        </div>
        <div className="px-5 pb-4">
          <div className="rounded-2xl bg-neutral-50 border border-neutral-200">
            <Input
              placeholder="Tìm kiếm chương trình…"
              value={q}
              onChange={(e) => setQ((e.target as HTMLInputElement).value)}
              prefix={
                <Box className="pl-4">
                  <Icon icon="zi-search" className="text-neutral-400" />
                </Box>
              }
              className="!bg-neutral-50 !border-0 !rounded-2xl"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {TABS.map((t) => {
                const active = tab === t.key;
                const count =
                  t.key === "all" ? counts.all : (counts as any)[t.key] || 0;
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
                    {t.label} · {count}
                  </button>
                );
              })}
            </div>
            <div className="pl-3">
              <button onClick={() => navigate("/history")}>
                <Icon icon="zi-memory" className="text-black" />
              </button>
            </div>
          </div>
        </div>
      </Box>

      <Box className="px-5 py-4 space-y-8">
        {!!joined.length && tab === "all" && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Text className="text-sm font-semibold">
                Chương trình đã tham gia
              </Text>
              <Text className="text-xs text-neutral-500">
                {joined.length} mục
              </Text>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
              {joined.map((p) => (
                <Card
                  key={p.id}
                  p={p}
                  onClick={() => onProgramDetail(p.id)}
                  className="snap-start shrink-0 w-[85%] md:w-[60%]"
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Text className="text-sm font-semibold">
              {tab === "all"
                ? "Tất cả chương trình"
                : tab === "open"
                ? "Đang mở"
                : tab === "upcoming"
                ? "Sắp diễn ra"
                : tab === "closed"
                ? "Kết thúc"
                : "Đã tham gia"}
            </Text>
            <Text className="text-xs text-neutral-500">
              {others.length} mục
            </Text>
          </div>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {others.map((p) => (
              <Card
                key={p.id}
                p={p}
                onClick={() => onProgramDetail(p.id)}
                className="snap-start shrink-0 w-[85%] md:w-[60%]"
              />
            ))}
          </div>

          {!others.length && !joined.length && (
            <Box className="mt-10 grid place-items-center text-center text-neutral-600">
              <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 shadow-[0_16px_50px_rgba(0,0,0,0.08)]">
                <Text className="text-base font-semibold">
                  Không có chương trình phù hợp
                </Text>
                <Text className="mt-1 text-sm">
                  Thử điều chỉnh từ khóa hoặc bộ lọc.
                </Text>
              </div>
            </Box>
          )}
        </div>
      </Box>
    </Page>
  );
};

export default HomeScreen;
