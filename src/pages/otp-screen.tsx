import { useState, useEffect } from "react";
import { Page, Box, Button, Text, Input, useNavigate } from "zmp-ui";

const OtpScreen = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto focus next
      if (value && index < otp.length - 1) {
        const next = document.getElementById(`otp-${index + 1}`);
        next?.focus();
      }
    }
  };

  const code = otp.join("");

  return (
    <Page className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-100 via-green-50 to-amber-50 text-neutral-900">
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-emerald-200/70 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl animate-pulse [animation-duration:3s]" />

      <Box className="relative z-10 flex min-h-screen flex-col">
        <Box className="flex flex-1 items-center justify-center px-6">
          <Box className="w-full max-w-[400px]">
            <Box className="rounded-3xl bg-white/80 backdrop-blur-md shadow-xl ring-1 ring-white/60 p-8 sm:p-10 text-center">
              <Text className="text-lg sm:text-xl font-semibold">
                Nhập mã OTP
              </Text>
              <Text className="text-xs text-neutral-500 mt-1">
                Chúng tôi đã gửi mã xác thực đến số điện thoại của bạn
              </Text>

              {/* OTP inputs */}
              <Box className="flex justify-center gap-1 mt-6">
                {otp.map((d, i) => (
                  <Input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    value={d}
                    maxLength={1}
                    onChange={(e) => handleChange(e.target.value, i)}
                    className="w-12 h-14 text-center rounded-xl text-lg font-semibold shadow-sm focus:ring-2 focus:ring-emerald-400"
                  />
                ))}
              </Box>

              {/* Confirm */}
              <Button
                disabled={code.length < 6}
                className={`h-12 w-full mt-6 rounded-xl text-white font-semibold shadow-lg active:scale-[0.99] transition
                  ${
                    code.length === 6
                      ? "bg-gradient-to-r from-emerald-500 to-amber-400 hover:opacity-95"
                      : "bg-neutral-300"
                  }`}
                onClick={() => navigate("/home")}
              >
                Xác nhận
              </Button>

              {/* Resend */}
              <Box className="mt-5 text-sm text-neutral-500">
                {timer > 0 ? (
                  <span>Gửi lại mã sau {timer}s</span>
                ) : (
                  <button
                    onClick={() => setTimer(60)}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    Gửi lại OTP
                  </button>
                )}
              </Box>
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

export default OtpScreen;
