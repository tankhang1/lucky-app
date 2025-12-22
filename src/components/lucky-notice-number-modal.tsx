import { Modal, Box, Text } from "zmp-ui";
import Logo from "../assets/logo.png";
import { X } from "lucide-react";

type Props = {
  openedLucky: boolean;
  count: number;
  onClose: () => void;
  programName: string;
};

export default function LuckyNoticeNumberModal({
  openedLucky,
  count,
  programName,
  onClose,
}: Props) {
  return (
    <Modal
      visible={openedLucky}
      onClose={onClose}
      maskClosable={true}
      modalClassName="bg-transparent w-full flex items-center justify-center px-4"
    >
      {/* Main Card */}
      <Box className="relative w-full max-w-[320px] rounded-3xl bg-white shadow-2xl overflow-visible mt-10">
        {/* Background Decor: Golden Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl z-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 -right-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30" />
        </div>

        {/* 1. Logo Section (Popping out of the card) */}
        <Box className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
          <div className="relative h-20 w-20 rounded-full bg-white shadow-[0_6px_25px_rgba(0,0,0,0.1)] ring-2 ring-green-600 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-white/60" />
            <img
              src={Logo}
              alt="Logo"
              className="relative w-20 object-contain drop-shadow-sm"
            />
          </div>
        </Box>
        <button
          className="absolute z-50 top-3 right-3 text-amber-500"
          onClick={onClose}
        >
          <X />
        </button>
        {/* 2. Main Content */}
        <Box className="relative z-10 pt-16 pb-6 px-3 flex flex-col items-center text-center space-y-2">
          {/* Main Title with Gradient */}
          <Text className="text-xl font-bold text-amber-500 tracking-wider text-[10px]">
            {`Hãy chọn ${count} số may mắn của bạn. Nhấn "Tham gia chọn số" để bắt đầu`}
          </Text>

          {/* 3. Footer: Program Name */}
          <Box className="w-full border-t border-dashed border-gray-200 pt-4">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              CHƯƠNG TRÌNH
            </Text>
            <Text className="text-xs font-semibold text-gray-700 leading-snug line-clamp-2 px-2">
              {programName}
            </Text>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
