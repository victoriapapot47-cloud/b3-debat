"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { RevealLines } from "./Reveal";
import { EASE_OUT, RELEASE_DATE } from "@/lib/constants";

function getRemaining() {
  const diff = Math.max(0, RELEASE_DATE.getTime() - Date.now());
  return {
    Jours: Math.floor(diff / 86_400_000),
    Heures: Math.floor((diff / 3_600_000) % 24),
    Minutes: Math.floor((diff / 60_000) % 60),
    Secondes: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value }: { value: number }) {
  const str = String(value).padStart(2, "0");
  return (
    <span className="relative inline-flex overflow-hidden">
      <motion.span
        key={str}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="inline-block nums"
      >
        {str}
      </motion.span>
    </span>
  );
}

export default function Launch() {
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="lancement"
      data-bottle="0,0.02,0.88"
      data-bottle-m="0,0,0.7"
      data-bg="#dccdb6"
      className="relative flex min-h-svh flex-col justify-center px-5 py-32 md:px-10"
    >
      <div className="relative z-10 grid gap-16 md:grid-cols-[1fr_minmax(0,0.9fr)_1fr] md:items-end">
        {/* Colonne gauche : annonce + compte à rebours */}
        <div className="rounded-2xl bg-beige/55 p-6 backdrop-blur-md md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none">
          <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-taupe">
            <span className="h-px w-10 bg-taupe" /> 03 — Lancement
          </p>
          <h2 className="nums font-serif text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95] font-light">
            <RevealLines lines={["Le 20 janvier,", <em key="e">Julia s'éveille.</em>]} />
          </h2>

          <div className="mt-12 grid grid-cols-4 gap-3 border-t border-ink/20 pt-6">
            {(["Jours", "Heures", "Minutes", "Secondes"] as const).map((unit) => (
              <div key={unit}>
                <p className="font-serif text-[clamp(2rem,3.4vw,3.2rem)] leading-none font-light">
                  {time ? <Digit value={time[unit]} /> : "--"}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-taupe">{unit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block" />

        {/* Colonne droite : inscription */}
        <div className="rounded-2xl bg-beige/55 p-6 backdrop-blur-md md:rounded-none md:bg-transparent md:p-0 md:backdrop-blur-none">
          <p className="max-w-xs font-serif text-2xl leading-snug font-light">
            Soyez parmi les premier·e·s à découvrir Julia, en avant-première.
          </p>
          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSent(true);
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 border-b border-ink py-4 text-sm"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-ink text-cream">
                    <Check className="size-3.5" strokeWidth={1.75} />
                  </span>
                  Merci — rendez-vous le 20 janvier.
                </motion.p>
              ) : (
                <motion.label
                  key="form"
                  exit={{ opacity: 0, y: -12 }}
                  className="group flex items-center border-b border-ink/40 transition-colors focus-within:border-ink"
                >
                  <span className="sr-only">Adresse e-mail</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    className="w-full bg-transparent py-4 text-sm placeholder:text-ink/45 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="S'inscrire"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-ink hover:text-cream"
                  >
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </button>
                </motion.label>
              )}
            </AnimatePresence>
          </form>
          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-taupe">Aucun spam. Une seule lettre, le jour J.</p>
        </div>
      </div>
    </section>
  );
}
