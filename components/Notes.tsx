"use client";

import { motion } from "motion/react";
import { Citrus, Flower2, TreePine } from "lucide-react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/constants";
import { RevealLines } from "./Reveal";

const NOTES = [
  {
    icon: Citrus,
    label: "Notes de tête",
    name: "Bergamote & poivre rose",
    text: "Une ouverture vive et pétillante, comme un rayon de soleil à travers le voilage.",
  },
  {
    icon: Flower2,
    label: "Notes de cœur",
    name: "Iris & fleur d'oranger",
    text: "Un cœur poudré et lumineux, d'une douceur presque tactile.",
  },
  {
    icon: TreePine,
    label: "Notes de fond",
    name: "Ambre & bois de santal",
    text: "Un sillage chaud et enveloppant, qui s'installe et se souvient de vous.",
  },
];

export default function Notes() {
  return (
    <section
      id="notes"
      data-bottle="-1,0,0.92"
      data-bottle-m="-0.35,0,0.72"
      data-bg="#e3d6c2"
      className="relative flex min-h-[130svh] items-center px-5 py-32 md:px-10"
    >
      <div className="relative z-10 ml-auto w-full md:w-[48%] rounded-2xl bg-beige/55 p-6 backdrop-blur-md md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none">
        <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-taupe">
          <span className="h-px w-10 bg-taupe" /> 02 — Pyramide olfactive
        </p>
        <h2 className="mb-14 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none font-light">
          <RevealLines lines={[<>Trois temps, <em>une lumière.</em></>]} />
        </h2>

        <ul>
          {NOTES.map(({ icon: Icon, label, name, text }, i) => (
            <motion.li
              key={name}
              className="group relative grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-8 md:grid-cols-[3rem_1fr_auto]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1, delay: i * 0.12, ease: EASE_OUT }}
            >
              <motion.span
                className="absolute inset-x-0 top-0 h-px origin-left bg-ink/25"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 1.4, delay: i * 0.12, ease: EASE_IN_OUT }}
              />
              <span className="font-serif text-lg italic text-taupe">0{i + 1}</span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-taupe">{label}</p>
                <p className="mt-2 font-serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-tight">{name}</p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/70">{text}</p>
              </div>
              <span className="col-start-2 mt-2 flex size-11 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 group-hover:bg-ink group-hover:text-cream md:col-start-3 md:mt-0">
                <Icon className="size-4" strokeWidth={1.25} />
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
