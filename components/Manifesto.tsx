"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const TEXT =
  "Julia est née d'une fin d'après-midi : la lumière qui s'attarde sur le lin, une peau tiède, le souvenir d'un parfum qu'on ne retrouve jamais tout à fait. Une signature ambrée, douce et lumineuse — pensée pour rester.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = TEXT.split(" ");

  return (
    <section
      id="manifeste"
      data-bottle="1,0,0.92"
      data-bottle-m="0.35,0,0.72"
      data-bg="#e6dccb"
      className="relative flex min-h-[150svh] items-center px-5 py-32 md:px-10"
    >
      <div className="relative z-10 w-full md:w-[58%] rounded-2xl bg-beige/55 p-6 backdrop-blur-md md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none">
        <p className="mb-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-taupe">
          <span className="h-px w-10 bg-taupe" /> 01 — Manifeste
        </p>
        <p
          ref={ref}
          className="font-serif text-[clamp(1.9rem,4.2vw,3.9rem)] leading-[1.12] font-light"
        >
          {words.map((word, i) => {
            const start = i / words.length;
            return <Word key={i} word={word} progress={scrollYProgress} range={[start, start + 1 / words.length]} />;
          })}
        </p>
      </div>
    </section>
  );
}
