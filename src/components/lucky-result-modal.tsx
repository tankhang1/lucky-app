// LuckyResultModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Box, Text, Button, Icon, Avatar } from "zmp-ui";
import RotateLuckyNumber from "./rotate-lucky-number";
import Gift from "../assets/gift.png";
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
};

const maskPhone = (p: string) =>
  p.replace(/(\d{3})\d+(\d{2})$/, (_, a, b) => `${a}***${b}`);

export default function LuckyResultModal({
  openedLucky,
  onClose,
  onContinue,
  result,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const timeText = useMemo(() => {
    if (!result.time) return new Date().toLocaleString();
    const d = new Date(result.time);
    return d.toLocaleString();
  }, [result.time]);
  useEffect(() => {
    if (!openedLucky) {
      setRevealed(false);
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
      modalClassName="bg-transparent"
    >
      <Box>
        <Box className="mx-auto w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <Box className="absolute top-1 z-auto left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg">
            <img src={Gift} alt="Gift" className="h-12 w-12" />
          </Box>

          <Box className="pt-14 px-5 pb-4 text-center">
            <Text className="text-xs uppercase tracking-widest text-amber-600">
              Kết quả quay số
            </Text>

            <RotateLuckyNumber
              targetNumber={result.targetNumber}
              openedLucky={openedLucky}
              onComplete={() => setRevealed(true)}
            />
            {result.programTitle && (
              <Text className="mt-1 text-xs text-gray-500">
                {result.programTitle}
              </Text>
            )}

            <Box
              className={`mt-5 flex items-center justify-center gap-3 ${
                revealed ? "blur-none" : "blur-sm"
              } transition-all duration-500`}
            >
              {result.prizeImage ? (
                <Avatar
                  src={result.prizeImage}
                  size={56}
                  className="ring-2 ring-amber-400"
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

            <Box className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <Box className="flex items-center justify-center gap-2">
                <Icon icon="zi-user" className="text-gray-500 text-base" />
                <Text className="text-sm">
                  {result.winnerName ? `${result.winnerName} • ` : ""}
                  {maskPhone(result.winnerPhone)}
                </Text>
              </Box>
            </Box>

            <Box className="mt-5 grid grid-cols-2 gap-3">
              <Button
                variant="tertiary"
                className="!border !border-gray-200 !bg-white text-black hover:!bg-gray-50"
                onClick={onClose}
              >
                Đóng
              </Button>
              <Button
                variant="primary"
                className="!bg-amber-500 !hover:bg-amber-600"
                onClick={onContinue}
              >
                Quay tiếp
              </Button>
            </Box>

            <Box className="mt-4 flex items-center justify-center gap-1 text-amber-600">
              <Icon icon="zi-add-member" className="text-sm" />
              <Text className="text-xs">Chúc mừng bạn trúng thưởng!</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
