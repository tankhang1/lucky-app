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
  id: number;
  time_start: string;
  time_start_number: number;
  time_end: string;
  time_end_number: number;
  campaign_code: string;
  campaign_name: string;
  image_thumbnail: string;
  image_banner: string;
  consumer_code: string;
  consumer_name: string;
  consumer_phone: string;
  counter_get: number;
  counter_award: number;
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
  item: TGetListCampaignHistoryItem;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm active:scale-[0.98] transition-transform flex gap-4 items-center"
    >
      <div className="shrink-0 w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-100">
        {item.image_banner ? (
          <img
            src={item.image_banner}
            alt={item.campaign_name}
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
          {item.campaign_name}
        </Text>
        <div className="inline-flex items-center bg-orange-50 text-orange-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-orange-100">
          <span>
            Đã trúng: <b>{item.counter_award || 0}</b> / {item.counter_get || 0}
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

  const { data: campaigns, isLoading: isLoadingCampaign } =
    useGetListCampaignHistoryQuery(
      { p },
      {
        skip: !p,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
      }
    );

  // -- Logic Filter & Pagination --
  const pageSize = 12;

  const handleBack = () => {
    if (programCode) {
      setProgramCode(undefined);
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
        {isLoadingCampaign ? (
          <div className="flex justify-center py-10">
            <div className="loading-spinner text-neutral-400">Đang tải...</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {campaigns?.map((item, index) => (
              <CampaignSummaryCard
                key={index}
                item={item}
                onClick={() => onProgramDetail(item.campaign_code)}
              />
            ))}

            {(!campaigns || (campaigns as any[]).length === 0) && (
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
