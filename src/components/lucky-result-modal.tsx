// LuckyResultModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Box, Text, Button, Icon, Avatar } from "zmp-ui";
import RotateLuckyNumber from "./rotate-lucky-number";
import Gift from "../assets/gift.png";
import Confetti from "react-confetti-boom";
type LuckyResult = {
  targetNumber: number;
  prizeLabel: string;
  prizeImage?: string;
  programTitle?: string;
  winnerName?: string;
  winnerPhone: string;
  time?: string; // ISO string
  code?: string; // mã lượt quay / ticket
};

type Props = {
  openedLucky: boolean;
  onClose: () => void;
  onContinue?: () => void;
  result: LuckyResult;
  isDisabledContinue: boolean;
};

export default function LuckyResultModal({
  openedLucky,
  onClose,
  onContinue,
  result,
  isDisabledContinue,
}: Props) {
  const [toggleContinue, setToggleContinue] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const timeText = useMemo(() => {
    if (!result.time) return new Date().toLocaleString();
    const d = new Date(result.time);
    return d.toLocaleString();
  }, [result.time]);

  useEffect(() => {
    if (!openedLucky) {
      setRevealed(false);
      setToggleContinue(true);
    }
  }, [openedLucky]);
  return (
    <Modal
      visible={openedLucky}
      onClose={() => {
        onClose();
        setRevealed(false);
      }}
      maskClosable
      modalClassName="bg-transparent w-full"
    >
      <Box>
        <Box className="mx-auto w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <Box className="absolute top-1 z-50 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg">
            <img src={Gift} alt="Gift" className="h-12 w-12" />
          </Box>

          <Box className="pt-14 px-5 pb-4 text-center">
            {!revealed && toggleContinue && result?.targetNumber && (
              <RotateLuckyNumber
                targetNumber={result.targetNumber}
                openedLucky={openedLucky}
                onComplete={() => setRevealed(true)}
              />
            )}
            {revealed && (
              <div className="flex flex-col items-center justify-center space-y-4 animate-zoom-in">
                <div className="relative inline-block">
                  <div className="absolute -inset-6 rounded-full bg-amber-300/25 blur-3xl" />
                  <div className="px-8 py-4">
                    <span className="font-mono text-7xl sm:text-8xl font-bold tracking-widest bg-gradient-to-b from-amber-600 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
                      {String(result.targetNumber).padStart(5, "0")}
                    </span>
                  </div>
                </div>

                <Text className="text-lg font-semibold text-amber-600 animate-fade-in">
                  🎉 Số may mắn của bạn là {result.targetNumber}!
                </Text>
              </div>
            )}

            {result.programTitle && (
              <Text className="mt-1 text-xs text-gray-500">
                {result.programTitle}
              </Text>
            )}
            {revealed && result?.prizeImage && (
              <Box
                className={`mt-5 flex items-center justify-center gap-3  transition-all duration-500`}
              >
                {result.prizeImage ? (
                  <img
                    src={result.prizeImage}
                    className="ring-2 w-16 rounded-sm object-cover ring-amber-400"
                  />
                ) : (
                  <Box className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center ring-2 ring-amber-400">
                    <Icon icon="zi-star" className="text-amber-600 text-xl" />
                  </Box>
                )}

                <Box className="text-left">
                  <Text className="text-base font-semibold">
                    {result.prizeLabel}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {result.code ? `Mã lượt: ${result.code} • ` : ""}
                    {timeText}
                  </Text>
                </Box>
              </Box>
            )}

            {revealed && (
              <Box className="mt-5 grid grid-cols-2 gap-3">
                <Button
                  variant="tertiary"
                  className="!border !border-gray-200 !bg-white text-black hover:!bg-gray-50"
                  onClick={onClose}
                >
                  Đóng
                </Button>
                <Button
                  disabled={isDisabledContinue}
                  variant="primary"
                  className={`${
                    !isDisabledContinue
                      ? "!bg-amber-500 !text-white"
                      : "!bg-gray-400 !text-black"
                  }`}
                  onClick={() => {
                    setRevealed(false);
                    setToggleContinue(false);
                    setTimeout(() => {
                      setToggleContinue(true);
                    }, 100);
                    onContinue?.();
                  }}
                >
                  Quay tiếp
                </Button>
              </Box>
            )}

            {!revealed && (
              <Box className="mt-4 flex items-center justify-center gap-1 text-amber-600">
                <Text className="text-xs font-medium">
                  {!revealed
                    ? "🎡 Đang chọn số... Hãy cùng chờ xem vận may của bạn hôm nay!"
                    : result.prizeImage
                    ? "🎉 Xin chúc mừng! Bạn đã trúng thưởng thật tuyệt vời!"
                    : "✨ Số may mắn của bạn đã được bật mí hãy cùng chờ kết quả nhé!"}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        {revealed && <Confetti particleCount={100} />}
      </Box>
    </Modal>
  );
}
