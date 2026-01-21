"use client";

import { useEffect, useState } from "react";

type Snowflake = {
  left: string;
  delay: string;
  duration: string;
};

export default function Snow() {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 80 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
    }));

    setFlakes(generated);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {flakes.map((flake, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
          }}
        />
      ))}
    </div>
  );
}