import { Page, Box, Button, Text, useNavigate } from "zmp-ui";

const SplashScreen = () => {
  const navigate = useNavigate();
  const onHomeScreen = () => {
    navigate("/home");
  };
  return (
    <Page className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-100 via-green-50 to-amber-50 text-neutral-900">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-emerald-200 blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-amber-200 blur-3xl opacity-50" />

      <Box className="relative z-10 flex min-h-screen flex-col">
        <Box className="flex flex-1 items-center justify-center px-6">
          <Box className="w-full max-w-[440px]">
            <Box className="rounded-3xl bg-white shadow-lg p-8 text-center">
              <img
                src="https://www.mappacific.com/wp-content/uploads/2021/08/logo.png"
                alt="Mappacific Logo"
                className="mx-auto mb-6 h-24 w-auto object-contain"
              />

              <Text className="text-2xl font-bold text-emerald-700 mb-2">
                Mappacific Singapore
              </Text>
              <Text className="mx-auto max-w-xs text-sm leading-relaxed text-neutral-600">
                Nông nghiệp bền vững · Nông nghiệp xanh · Giúp người nông dân
              </Text>

              <Box className="mt-5 flex items-center justify-center gap-2 text-xs">
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-600">
                  Hôm nay • 09:00–22:00
                </span>
                <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-600">
                  Còn 120 suất
                </span>
              </Box>

              <Button
                onClick={onHomeScreen}
                className="mt-7 h-12 w-52 rounded-full text-white font-semibold bg-gradient-to-r from-emerald-500 to-amber-400 shadow-md hover:opacity-95 active:scale-95 transition"
              >
                Tham gia ngay
              </Button>
            </Box>
          </Box>
        </Box>

        <Box className="px-4 py-4 text-center text-xs text-neutral-500">
          © 2025 Mappacific Singapore. All rights reserved.
        </Box>
      </Box>
    </Page>
  );
};

export default SplashScreen;
