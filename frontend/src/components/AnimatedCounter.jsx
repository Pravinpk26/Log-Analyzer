import { useEffect, useState } from "react";

export default function AnimatedCounter({
  value,
  duration = 1200,
}) {

  const [count, setCount] = useState(0);

  useEffect(() => {

    let start = 0;

    const end = Number(value);

    if (start === end) return;

    const increment = end / (duration / 16);

    const timer = setInterval(() => {

      start += increment;

      if (start >= end) {

        start = end;

        clearInterval(timer);

      }

      setCount(Math.floor(start));

    }, 16);

    return () => clearInterval(timer);

  }, [value, duration]);

  return (
    <>{count}</>
  );
}