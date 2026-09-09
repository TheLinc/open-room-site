"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Marks its child in view once, so sections rise as they are read. Renders
// visible by default: without JavaScript or under reduced motion nothing is
// hidden.
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.inview = "false";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.inview = "true";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Component = Tag as "div";
  return (
    <Component
      ref={ref as never}
      className={`rise ${className}`}
      style={{ "--rise-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
