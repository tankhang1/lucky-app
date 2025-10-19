import LuckConfirmModal from "@/components/lucky-confirm-modal";
import ListLuckyResultModal from "@/components/lucky-list-result-modal";
import LuckyResultModal from "@/components/lucky-result-modal";
import {
  useGetCampaignDetailQuery,
  useGetListGiftQuery,
} from "@/redux/api/campaign/campaign.api";
import {
  CalendarRange,
  ChevronDown,
  ChevronUp,
  FileDown,
  FileText,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { openDocument } from "zmp-sdk";
import { Page, Box, Text, Button, Header, Spinner } from "zmp-ui";

type Prize = {
  id: string;
  label: string;
  rewardName: string;
  count: number;
  image: string;
};
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
  code?: string;
  slogan?: string;
  description?: string;
  rules?: string[];
  status: "open" | "closed" | "upcoming";
  time: string;
  banner?: string;
  prizes: Prize[];
  joined?: boolean;
  pdf: string;
};

const maskPhone = (p: string) =>
  p.replace(/\D/g, "").replace(/(\d{3})\d+(\d{3})$/, "$1***$2");

const TABS = [
  { key: "prizes", label: "Giải thưởng" },
  { key: "results", label: "Kết quả" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const StatusPill = ({ status }: { status: Program["status"] }) => {
  const text =
    status === "open"
      ? "Đang bật"
      : status === "upcoming"
      ? "Sắp diễn ra"
      : "Đã kết thúc";
  const dot =
    status === "open"
      ? "bg-emerald-500"
      : status === "upcoming"
      ? "bg-amber-500"
      : "bg-neutral-400";
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow ring-1 ring-neutral-200">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {text}
    </span>
  );
};

// const data = {
//   program: {
//     id: "prog_001",
//     title: "Tết 2025 – Lì xì vui vẻ",
//     code: "TET2025",
//     slogan: "Chúc bạn một năm mới an khang thịnh vượng",
//     description:
//       "Chương trình tri ân khách hàng dịp tết 2025. Tham gia quay số nhận e-voucher và quà Tết hấp dẫn.",
//     rules: [
//       "Mỗi số điện thoại được tham gia theo số lượt quay được cấp.",
//       "Giải thưởng không quy đổi thành tiền mặt.",
//     ],
//     status: "open",
//     startAt: "2025-12-20T08:00:00+07:00",
//     endAt: "2026-01-05T23:59:59+07:00",
//     banner:
//       "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop",
//     joined: true,
//     prizes: [
//       {
//         id: "p1",
//         label: "Giải Nhất",
//         rewardName: "iPhone 15 128GB",
//         count: 1,
//         image:
//           "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
//       },
//       {
//         id: "p2",
//         label: "Giải Nhì",
//         rewardName: "Tai nghe AirPods",
//         count: 3,
//         image:
//           "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop",
//       },
//       {
//         id: "p3",
//         label: "Giải Ba",
//         rewardName: "Voucher 200.000đ",
//         count: 5,
//         image:
//           "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1200&auto=format&fit=crop",
//       },
//     ],
//   } as Program,
//   participants: [
//     {
//       id: "u1",
//       name: "Nguyễn An",
//       phone: "+84912345678",
//       joinedAt: "2025-09-21T09:10:00+07:00",
//     },
//     {
//       id: "u2",
//       name: "Trần Bình",
//       phone: "+84876543210",
//       joinedAt: "2025-09-21T10:05:00+07:00",
//     },
//     {
//       id: "u3",
//       name: "Lê C",
//       phone: "+84987654321",
//       joinedAt: "2025-09-21T11:20:00+07:00",
//     },
//   ] as Participant[],
//   results: [
//     {
//       drawId: "draw_20250921_0001",
//       prizeId: "p3",
//       prizeLabel: "Giải Ba",
//       winner: { name: "Nguyễn An", phone: "+84912345678" },
//       time: "2025-09-21T14:05:09+07:00",
//     },
//     {
//       drawId: "draw_20250921_0002",
//       prizeId: "p3",
//       prizeLabel: "Giải Ba",
//       winner: { name: "Trần Bình", phone: "+84876543210" },
//       time: "2025-09-21T14:06:40+07:00",
//     },
//   ] as ResultItem[],
// };
type TProgramDetail = {
  program: Program;
  participants: Participant[];
  results: ResultItem[];
};
const ProgramDetailScreen = () => {
  const { data: programDetail, isLoading: isLoadingProgramDetail } =
    useGetCampaignDetailQuery({
      c: "tungbunghethu",
      p: "84356955354",
    });
  const { data: listGift, isLoading: isLoadingListGift } = useGetListGiftQuery({
    c: "tungbunghethu",
  });
  //@ts-expect-error no check
  const data: TProgramDetail = useMemo(
    () => ({
      program: {
        id: programDetail?.code || "",
        status: programDetail?.status === 1 ? "open" : "closed",
        prizes: [
          ...(listGift?.map((gift) => ({
            id: gift.id || -1,
            label: gift.gift_name || "",
            rewardName: gift.award_name || "",
            count: +gift.limits || 0,
            image: gift.gift_image || "",
          })) || []),
        ],
        time: programDetail?.time || "",
        title: programDetail?.name || "",
        banner: programDetail?.banner || "",
        code: programDetail?.code || "",
        description: programDetail?.description || "",
        joined: programDetail?.joined || 0,
        slogan: "Tung bung he thu",
        pdf: programDetail?.pdf,
      },
      participants: [],
      results: [],
    }),
    [programDetail]
  );
  const { program, participants, results } = data;
  const [openedMore, setOpenedMore] = useState(false);
  const [tab, setTab] = useState<TabKey>("prizes");
  const [openedLucky, setOpenedLucky] = useState(false);
  const [openedListLucky, setOpenedListLucky] = useState(false);
  const [confirmedModal, setConfirmedModal] = useState(false);
  const [result, setResult] = useState({
    targetNumber: 83123,
    prizeLabel: "Voucher 200.000đ",
    prizeImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
    programTitle: program.title,
    winnerName: "Nguyễn An",
    winnerPhone: "0987654321",
    time: new Date().toISOString(),
    code: "TICKET-9X2F",
  });

  const totalPrizeQty = useMemo(
    () => program.prizes.reduce((s, p) => s + p.count, 0),
    [program]
  );
  const openPDF = () => {
    openDocument({
      url: program?.pdf,
      title: "Thông tin chi tiết",
      download: true,
    });
  };
  const onRandomSingle = () => setOpenedLucky(true);
  const onRandomAll = () => setOpenedListLucky(true);

  return (
    <Page className="relative min-h-screen bg-gradient-to-b from-amber-50 via-neutral-50 to-emerald-50 text-neutral-900">
      <Header
        title={program.title}
        backgroundColor="bg-white/70 backdrop-blur-md"
      />

      <Box className="pt-16">
        <div className="overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-neutral-200">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="absolute left-3 top-3">
              <StatusPill status={program.status} />
            </div>
            <div className="absolute left-4 right-4 bottom-4">
              <Text className="text-white text-xl font-semibold drop-shadow">
                {program.title}
              </Text>
              {!!program.code && (
                <div className="mt-1 text-white/90 text-sm">
                  Mã: {program.code}
                </div>
              )}
            </div>
          </div>

          {isLoadingProgramDetail ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm ring-1 ring-neutral-200">
                    <CalendarRange className="h-4 w-4" />
                    {program.time}
                  </span>
                  {!!program.slogan && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm ring-1 ring-neutral-200">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      {program.slogan}
                    </span>
                  )}
                  {program?.joined ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/90 text-white px-3 py-1 text-xs shadow">
                      Đã tham gia
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 text-orange-400 px-3 py-1 text-xs shadow">
                      Chưa tham gia
                    </span>
                  )}
                </div>
                <button
                  onClick={openPDF}
                  className="inline-flex items-center gap-1 rounded-md bg-white border text-white p-2 text-[11px] font-medium  shadow-sm"
                >
                  <FileText className="w-4 h-4 text-black" />
                </button>
              </div>

              {!!program.description && (
                <div>
                  <p
                    className={`mt-4 text-[15px] leading-6 text-neutral-900 ${
                      openedMore ? "line-clamp-none" : "line-clamp-6"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: program.description || "",
                    }}
                  ></p>
                  {!openedMore ? (
                    <div
                      onClick={() => setOpenedMore(true)}
                      className="flex flex-col justify-center items-center opacity-40 mt-2 pointer-events-auto"
                    >
                      <p className="text-sm">Xem thêm</p>
                      <ChevronDown size={14} />
                    </div>
                  ) : (
                    <div
                      onClick={() => setOpenedMore(false)}
                      className="flex flex-col justify-center items-center opacity-40 mt-2 pointer-events-auto"
                    >
                      <p className="text-sm">Rút gọn</p>
                      <ChevronUp size={14} />
                    </div>
                  )}
                </div>
              )}
              {!!program.rules?.length && (
                <ul className="mt-3 space-y-2 text-[15px] text-neutral-900">
                  {program.rules.map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-700" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </Box>

      <Box className="px-4 pt-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`h-10 rounded-full px-5 text-sm font-medium transition whitespace-nowrap ${
                tab === t.key
                  ? "bg-gradient-to-r from-emerald-500 to-amber-400 text-white shadow-md"
                  : "bg-white/80 backdrop-blur border border-neutral-200 text-neutral-700 hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "prizes" &&
          (isLoadingListGift ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {program.prizes.map((p) => (
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
                          />
                        ) : (
                          <div className="h-36 w-44 bg-neutral-100" />
                        )}
                        <div className="absolute left-0 top-3 pl-3">
                          <span className="inline-block rounded-r-xl bg-emerald-600 text-white px-3 py-1 text-xs font-semibold shadow">
                            {p.label}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-[11px] text-neutral-500">
                          Mã: {p.id}
                        </div>
                        <div className="mt-1">
                          <Text className="text-xs text-neutral-500">
                            Tên giải thưởng
                          </Text>
                          <Text className="text-base font-semibold">
                            {p.rewardName}
                          </Text>
                        </div>
                        <div className="mt-2">
                          <Text className="text-xs text-neutral-500">
                            Số lượng
                          </Text>
                          <Text className="text-base font-semibold">
                            {p.count}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {!program.prizes.length && (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 backdrop-blur px-6 py-10 text-center text-neutral-600">
                  <Text className="font-semibold">
                    Chưa cấu hình giải thưởng
                  </Text>
                  <Text className="mt-1 text-sm">
                    Thêm giải để bắt đầu chương trình.
                  </Text>
                </div>
              )}
            </div>
          ))}

        {tab === "results" && (
          <div className="mt-5 grid gap-4">
            {results.map((r) => (
              <div
                key={r.drawId}
                className="rounded-2xl bg-white/80 backdrop-blur p-4 shadow-sm ring-1 ring-white/60"
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
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 backdrop-blur px-6 py-10 text-center text-neutral-600">
                <Text className="font-semibold">Chưa có kết quả</Text>
                <Text className="mt-1 text-sm">
                  Bấm “Quay 1 giải” hoặc “Quay tất cả”.
                </Text>
              </div>
            )}
          </div>
        )}
      </Box>

      <Box className="h-24" />
      <Box className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/85 backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <Text className="text-xs text-neutral-600">Số lượt quay</Text>
            <Text className="text-lg font-bold">
              {programDetail?.number_get}/{programDetail?.number_limit}
            </Text>
          </div>
          <Button
            disabled={program.status !== "open"}
            onClick={onRandomSingle}
            className="h-12 flex-1 rounded-xl !border !border-neutral-600 font-semibold text-neutral-900 bg-white hover:bg-neutral-50"
          >
            Quay 1 giải
          </Button>
          <Button
            disabled={program.status !== "open"}
            onClick={() => setConfirmedModal(true)}
            className="h-12 flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 text-white font-semibold"
          >
            Quay tất cả
          </Button>
        </div>
      </Box>

      <LuckyResultModal
        openedLucky={openedLucky}
        onClose={() => setOpenedLucky(false)}
        onContinue={() => setOpenedLucky(false)}
        result={result}
      />
      <ListLuckyResultModal
        openedLucky={openedListLucky}
        onClose={() => setOpenedListLucky(false)}
        queue={[result, result, result, result]}
      />
      <LuckConfirmModal
        opened={confirmedModal}
        onClose={() => {
          setConfirmedModal(false);
          setOpenedListLucky(true);
        }}
      />
    </Page>
  );
};

export default ProgramDetailScreen;
