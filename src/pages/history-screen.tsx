// pages/HistoryLuckyResultPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useGetListCampaignHistoryQuery,
  useSearchHistoryCampaignQuery,
} from "@/redux/api/campaign/campaign.api";
import { Page, Box, Text, Input, Icon, Header, useNavigate } from "zmp-ui";

// --- TYPES DEFINITION ---

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

// Cập nhật Type cho Campaign để chứa thông tin thống kê
export type TSearchCampaignItem = {
  id: number;
  uuid: string;
  code: string;
  name: string;
  image?: string; // Ảnh chương trình
  total_win?: number; // Đã trúng bao nhiêu giải
  total_selected?: number; // Tổng số đã chọn
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

// --- HELPER FUNCTIONS ---

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

const CampaignSummaryCard = ({
  item,
  onClick,
}: {
  item: TSearchCampaignItem;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm active:scale-[0.98] transition-transform flex gap-4 items-center"
    >
      <div className="shrink-0 w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-neutral-400">
            <Icon icon="zi-star" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Text className="font-bold text-neutral-800 line-clamp-2 text-sm uppercase mb-2">
          {item.name}
        </Text>
        <div className="inline-flex items-center bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-orange-100">
          <span>
            Đã trúng: <b>{item.total_win || 0}</b> / {item.total_selected || 0}
          </span>
        </div>
      </div>

      <Icon icon="zi-chevron-right" className="text-neutral-400 shrink-0" />
    </div>
  );
};

const HistoryLuckyResultPage = () => {
  const { p } = useSelector((state: RootState) => state.app);
  const navigate = useNavigate();
  const [programCode, setProgramCode] = useState<string | undefined>(undefined);

  const [q, setQ] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [tab, setTab] = useState<TimeFilter>("all");
  const [page, setPage] = useState(1);

  const { data: searchCampaigns, isLoading: isLoadingCampaigns } =
    useSearchHistoryCampaignQuery(
      { k: "" },
      {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );

  const selectedCampaign = useMemo(() => {
    return (searchCampaigns as TSearchCampaignItem[] | undefined)?.find(
      (c) => c.code === programCode
    );
  }, [searchCampaigns, programCode]);

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

  // -- Logic Filter & Pagination --
  const pageSize = 12;

  const filtered = useMemo(() => {
    if (!programCode) return []; // Không cần tính toán ở màn danh sách

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
        .filter((r) => (boundary ? new Date(r.time) >= boundary : true))
        // Sắp xếp mới nhất lên đầu
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    );
  }, [listGiftHistory, q, timeFilter, programCode]);

  // Reset page khi đổi điều kiện lọc
  useEffect(() => {
    setPage(1);
  }, [q, timeFilter, programCode]);

  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pageItems = filtered.slice(startIdx, endIdx);
  const nums = usePageNumbers(page, maxPage, 1);

  // -- Handlers --

  const handleBack = () => {
    if (programCode) {
      setProgramCode(undefined);
      setQ("");
      setTimeFilter("all");
      setTab("all");
    } else {
      navigate(-1);
    }
  };

  const onProgramDetail = (id: string) => navigate(`/program/${id}`);
  return (
    <Page className="min-h-screen bg-neutral-50 flex flex-col">
      <Header
        title={programCode ? "Chi tiết tham gia" : "Lịch sử chương trình"}
        className="relative z-50 bg-white"
        showBackIcon={true}
        onBackClick={handleBack}
      />

      <Box className="p-4 space-y-4 flex-1 pb-10">
        {isLoadingCampaigns ? (
          <div className="flex justify-center py-10">
            <div className="loading-spinner text-neutral-400">Đang tải...</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(searchCampaigns as TSearchCampaignItem[] | undefined)?.map(
              (item) => (
                <CampaignSummaryCard
                  key={item.code || item.id}
                  item={item}
                  onClick={() => onProgramDetail(item.code)}
                />
              )
            )}

            {(!searchCampaigns || (searchCampaigns as any[]).length === 0) && (
              <div className="text-center py-12 text-neutral-500">
                <Text>Hiện chưa có chương trình nào.</Text>
              </div>
            )}
          </div>
        )}
      </Box>
    </Page>
  );
};

export default HistoryLuckyResultPage;
