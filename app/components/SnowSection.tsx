"use client";

import { useEffect, useState } from "react";

type Snowflake = {
  left: string;
  delay: string;
  duration: string;
};

export default function SnowSection() {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 80 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${5 + Math.random() * 10}s`,
    }));

    setFlakes(generated);
  }, []);

  // ⛔ Prevent server/client mismatch
  if (flakes.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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