"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function ZoomSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setActive(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0.01,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={(node) => {
        ref.current = node;
      }}
      className={cn(
        "transform-gpu transition-[transform,opacity,filter] duration-500 ease-out",
        "motion-reduce:transform-none motion-reduce:transition-none",
        active ? "scale-[1.02] opacity-100" : "scale-[0.985] opacity-95",
        className,
      )}
    >
      {children}
    </section>
  );
}

