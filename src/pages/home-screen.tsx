import {
  useGetListActiveCampaginQuery,
  useGetListExpiredCampaginQuery,
} from "@/redux/api/campaign/campaign.api";
import { TCampaginItem } from "@/redux/api/campaign/campaign.response";
import { RootState } from "@/redux/store";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Text, useNavigate, Spinner } from "zmp-ui";
import Logo from "@/assets/logo.png";
import CampaignCard from "@/components/campaign-card";
import SegmentedTabs from "@/components/segmented-tabs";
export type Program = {
  id: string;
  title: string;
  description: string;
  status: "open" | "closed" | "upcoming" | "joined";
  time: string;
  joined: number;
  participants: number;
  thumbnail?: string;
};

export const STATUS_LABEL: Record<Program["status"], string> = {
  open: "Đang diễn ra",
  upcoming: "Sắp diễn ra",
  closed: "Đã kết thúc",
  joined: "Đã tham gia",
};

const dtoCampaign = (value: TCampaginItem): Program => {
  return {
    description: value.description_short,
    time: value.time,
    id: value.code,
    participants: 0,
    status:
      value.status === 1 ? "open" : value.status === 2 ? "closed" : "upcoming",
    joined: value.joined,
    title: value.name,
    thumbnail: value.banner,
  };
};

const HomeScreen = () => {
  const navigate = useNavigate();
  const { p } = useSelector((state: RootState) => state.app);
  const [tab, setTab] = useState<string>("running");
  const { data: listActiveCampaigns, isLoading: isLoadingListActiveCampaign } =
    useGetListActiveCampaginQuery(
      {
        p: p,
      },
      { skip: !p }
    );
  const {
    data: listExpiredCampaigns,
    isLoading: isLoadingListExpiredCampaign,
  } = useGetListExpiredCampaginQuery(
    {
      p: p,
    },
    { skip: !p }
  );

  const others = useMemo(
    () => [...(listActiveCampaigns || []), ...(listExpiredCampaigns || [])],
    [listActiveCampaigns, listExpiredCampaigns]
  );

  const onProgramDetail = (id: string) => navigate(`/program/${id}`);

  return (
    <Box className="flex flex-col h-screen bg-gradient-to-b from-white to-neutral-50 text-neutral-900 overflow-hidden">
      {/* Sticky Header */}
      <Box className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="px-5 py-4 flex items-center gap-3 pt-14">
          <img
            src={Logo}
            alt="Mappacific"
            className="h-7 w-auto object-contain drop-shadow-sm"
          />
          <Text className="text-base font-bold tracking-wide">
            CHỌN SỐ MAY MẮN
          </Text>
        </div>
      </Box>

      <SegmentedTabs
        value={tab}
        onChange={setTab}
        tabs={[
          { key: "running", label: "Đang diễn ra" },
          { key: "ended", label: "Đã kết thúc" },
          { key: "all", label: "Tất cả" },
        ]}
      />

      {/* Main Content */}
      <Box className="flex-1 py-4 space-y-8 overflow-hidden">
        <div className="px-5">
          {/* Section Header */}
          <div className="mb-3 flex items-center justify-between">
            <Text className="text-sm font-semibold text-neutral-800">
              Danh sách chương trình
            </Text>
            <Text className="text-xs text-neutral-500">
              {others.length} mục
            </Text>
          </div>

          {/* Loading */}
          {isLoadingListActiveCampaign || isLoadingListExpiredCampaign ? (
            <div className="flex justify-center items-center h-[50vh]">
              <Spinner />
            </div>
          ) : (
            <div
              className="overflow-y-auto -mx-5 px-5 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent"
              style={{
                maxHeight: "calc(100vh - 160px)",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              {others.map((p) => (
                <CampaignCard
                  key={p.code}
                  p={dtoCampaign(p)}
                  onClick={() => onProgramDetail(p.code)}
                  className="w-full mb-3 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                />
              ))}
              <div className="h-36" />
            </div>
          )}

          {/* Empty State */}
          {!others.length &&
            !(isLoadingListActiveCampaign || isLoadingListExpiredCampaign) && (
              <Box className="mt-12 grid place-items-center text-center text-neutral-600">
                <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/80 px-6 py-12 shadow-inner">
                  <Text className="text-base font-semibold">
                    Không có chương trình phù hợp
                  </Text>
                  <Text className="mt-1 text-sm text-neutral-500">
                    Thử điều chỉnh từ khóa hoặc bộ lọc.
                  </Text>
                </div>
              </Box>
            )}
        </div>
      </Box>
    </Box>
  );
};

export default HomeScreen;
