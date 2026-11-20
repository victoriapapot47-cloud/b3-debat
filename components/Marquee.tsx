"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { RELEASE_LABEL } from "@/lib/constants";

export default function Marquee() {
  const items = Array.from({ length: 6 });
  return (
    <div className="relative z-10 overflow-hidden border-y border-ink/15 py-5" aria-hidden>
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((_, i) => (
              <span key={i} className="flex items-center gap-8 pr-8 font-serif text-3xl font-light whitespace-nowrap md:text-5xl">
                <em>Julia</em>
                <Sparkles className="size-4 text-taupe" strokeWidth={1.25} />
                <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-taupe">Eau de parfum</span>
                <Sparkles className="size-4 text-taupe" strokeWidth={1.25} />
                <span>{RELEASE_LABEL}</span>
                <Sparkles className="size-4 text-taupe" strokeWidth={1.25} />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
