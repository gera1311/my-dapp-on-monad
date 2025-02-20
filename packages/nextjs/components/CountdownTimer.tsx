import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const CountdownTimer: React.FC = () => {
  const deadline = new Date("2025-05-06T00:00:00").getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = deadline - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": timeLeft.days } as React.CSSProperties}></span>
        </span>
        days
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": timeLeft.hours } as React.CSSProperties}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": timeLeft.minutes } as React.CSSProperties}></span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": timeLeft.seconds } as React.CSSProperties}></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default CountdownTimer;
