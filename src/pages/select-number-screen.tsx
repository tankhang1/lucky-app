import {
  Box,
  Text,
  useParams,
  useNavigate,
  Modal,
  Stack,
  Button,
} from "zmp-ui";
import { useMemo, useState } from "react";
import Logo from "@/assets/logo.png";
import {
  useGetCampaignDetailQuery,
  useGetListResultNumberQuery,
  useRequestLuckNumberMutation,
} from "@/redux/api/campaign/campaign.api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import LuckyResultModal from "@/components/lucky-result-modal";
import ListLuckyResultModal from "@/components/lucky-list-result-modal";
import { TLuckResultItem } from "@/redux/api/campaign/campaign.response";
import LuckConfirmModal from "@/components/lucky-confirm-modal";
import { Gift } from "lucide-react";

type TNum = { isWin: boolean; number: number };

const Circle = ({ n }: { n: TNum }) => (
  <div
    className={[
      "relative flex items-center justify-center h-12 w-12 rounded-full text-sm font-semibold shadow-sm border transition-all",
      n.number === -1
        ? "bg-neutral-100 text-neutral-400 border-neutral-200"
        : n.isWin
        ? "bg-emerald-500 text-white border-emerald-500"
        : "bg-white text-neutral-700 border-neutral-200",
    ].join(" ")}
  >
    {n.number === -1 ? "?" : n.number}
    {n.isWin && (
      <span className="absolute -top-1 -right-1 rounded-full bg-amber-500 p-1.5 shadow">
        <Gift size={12} />
      </span>
    )}
  </div>
);

const SkeletonDot = () => (
  <div className="h-12 w-12 rounded-full bg-neutral-100 animate-pulse" />
);

const SelectNumberScreen = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { p, userId } = useSelector((state: RootState) => state.app);

  const [openConfirmRequestAllModal, setOpenConfirmRequestAllModal] =
    useState(false);

  const { data: programDetail, isLoading: isLoadingProgramDetail } =
    useGetCampaignDetailQuery(
      { c: id || "", p },
      {
        skip: !id || !p,
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
    { c: id || "", p },
    {
      skip: !id || !p,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const [resultLuckyNumber, setResultLuckyNumber] = useState<TLuckResultItem>();
  const [listResultLuckyNumber, setListResultLuckyNumber] = useState<
    TLuckResultItem[]
  >([]);
  const [openedLucky, setOpenedLucky] = useState(false);
  const [openedListLucky, setOpenedListLucky] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [openedConfirmModal, setOpenedConfirmModal] = useState(false);
  const [requestLuckNumber, { isLoading: loadingOne }] =
    useRequestLuckNumberMutation();
  const [requestAllLuckNumber, { isLoading: loadingAll }] =
    useRequestLuckNumberMutation();

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
        setOpenedLucky(true);
        refetchListResult();
      })
      .catch((error) => {
        setMessageError(error.data.message);
      });
  };

  const onRandomAll = async () => {
    setOpenConfirmRequestAllModal(false);
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

  const get = programDetail?.number_get ?? 0;
  const limit = programDetail?.number_limit ?? 0;
  const pct = limit ? Math.round((get / limit) * 100) : 0;

  const numbers = useMemo<TNum[]>(
    () => [
      ...(listResult ?? []).map((item) => ({
        isWin: Boolean(item.gift_name || item.gift_image || item.award_name),
        number: Number(item.number),
      })),
      ...Array.from({ length: Math.max(0, limit - get) }).map(() => ({
        isWin: false,
        number: -1,
      })),
    ],
    [listResult, get, limit]
  );

  const busy = loadingOne || loadingAll || isLoadingListResult;

  return (
    <Box className="flex h-screen flex-col bg-gradient-to-b from-white to-neutral-50 text-neutral-900 overflow-hidden">
      <Box className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="px-5 py-4 pt-14 flex items-center gap-3">
          <img src={Logo} alt="Logo" className="h-7 w-auto object-contain" />
          <Text className="text-base font-bold tracking-wide">
            CHỌN SỐ MAY MẮN
          </Text>
        </div>
        <div className="px-5 pb-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-neutral-500">Tiến độ</p>
              <p className="text-sm font-semibold">
                {get}
                <span className="mx-1 text-neutral-400">/</span>
                {limit} đã chọn
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              {pct}% hoàn thành
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </Box>

      <Box className="flex-1 overflow-auto">
        <div className="px-5 pb-56">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium mt-4">Danh sách số</p>
            <p className="text-xs text-neutral-500">
              {numbers.filter((n) => n.number !== -1).length} số đã chọn
            </p>
          </div>

          {isLoadingProgramDetail ? (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <SkeletonDot key={i} />
              ))}
            </div>
          ) : (
            <div
              className={`transition-all grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7 ${
                openedLucky ? "opacity-0" : ""
              }`}
            >
              {numbers.map((n, i) => (
                <Circle key={`${n.number}-${i}`} n={n} />
              ))}
            </div>
          )}
        </div>
      </Box>

      <Box className="fixed bottom-[100px] inset-x-0 z-40">
        <div className="mx-auto max-w-screen-sm">
          <div
            className="flex items-center justify-around gap-2 px-4 py-3"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <button
              onClick={() => setOpenConfirmRequestAllModal(true)}
              disabled={busy || get >= limit}
              className="rounded-full w-20 h-20 border border-[#009345] bg-white px-3 py-3 text-sm font-semibold text-[#009345] hover:bg-emerald-50 disabled:opacity-50"
            >
              {loadingAll ? "Đang chọn..." : "Chọn tất cả"}
            </button>
            <button
              onClick={onRandomSingle}
              disabled={busy || get >= limit}
              className="rounded-full w-24 h-24 bg-[#009345] px-3 py-3 text-sm font-semibold text-white shadow hover:brightness-105 active:scale-[0.99] disabled:opacity-50 whitespace-pre-line"
            >
              {loadingOne ? "Đang chọn…" : "Chọn\từng số"}
            </button>

            <button
              onClick={() => setOpenedConfirmModal(true)}
              disabled={busy}
              className="rounded-full w-20 h-20 border border-neutral-200 bg-white px-3 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 justify-center items-center"
            >
              Thoát
            </button>
          </div>
        </div>
      </Box>

      {openedConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
          <div className="w-full sm:w-[380px] rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-lg">
            <p className="text-base font-semibold">Thoát khỏi trang?</p>
            <p className="mt-1 text-sm text-neutral-600">
              Tiến trình chọn số vẫn được lưu.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setOpenedConfirmModal(false)}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Ở lại
              </button>
              <button
                onClick={() => nav(-1)}
                className="rounded-xl bg-[#009345] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-105"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
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
        isLoading={isLoadingListResult}
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
      <LuckConfirmModal
        opened={openConfirmRequestAllModal}
        onClose={() => setOpenConfirmRequestAllModal(false)}
        onConfirm={onRandomAll}
      />
    </Box>
  );
};

export default SelectNumberScreen;
