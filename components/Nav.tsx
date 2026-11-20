"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE_OUT, RELEASE_LABEL } from "@/lib/constants";

export default function Nav({ play }: { play: boolean }) {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 text-[11px] uppercase tracking-[0.3em] mix-blend-multiply md:px-10 md:py-7"
      initial={{ opacity: 0, y: -16 }}
      animate={play ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.6, ease: EASE_OUT }}
    >
      <a href="#hero" className="font-serif text-xl tracking-[0.35em] normal-case">
        JULIA
      </a>
      <nav className="hidden items-center gap-10 md:flex">
        <a href="#manifeste" className="transition-opacity hover:opacity-50">Manifeste</a>
        <a href="#notes" className="transition-opacity hover:opacity-50">Notes</a>
        <a href="#lancement" className="transition-opacity hover:opacity-50">{RELEASE_LABEL}</a>
      </nav>
      <a
        href="#lancement"
        className="group flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2.5 transition-colors hover:border-ink hover:bg-ink hover:text-cream"
      >
        Être prévenu·e
        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
      </a>
    </motion.header>
  );
}
