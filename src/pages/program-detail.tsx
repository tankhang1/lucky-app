import LuckConfirmModal from "@/components/lucky-confirm-modal";
import ListLuckyResultModal from "@/components/lucky-list-result-modal";
import LuckyResultModal from "@/components/lucky-result-modal";
import { PrizesList } from "@/components/program-detail-prizes";
import { ResultsGrid } from "@/components/program-detail-result";
import {
  useGetCampaignDetailQuery,
  useGetListCampaignHistoryQuery,
  useGetListGiftQuery,
  useGetListResultNumberQuery,
  useRequestLuckNumberMutation,
} from "@/redux/api/campaign/campaign.api";
import {
  TLuckResultItem,
  TResultLuckyNumberItem,
} from "@/redux/api/campaign/campaign.response";
import { RootState } from "@/redux/store";
import {
  BadgeCheck,
  CalendarRange,
  ChevronDown,
  ChevronUp,
  FileDown,
  FileText,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { openDocument } from "zmp-sdk";
import {
  Page,
  Box,
  Text,
  Button,
  Header,
  Spinner,
  Modal,
  Stack,
  useParams,
  useNavigate,
} from "zmp-ui";

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
    <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium ring-1 ring-neutral-200">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {text}
    </span>
  );
};

type TProgramDetail = {
  program: Program;
  participants: Participant[];
  results: TResultLuckyNumberItem[];
};
const ProgramDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { p, userId } = useSelector((state: RootState) => state.app);
  const { data: programDetail, isLoading: isLoadingProgramDetail } =
    useGetCampaignDetailQuery(
      {
        c: id || "",
        p: p,
      },
      {
        skip: !id || !p,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );
  const { data: listGift, isLoading: isLoadingListGift } = useGetListGiftQuery(
    {
      c: id || "",
    },
    {
      skip: !id,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const {
    data: listResult,
    isLoading: isLoadingListResult,
    refetch: refetchListResult,
  } = useGetListResultNumberQuery(
    {
      c: id || "",
      p: p,
    },
    {
      skip: !id || !p,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const [requestLuckNumber, { isLoading: isLoadingRequestLuckyNumber }] =
    useRequestLuckNumberMutation();
  const [requestAllLuckNumber, { isLoading: isLoadingRequestAllLuckyNumber }] =
    useRequestLuckNumberMutation();
  const [resultLuckyNumber, setResultLuckyNumber] = useState<TLuckResultItem>();
  const [listResultLuckyNumber, setListResultLuckyNumber] = useState<
    TLuckResultItem[]
  >([]);
  const [messageError, setMessageError] = useState("");
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
      results: listResult || [],
    }),
    [programDetail, listGift, listResult, isLoadingListResult]
  );
  const { program, participants, results } = data;
  const [openedMore, setOpenedMore] = useState(false);
  const [tab, setTab] = useState<TabKey>("prizes");
  const [openedLucky, setOpenedLucky] = useState(false);
  const [openedListLucky, setOpenedListLucky] = useState(false);
  const [confirmedModal, setConfirmedModal] = useState(false);

  const openPDF = () => {
    openDocument({
      url: program?.pdf,
      title: "Thông tin chi tiết",
      download: true,
    });
  };
  const onRandomSingle = async () => {
    await requestLuckNumber({
      phone: p,
      zalo_user_id: userId,
      turn_all: 0,
      campaign_code: id || "",
    })
      .unwrap()
      .then((value) => {
        setResultLuckyNumber(value.data?.[0]);
        refetchListResult();
        setOpenedLucky(true);
      })
      .catch((error) => {
        setMessageError(error.data.message);
      });
  };
  const onRandomAll = async () => {
    await requestAllLuckNumber({
      phone: p,
      zalo_user_id: userId,
      turn_all: 1,
      campaign_code: id || "",
    })
      .unwrap()
      .then((value) => {
        setListResultLuckyNumber(value.data);
        refetchListResult();
        setOpenedListLucky(true);
      })
      .catch((error) => {
        setMessageError(error.data.message);
      });
  };
  useEffect(() => {
    if (!isLoadingProgramDetail && !programDetail?.code) {
      navigate("/home");
    }
  }, [isLoadingProgramDetail, programDetail]);
  return (
    <Page className="relative min-h-screen bg-gradient-to-b from-amber-50 via-neutral-50 to-emerald-50 text-neutral-900">
      <Header
        title={program.title}
        backgroundColor="bg-white/70 backdrop-blur-md"
        onBackClick={() => navigate("/home")}
        className="relative"
      />

      <Box>
        <div className="overflow-hidden bg-white ring-1 ring-neutral-200">
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
            <div className="absolute left-3 top-7">
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
                  {program?.joined && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-neutral-700 shadow-sm ring-1 ring-neutral-200">
                      <BadgeCheck
                        className={`h-4 w-4 ${
                          program?.joined ? "text-green-500" : "text-yellow-500"
                        }`}
                      />
                      {program?.joined ? "Đã tham gia" : "Chưa tham gia"}
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
              onClick={() => {
                setTab(t.key);
              }}
              className={`h-10 rounded-full px-5 text-sm font-medium transition whitespace-nowrap ${
                tab === t.key
                  ? "bg-gradient-to-r from-emerald-500 to-amber-400 text-white"
                  : "bg-white/80 backdrop-blur border border-neutral-200 text-neutral-700 hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "prizes" &&
          (isLoadingListGift ? (
            <div className="flex justify-center items-center py-4">
              <Spinner />
            </div>
          ) : (
            <div className="mt-5">
              <PrizesList prizes={program.prizes} pageSize={6} />
            </div>
          ))}

        {tab === "results" &&
          (isLoadingListResult ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : (
            <ResultsGrid items={results as TResultLuckyNumberItem[]} />
          ))}
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
            disabled={
              program.status !== "open" ||
              programDetail?.number_get === programDetail?.number_limit
            }
            onClick={onRandomSingle}
            loading={isLoadingRequestLuckyNumber}
            className="h-12 flex-1 rounded-xl !border !border-neutral-600 font-semibold text-neutral-900 bg-white hover:bg-neutral-50"
          >
            Chọn 1 số
          </Button>
          <Button
            disabled={
              program.status !== "open" ||
              programDetail?.number_get === programDetail?.number_limit
            }
            loading={isLoadingRequestAllLuckyNumber}
            onClick={() => setConfirmedModal(true)}
            className={`h-12 flex-1 rounded-xl !bg-emerald-500 text-white font-semibold ${
              (program.status !== "open" ||
                programDetail?.number_get === programDetail?.number_limit) &&
              "!bg-gray-500"
            }`}
          >
            Chọn tất cả
          </Button>
        </div>
      </Box>

      <LuckyResultModal
        openedLucky={openedLucky}
        onClose={() => setOpenedLucky(false)}
        onContinue={onRandomSingle}
        isDisabledContinue={
          programDetail?.number_get === programDetail?.number_limit
        }
        result={{
          prizeLabel: resultLuckyNumber?.gift_name || "",
          targetNumber: resultLuckyNumber?.number || 0,
          winnerPhone: p,
          code: programDetail?.code,
          prizeImage: resultLuckyNumber?.gift_image || "",
          programTitle: programDetail?.name || "",
          time: new Date().toDateString(),
        }}
      />
      <ListLuckyResultModal
        openedLucky={openedListLucky}
        onClose={() => setOpenedListLucky(false)}
        queue={
          listResultLuckyNumber?.map((item) => ({
            prizeLabel: item?.gift_name || "",
            targetNumber: item?.number || 0,
            winnerPhone: p,
            code: programDetail?.code || "",
            prizeImage: item?.gift_image || "",
            programTitle: programDetail?.name || "123",
            time: new Date().toDateString(),
          })) || []
        }
      />
      <LuckConfirmModal
        opened={confirmedModal}
        onConfirm={() => {
          setConfirmedModal(false);
          onRandomAll();
        }}
        onClose={() => {
          setConfirmedModal(false);
        }}
      />
      <Modal
        visible={messageError !== ""}
        onClose={() => setMessageError("")}
        maskClosable
      >
        <Stack space="10px">
          <Box
            dangerouslySetInnerHTML={{
              __html: messageError,
            }}
          />
          <Button
            className="bg-green-600 font-bold hover:bg-green-500"
            onClick={() => setMessageError("")}
          >
            Xác nhận
          </Button>
        </Stack>
      </Modal>
    </Page>
  );
};

export default ProgramDetailScreen;
