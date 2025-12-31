// LuckyResultModal.tsx
import { useEffect, useMemo, useState } from "react";
import { Modal, Box, Text, Button, Icon } from "zmp-ui";
import RotateLuckyNumber from "./rotate-lucky-number";
import Logo from "../assets/logo.png";
import Confetti from "react-confetti-boom";
import dayjs from "dayjs";
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
  isDisabledContinue: boolean;
};

export default function LuckyResultModal({
  openedLucky,
  onClose,
  onContinue,
  result,
  isDisabledContinue,
}: Props) {
  const [audioSpinInfo, setAudioSpinInfo] = useState<HTMLAudioElement | null>(
    null
  );
  const [audioWinInfo, setAudioWinInfo] = useState<HTMLAudioElement | null>(
    null
  );

  const [toggleContinue, setToggleContinue] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const timeText = useMemo(() => {
    const d = dayjs(result.time);
    return d.isValid()
      ? d.format("DD/MM/YYYY HH:mm:ss")
      : dayjs().format("DD/MM/YYYY HH:mm:ss");
  }, [result.time]);
  const spinAudio = useMemo(() => {
    const audio = new Audio("https://mps-api.vmarketing.vn/audio/spin.mp3");
    audio.preload = "auto";
    audio.currentTime = 0.02;
    return audio;
  }, []);
  const playSpinSound = () => {
    if (!audioSpinInfo) {
      setAudioSpinInfo(spinAudio);

      // Use a promise to handle the play ensures no overlap
      const playPromise = spinAudio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Playback failed:", error);
        });
      }
    } else {
      audioSpinInfo.pause();
      audioSpinInfo.currentTime = 0.02;
      audioSpinInfo.preload = "auto";
      setAudioSpinInfo(null);
    }
  };
  const playWinSound = () => {
    if (!audioWinInfo) {
      const audio = new Audio("https://mps-api.vmarketing.vn/audio/win.mp3");
      setAudioWinInfo(audio);
      audio.play().catch((error) => {
        console.log("Playback failed:", error);
      });
    } else {
      audioWinInfo.pause();
      audioWinInfo.currentTime = 0.02;
      setAudioWinInfo(null);
    }
  };
  const stopSpinSound = () => {
    if (!audioSpinInfo) {
      return;
    }
    audioSpinInfo.pause();
    audioSpinInfo.currentTime = 0.02;
    audioSpinInfo.preload = "auto";
    setAudioSpinInfo(null);
  };
  const stopWinSound = () => {
    if (!audioWinInfo) {
      return;
    }
    audioWinInfo.pause();
    audioWinInfo.currentTime = 0;
    setAudioWinInfo(null);
  };
  useEffect(() => {
    if (!openedLucky) {
      stopSpinSound();
      setRevealed(false);
      setToggleContinue(true);
    } else {
      playSpinSound();
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
          <Box className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="relative h-20 w-20 rounded-full bg-white shadow-[0_6px_25px_rgba(0,0,0,0.1)] ring-2 ring-green-600 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-white/60" />
              <img
                src={Logo}
                alt="Logo"
                className="relative w-20 object-contain drop-shadow-sm"
              />
            </div>
          </Box>

          <Box className="pt-14 px-5 pb-4 text-center">
            {!revealed && toggleContinue && result?.targetNumber && (
              <RotateLuckyNumber
                targetNumber={result.targetNumber}
                openedLucky={openedLucky}
                onComplete={() => {
                  setRevealed(true);
                  stopSpinSound();
                  playWinSound();
                }}
              />
            )}
            {revealed && (
              <div className="flex flex-col items-center justify-center space-y-4 animate-zoom-in">
                <div className="relative inline-block">
                  <div className="absolute -inset-6 rounded-full bg-amber-300/25 blur-3xl" />
                  <div className="px-8 py-4">
                    <span className="font-manrope text-9xl sm:text-8xl font-bold tracking-widest bg-gradient-to-b from-amber-600 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
                      {String(result.targetNumber)}
                    </span>
                  </div>
                </div>

                <Text className="text-lg font-semibold text-amber-600 animate-fade-in">
                  🎉 Số may mắn của bạn là {result.targetNumber}!
                </Text>
              </div>
            )}

            {result.programTitle && (
              <Text className="mt-1 text-xs text-gray-500">
                {result.programTitle}
              </Text>
            )}
            {revealed && result?.prizeImage && (
              <Box
                className={`mt-5 flex items-center justify-center gap-3  transition-all duration-500`}
              >
                {result.prizeImage ? (
                  <img
                    src={result.prizeImage}
                    className="ring-2 w-16 rounded-sm object-cover ring-amber-400"
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
            )}

            {revealed && (
              <Box className="mt-5 grid grid-cols-2 gap-3">
                <Button
                  variant="tertiary"
                  className="!border !border-gray-200 !bg-white text-black hover:!bg-gray-50"
                  onClick={() => {
                    onClose();
                    stopWinSound();
                  }}
                >
                  Đóng
                </Button>
                <Button
                  disabled={isDisabledContinue}
                  variant="primary"
                  className={`${
                    !isDisabledContinue
                      ? "!bg-amber-500 !text-white"
                      : "!bg-gray-400 !text-black"
                  }`}
                  onClick={() => {
                    playSpinSound();
                    setRevealed(false);
                    setToggleContinue(false);
                    setTimeout(() => {
                      setToggleContinue(true);
                    }, 100);
                    onContinue?.();
                    stopWinSound();
                  }}
                >
                  Quay tiếp
                </Button>
              </Box>
            )}

            {!revealed && (
              <Box className="mt-4 flex items-center justify-center gap-1 text-amber-600">
                <Text className="text-xs font-medium">
                  {!revealed
                    ? "🎡 Đang chọn số..."
                    : result.prizeImage
                    ? "🎉 Xin chúc mừng! Bạn đã trúng thưởng thật tuyệt vời!"
                    : "✨ Số may mắn của bạn đã được bật mí hãy cùng chờ kết quả nhé!"}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        {revealed && <Confetti particleCount={100} />}
      </Box>
    </Modal>
  );
}
