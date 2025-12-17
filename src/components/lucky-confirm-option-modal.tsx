import { useState } from "react";
import { Modal, Box, Button, Text, Icon } from "zmp-ui";
import { Sparkles, Dice5, X, XIcon } from "lucide-react";

export default function LuckyOptionModal({
  opened,
  onConfirm,
  onClose,
}: {
  opened: boolean;
  onConfirm: (type: "single" | "all") => void;
  onClose: () => void;
}) {
  const [loadingType, setLoadingType] = useState<"single" | "all" | null>(null);

  const handleConfirm = async (type: "single" | "all") => {
    setLoadingType(type);
    await new Promise((r) => setTimeout(r, 500));
    onConfirm(type);
    setLoadingType(null);
  };

  return (
    <Modal
      visible={opened}
      onClose={onClose}
      maskClosable
      className="!rounded-3xl !overflow-hidden"
      modalClassName="bg-transparent"
    >
      <Box className="relative p-6 text-center rounded-lg overflow-hidden">
        {/* Background gradient Tết */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D6252C] via-[#E93E1E] to-[#F78B3D]" />
        <div className="absolute inset-0 bg-[url('https://png.pngtree.com/thumb_back/fw800/background/20231226/pngtree-red-vietnamese-tet-background-image_13881309.png')] opacity-15 bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/10" />
        <div
          className="absolute top-1 right-1 z-50 pointer-events-auto"
          onClick={onClose}
        >
          <XIcon color="white" width={24} height={24} />
        </div>
        <div className="relative z-10 text-white">
          <Text className="text-lg font-bold tracking-wide">
            Chọn cách tham gia
          </Text>
          <Text className="mt-1 text-sm text-white/90">
            Hãy chọn cách bạn muốn chọn số may mắn hôm nay!
          </Text>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={() => handleConfirm("single")}
              loading={loadingType === "single"}
              prefixIcon={<Dice5 size={18} />}
              className="h-12 w-full rounded-full bg-white text-[#B50000] font-semibold shadow-md hover:bg-white/95 flex items-center justify-center gap-2"
            >
              Chọn từng số
            </Button>

            <Button
              onClick={() => handleConfirm("all")}
              loading={loadingType === "all"}
              prefixIcon={<Sparkles size={18} />}
              className="h-12 w-full rounded-full bg-[#FFD600] text-[#7A1A00] font-bold shadow-lg hover:bg-[#ffde4d] flex items-center justify-center gap-2"
            >
              Chọn tất cả
            </Button>
          </div>

          <div className="mt-5 text-xs text-white/80">
            <p>Mỗi người chơi có số lượt giới hạn. Hãy chọn thật may mắn!</p>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
