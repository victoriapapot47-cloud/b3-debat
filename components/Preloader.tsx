"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Lottie from "./Lottie";
import { ringLottie } from "@/lib/lottie";
import { EASE_IN_OUT, EASE_OUT, RELEASE_LABEL } from "@/lib/constants";

type Props = {
  /** Progression réelle du chargement 3D (0 → 1) */
  progress: number;
  loaded: boolean;
  onComplete: () => void;
};

const MIN_DURATION = 2600; // ms — laisse le temps de lire l'animation

export default function Preloader({ progress, loaded, onComplete }: Props) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const state = useRef({ progress, loaded, start: 0 });
  state.current.progress = progress;
  state.current.loaded = loaded;

  // Compteur : suit le vrai chargement, mais jamais plus vite que MIN_DURATION
  useEffect(() => {
    let raf = 0;
    let value = 0;
    state.current.start = performance.now();
    const loop = (now: number) => {
      const elapsed = now - state.current.start;
      const timeCap = Math.min(1, elapsed / MIN_DURATION);
      const { loaded: done, progress: real } = state.current;
      // Sans info de taille, on avance doucement jusqu'à 85 % en attendant le modèle
      const goal = Math.min(timeCap, done ? 1 : Math.max(real * 0.95, timeCap * 0.85)) * 100;
      value += (goal - value) * 0.08;
      if (done && timeCap >= 1 && value > 99.5) value = 100;
      setCount(Math.round(value));
      if (value < 100) raf = requestAnimationFrame(loop);
      else setLeaving(true);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onComplete, 450);
    return () => clearTimeout(t);
  }, [leaving, onComplete]);

  const letters = "Julia".split("");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-cream px-5 py-6 text-ink md:px-10 md:py-8"
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1.2, ease: EASE_IN_OUT }}
      aria-live="polite"
      aria-label={`Chargement ${count}%`}
    >
      {/* Ligne haute */}
      <motion.div
        className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: leaving ? 0 : 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <span>Maison Julia</span>
        <span className="hidden sm:inline">Eau de Parfum</span>
        <span>{RELEASE_LABEL}</span>
      </motion.div>

      {/* Centre : anneau Lottie + nom */}
      <div className="relative flex flex-1 items-center justify-center">
        <motion.div
          className="absolute size-[min(70vw,420px)]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.15 : 1 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <Lottie data={ringLottie} className="size-full" />
        </motion.div>

        <h2 className="relative flex overflow-hidden font-serif text-[clamp(4.5rem,16vw,11rem)] leading-[1.05] font-light italic">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: leaving ? "-110%" : "0%" }}
              transition={{
                duration: leaving ? 0.7 : 1.1,
                delay: leaving ? i * 0.04 : 0.2 + i * 0.08,
                ease: EASE_IN_OUT,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </h2>
      </div>

      {/* Ligne basse : barre + compteur */}
      <div className="flex items-end justify-between gap-6">
        <div className="mb-3 flex-1">
          <p className="mb-3 max-w-[16rem] text-[11px] uppercase leading-relaxed tracking-[0.3em] text-taupe">
            Une lumière ambrée se prépare
          </p>
          <div className="h-px w-full bg-sand">
            <div
              className="h-px origin-left bg-ink transition-transform duration-150 ease-linear"
              style={{ transform: `scaleX(${count / 100})` }}
            />
          </div>
        </div>
        <div className="overflow-hidden font-serif text-[clamp(3.5rem,10vw,8rem)] leading-none font-light nums">
          <motion.span
            className="block"
            animate={{ y: leaving ? "-105%" : "0%" }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
          >
            {String(count).padStart(3, "0")}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
