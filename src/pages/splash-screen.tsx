import { Phone, ShieldCheck, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { authorize } from "zmp-sdk";
import { Page, Box, Button, Text, useNavigate, Input } from "zmp-ui";

const isValidVNPhone = (v: string) => /^(\d){9,11}$/.test(v.replace(/\D/g, ""));

const SplashScreen = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const canSubmit = useMemo(() => isValidVNPhone(phone), [phone]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/otp");
    }, 600);
  };
  const onLoginWithZalo = async () => {
    // const data = await authorize({
    //   scopes: ["scope.userLocation", "scope.userPhonenumber"],
    // });
    // if (data["scope.userLocation"] && data["scope.userPhonenumber"]) {
    //   navigate("/home");
    // } else {
    //   alert("Bạn cần cấp quyền để tiếp tục");
    // }
    navigate("/home");
  };

  return (
    <Page className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-100 via-green-50 to-amber-50 text-neutral-900">
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-emerald-200/70 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl animate-pulse [animation-duration:3s]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />

      <Box className="relative z-10 flex min-h-screen flex-col">
        <Box className="flex flex-1 items-center justify-center px-5">
          <Box className="w-full max-w-[480px]">
            <Box className="relative p-[2px] rounded-3xl bg-gradient-to-br from-white/70 via-emerald-200/60 to-amber-200/60">
              <Box className="rounded-3xl bg-white/80 backdrop-blur-md shadow-xl ring-1 ring-white/60 p-8 sm:p-10">
                <Box className="flex flex-col items-center gap-3">
                  <img
                    src="https://www.mappacific.com/wp-content/uploads/2021/08/logo.png"
                    alt="Mappacific"
                    className="mx-auto h-16 sm:h-20 w-auto object-contain"
                  />
                  <Text className="text-lg sm:text-2xl font-semibold tracking-tight">
                    Mappacific Portal
                  </Text>
                  <Text className="text-xs text-neutral-500">
                    Đăng nhập để tiếp tục trải nghiệm
                  </Text>
                </Box>

                <Box className="mt-6 space-y-4">
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại"
                    label="Số điện thoại"
                    prefix={<span className="ml-4 text-neutral-400">+84</span>}
                    className="h-12 rounded-xl"
                  />
                  <Button
                    disabled={!canSubmit || loading}
                    loading={loading}
                    onClick={onSubmit}
                    className={`h-12 w-full rounded-xl text-white font-semibold shadow-lg active:scale-[0.99] transition
                      ${
                        canSubmit
                          ? "bg-gradient-to-r from-emerald-500 to-amber-400 hover:opacity-95"
                          : "bg-neutral-300"
                      }`}
                    prefixIcon={<Phone className="mr-2 h-5 w-5" />}
                  >
                    Đăng nhập bằng OTP
                  </Button>
                </Box>

                <Box className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                  <span className="text-[11px] text-neutral-500">hoặc</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
                </Box>

                <Button
                  onClick={onLoginWithZalo}
                  className="h-12 w-full rounded-xl font-semibold bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50 shadow"
                  prefixIcon={
                    <img
                      src="https://hidosport.vn/wp-content/uploads/2023/09/zalo-icon.png"
                      alt="Zalo"
                      className="h-5 w-5"
                    />
                  }
                >
                  Đăng nhập với Zalo
                </Button>

                <Box className="mt-6 grid grid-cols-2 gap-3 text-[11px] text-neutral-500">
                  <Box className="flex items-center justify-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 ring-1 ring-neutral-200">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Mã OTP bảo mật</span>
                  </Box>
                  <Box className="flex items-center justify-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 ring-1 ring-neutral-200">
                    <Lock className="h-4 w-4" />
                    <span>Bảo vệ dữ liệu</span>
                  </Box>
                </Box>

                <Box className="mt-6 text-center">
                  <Text className="text-[11px] leading-snug text-neutral-500">
                    Bằng việc tiếp tục, bạn đồng ý với{" "}
                    <a
                      href="#"
                      className="text-emerald-600 underline underline-offset-2"
                    >
                      Điều khoản
                    </a>{" "}
                    và{" "}
                    <a
                      href="#"
                      className="text-emerald-600 underline underline-offset-2"
                    >
                      Chính sách bảo mật
                    </a>
                    .
                  </Text>
                </Box>
              </Box>
            </Box>

            <Box className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <span>© 2025 Mappacific Singapore</span>
              <span>•</span>
              <span>All rights reserved</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default SplashScreen;
