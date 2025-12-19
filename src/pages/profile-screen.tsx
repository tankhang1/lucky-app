import { Globe, PhoneCall, Mailbox } from "lucide-react";
import { Box, Text, Avatar, Header, Stack, Spinner } from "zmp-ui";
import { followOA, openPhone, openWebview } from "zmp-sdk";
import { useGetZaloInfoQuery } from "@/redux/api/auth/auth.api";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useMemo } from "react";

export default function ProfileScreen() {
  const { userId } = useSelector((state: RootState) => state.app);

  const { data: info, isLoading } = useGetZaloInfoQuery({
    z: userId,
  });
  const profile = useMemo(
    () => ({
      name: info?.name || "-",
      phone: info?.phone || "-",
      address: info?.province || "",
      group: info?.group || "-",
      avatar:
        info?.avatar ||
        "https://us.123rf.com/450wm/salamatik/salamatik1801/salamatik180100019/92979836-perfil-an%C3%B4nimo-rosto-%C3%ADcone-pessoa-silhueta-cinza-avatar-padr%C3%A3o-masculino-foto-espa%C3%A7o-reservado.jpg?ver=6",
      website: "https://mappacific.com",
      zaloOALink: "https://zalo.me/1234567890",
      location: "VNTT",
      area: info?.are || "-",
    }),
    [info]
  );
  const onOpenPhone = async () => {
    await openPhone({
      phoneNumber: "1900 4352",
    });
  };
  const openZaloOA = async () => {
    await followOA({
      id: "4030379023193575870",
    });
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-white to-emerald-50 text-neutral-900">
      <Header
        title="Thông tin cá nhân"
        className="text-center  relative"
        showBackIcon={false}
      />
      {isLoading ? (
        <Box className="flex justify-center items-center">
          <Spinner />
        </Box>
      ) : (
        <Box className="mx-4 mt-5 rounded-2xl bg-white shadow-md ring-1 ring-neutral-200 p-5">
          <Box className="flex flex-col items-center text-center">
            <Avatar
              src={profile.avatar}
              className="h-20 w-20 mb-10 rounded-full ring-4 ring-emerald-200 shadow-md"
            />
          </Box>

          {/* Thông tin dạng 2 cột */}
          <Box className="space-y-4 w-full">
            <Stack className="flex flex-row items-center justify-between">
              <Text className="text-sm text-neutral-500 font-medium">Tên</Text>
              <Text className="text-base font-semibold text-neutral-800">
                {profile.name}
              </Text>
            </Stack>

            <Stack className="flex flex-row items-center justify-between">
              <Text className="text-sm text-neutral-500 font-medium">
                Số điện thoại
              </Text>
              <Text className="text-base text-neutral-800">
                {profile.phone}
              </Text>
            </Stack>
            <Stack className="flex flex-row items-center justify-between">
              <Text className="text-sm text-neutral-500 font-medium">Nhóm</Text>
              <Text className="text-base text-neutral-800">
                {profile.group}
              </Text>
            </Stack>
            <Stack className="flex flex-row items-center justify-between">
              <Text className="text-sm text-neutral-500 font-medium">Vùng</Text>
              <Text className="text-base text-neutral-800">{profile.area}</Text>
            </Stack>
            <Stack className="flex flex-row items-center justify-between">
              <Text className="text-sm text-neutral-500 font-medium">
                Địa chỉ
              </Text>
              <Text className="text-base text-neutral-800">
                {profile.address}
              </Text>
            </Stack>
          </Box>

          <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

          {/* 3 nút hành động */}
          <Box className="flex items-center justify-around">
            <Box className="flex flex-col justify-center items-center gap-1">
              <Box
                onClick={() => openWebview({ url: profile.website })}
                className="w-12 h-12 bg-[#009345] inline-flex justify-center items-center rounded-full shadow-md ring-2 ring-emerald-200/50"
              >
                <Globe color="white" size={20} />
              </Box>
              <Text className="text-xs text-neutral-700 font-medium">
                Website
              </Text>
            </Box>

            <Box className="flex flex-col justify-center items-center gap-1">
              <Box
                onClick={onOpenPhone}
                className="w-12 h-12 bg-[#009345] inline-flex justify-center items-center rounded-full shadow-md ring-2 ring-emerald-200/50"
              >
                <PhoneCall color="white" size={20} />
              </Box>
              <Text className="text-xs text-neutral-700 font-medium">
                Hỗ trợ
              </Text>
            </Box>

            <Box className="flex flex-col justify-center items-center gap-1">
              <Box
                onClick={openZaloOA}
                className="w-12 h-12 bg-[#009345] inline-flex justify-center items-center rounded-full shadow-md ring-2 ring-emerald-200/50"
              >
                <Mailbox color="white" size={20} />
              </Box>
              <Text className="text-xs text-neutral-700 font-medium">
                Zalo OA
              </Text>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
