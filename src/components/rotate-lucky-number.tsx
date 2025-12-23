import { useEffect, useState } from "react";
import DigitReel from "./digit-flip";

type RotateLuckyNumberProps = {
  targetNumber: number;
  openedLucky: boolean;
  onComplete: () => void;
};
const RotateLuckyNumber = ({
  targetNumber,
  openedLucky,
  onComplete,
}: RotateLuckyNumberProps) => {
  const [play, setPlay] = useState(false);
  const [stopNumbers, setStopNumbers] = useState<number[]>([]);
  const [active, setActive] = useState<boolean[]>(Array(6).fill(true));
  const toggleOne = (i: number) => {
    setActive((prev) => {
      const next = [...prev];
      next[i] = !next[i]; // true => spin, false => stop
      return next;
    });

    // optional: choose a random stop number when stopping
    setStopNumbers((prev) => {
      const next = [...prev];
      if (active[i]) next[i] = Math.floor(Math.random() * 10);
      return next;
    });
  };
  const stopAll = () => {
    setActive(Array(3).fill(false));
  };
  useEffect(() => {
    if (openedLucky) {
      setPlay(false);
      setTimeout(() => {
        setPlay(true);
        setTimeout(() => {
          stopAll();
          onComplete();
        }, 1000);
      }, 100);
    } else {
      setPlay(false);
    }
  }, [openedLucky]);

  useEffect(() => {
    if (play) {
      setActive(Array(3).fill(true));
    }
  }, [play]);
  useEffect(() => {
    setStopNumbers(
      targetNumber
        .toString()
        .padStart(3, "0")
        .split("")
        .map((item) => +item)
    );
  }, [targetNumber]);
  return (
    <div className="flex gap-1 items-center justify-center mt-3">
      {play &&
        stopNumbers?.length > 0 &&
        active.map((isActive, i) => (
          <DigitReel
            key={i}
            active={isActive}
            stopNumber={stopNumbers[i]}
            size={120}
            speed={700 + i * 80}
            extraTurns={2}
            onClick={() => toggleOne(i)}
          />
        ))}
    </div>
  );
};

export default RotateLuckyNumber;
