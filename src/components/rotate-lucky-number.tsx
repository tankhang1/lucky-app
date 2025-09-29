import { useEffect, useState } from "react";
import FlipNumbers from "react-flip-numbers";

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
  useEffect(() => {
    if (openedLucky) {
      setPlay(false);
      setTimeout(() => {
        setPlay(true);
        setTimeout(() => {
          onComplete();
        }, 20000);
      }, 100);
    } else {
      setPlay(false);
    }
  }, [openedLucky]);
  return (
    <FlipNumbers
      height={40}
      width={40}
      color="black"
      background="white"
      play={play}
      perspective={600}
      duration={play ? 30 : 0}
      numbers={play ? String(targetNumber) : "00000"}
      numberClassName="mt-1 text-3xl font-extrabold tracking-tight"
    />
  );
};

export default RotateLuckyNumber;
