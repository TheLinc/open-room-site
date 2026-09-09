"use client";

import { useState } from "react";
import { CrewFace } from "@/components/crew-face";
import { ChevronIcon } from "@/components/icons";
import { copy } from "@/lib/copy";

// One answer open at a time. Buttons, not summary elements, so the open
// state is ours to control and the chevron turns smoothly.
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="mx-auto max-w-[1120px] px-6 pt-32 md:pt-40">
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="flex items-start gap-4">
          <h2 className="text-[34px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[44px]">
            {copy.faq.title}
          </h2>
          <CrewFace id="loop" size={36} className="pixel mt-1 shrink-0" />
        </div>
        <ul className="border-t border-line">
          {copy.faq.items.map((item, i) => {
            const on = i === open;
            return (
              <li key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium tracking-[-0.01em] hover:text-ink-2"
                    aria-expanded={on}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(on ? -1 : i)}
                  >
                    {item.q}
                    <ChevronIcon
                      size={16}
                      className={`shrink-0 text-muted transition-transform duration-300 ${on ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  hidden={!on && undefined}
                  aria-hidden={!on}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] pb-6 text-[15px] leading-[1.6] text-ink-2">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
