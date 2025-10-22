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
      modalClassName="bg-transparent w-full"
    >
      <Box>
        <Box className="mx-auto w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <Box className="absolute top-1 z-50 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg">
            <img src={Gift} alt="Gift" className="h-12 w-12" />
          </Box>

          <Box className="pt-14 px-5 pb-4 text-center">
            <Text className="text-xs uppercase tracking-widest text-amber-600">
              Kết quả chọn số
            </Text>

            <Box className="mt-4">
              {/* limit height to ~300px or fit your design */}
              <Box className="max-h-[300px] overflow-y-auto rounded-xl ring-1 ring-gray-100">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-24 px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Số may mắn
                      </th>
                      <th className="w-40 px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Giải thưởng
                      </th>
                      <th className="w-28 px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Hình
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {queue.map((item, idx) => {
                      const isNewest = idx === 0 && revealed;
                      return (
                        <tr
                          key={idx}
                          className={isNewest ? "bg-amber-50/60" : ""}
                        >
                          <td className="w-24 px-3 py-2">
                            <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                              {item.targetNumber}
                            </span>
                          </td>
                          <td className="w-40 px-3 py-2 text-sm text-gray-800 truncate">
                            {item?.prizeLabel || "Đợi kết quả"}
                          </td>
                          <td className="w-44 px-3 py-2">
                            {item.prizeImage ? (
                              <img
                                src={item.prizeImage}
                                className="w-24 rounded-sm ring-1 ring-amber-200 object-cover mx-auto"
                              />
                            ) : (
                              <Icon
                                icon="zi-photo"
                                className="text-lg text-gray-300 mx-auto"
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            </Box>
            {queue[0]?.programTitle && (
              <Text className="mt-1 text-xs text-gray-500">
                {queue[0]?.programTitle}
              </Text>
            )}

            <Box className="mt-5">
              <Button
                variant="primary"
                className="!border !border-gray-300 w-full !bg-gray-200 text-black hover:!bg-gray-50"
                onClick={onClose}
              >
                Đóng
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
