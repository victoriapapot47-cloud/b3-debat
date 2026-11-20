"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/constants";

/**
 * Observe le conteneur (et non l'élément masqué, qui serait considéré
 * hors écran à cause de l'overflow hidden).
 */
function useReveal(play?: boolean) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return { ref, show: play ?? inView };
}

/** Texte révélé ligne par ligne (masque + translation). */
export function RevealLines({
  lines,
  className = "",
  delay = 0,
  play,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
  /** Si fourni, pilote l'animation au lieu du viewport */
  play?: boolean;
}) {
  const { ref, show } = useReveal(play);
  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: show ? "0%" : "110%" }}
            transition={{ duration: 1.1, delay: delay + i * 0.1, ease: EASE_IN_OUT }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function FadeUp({
  children,
  className = "",
  delay = 0,
  play,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  play?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = play ?? inView;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
