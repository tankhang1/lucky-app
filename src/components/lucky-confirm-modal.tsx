import { Box, Button, Modal, Text } from "zmp-ui";
type Props = {
  // Define any props if needed
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
const LuckConfirmModal = ({ opened, onClose, onConfirm }: Props) => {
  return (
    <Modal visible={opened} onClose={onClose}>
      <Box className="px-5 pb-4 text-center">
        <img
          src="https://www.bingoblitz.com/wp-content/uploads/2023/08/Lucky_number_logo.png"
          className="mx-auto mb-4"
        />
        <Text className="text-lg sm:text-xl font-semibold">
          Xác nhận chọn số
        </Text>
        <Text className="text-xs text-neutral-500 mt-1">
          Bạn có chắc chắn muốn chọn số không?
        </Text>

        <Box className="mt-5 flex items-center justify-center gap-3">
          <Button
            className="h-10 rounded-xl text-white font-semibold shadow-lg active:scale-[0.99] transition bg-gradient-to-r from-emerald-500 to-amber-400 hover:opacity-95"
            onClick={() => {
              onConfirm();
            }}
          >
            Xác nhận
          </Button>
          <Button
            className="h-10 px-4 rounded-xl text-neutral-700 font-semibold shadow-lg active:scale-[0.99] transition bg-neutral-200 hover:bg-neutral-300"
            onClick={() => {
              onClose();
            }}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LuckConfirmModal;
