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
  queue: LuckyResult[];
};

const maskPhone = (p: string) =>
  p.replace(/(\d{3})\d+(\d{2})$/, (_, a, b) => `${a}***${b}`);

export default function ListLuckyResultModal({
  openedLucky,
  onClose,
  onContinue,
  queue,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const timeText = useMemo(() => {
    if (!queue[0].time) return new Date().toLocaleString();
    const d = new Date(queue[0].time);
    return d.toLocaleString();
  }, [queue]);
  useEffect(() => {
    if (!openedLucky) {
      setRevealed(false);
    } else {
      setTimeout(() => {
        setRevealed(true);
      }, 3000);
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

            <Box
              className={`mt-4 max-h-60 overflow-x-auto transition-all duration-500 grid grid-cols-3 justify-center ${
                revealed ? "gap-3" : "gap-0"
              }`}
            >
              {["1323", "44312", "12312", "3123", "123", "123123", "4234"].map(
                (n, i) => (
                  <Box
                    key={i}
                    className={`text-xl font-semibold text-amber-700 transition-all duration-500 ${
                      n === "44312" ? "font-black" : ""
                    }`}
                  >
                    {n}
                  </Box>
                )
              )}
            </Box>
            {queue[0].programTitle && (
              <Text className="mt-1 text-xs text-gray-500">
                {queue[0].programTitle}
              </Text>
            )}
            {revealed && (
              <Box
                className={`mt-5 flex flex-row items-center justify-center gap-4  transition-all duration-500`}
              >
                {queue[0].prizeImage ? (
                  <img
                    src={queue[0].prizeImage}
                    className="ring-2 ring-amber-400 w-16 h-16 rounded-sm"
                  />
                ) : (
                  <Icon icon="zi-photo" className="text-4xl text-amber-400" />
                )}
                <Box>
                  <Text className="text-left text-sm font-semibold text-gray-700">
                    {queue[0].prizeLabel}
                  </Text>
                  {queue[0].code && (
                    <Text className="text-left text-xs text-gray-500">
                      Mã lượt: {queue[0].code} • {timeText}
                    </Text>
                  )}
                </Box>
              </Box>
            )}
            <Box className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <Box className="flex items-center justify-center gap-2">
                <Icon icon="zi-user" className="text-gray-500 text-base" />
                <Text className="text-sm">
                  {queue[0].winnerName ? `${queue[0].winnerName} • ` : ""}
                  {maskPhone(queue[0].winnerPhone)}
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
