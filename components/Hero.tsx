"use client";

import Lottie from "./Lottie";
import { FadeUp, RevealLines } from "./Reveal";
import { scrollLottie } from "@/lib/lottie";
import { RELEASE_LABEL } from "@/lib/constants";

export default function Hero({ play }: { play: boolean }) {
  return (
    <section
      id="hero"
      data-bottle="0,-0.04,1"
      data-bottle-m="0,0.02,0.8"
      data-bg="#e9dfd0"
      className="relative flex h-svh min-h-[640px] flex-col justify-end px-5 pb-8 md:px-10 md:pb-10"
    >
      {/* Le grand titre « JULIA » est dessiné dans la scène 3D, derrière le flacon */}
      <h1 className="sr-only">Julia — nouvelle eau de parfum, disponible le 20 janvier 2027</h1>

      <div className="grid grid-cols-2 items-end gap-6 md:grid-cols-3">
        <div className="text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.05] font-serif font-light">
          <RevealLines play={play} delay={0.5} lines={["L'ambre", <em key="e">au creux de la peau...</em>]} />
        </div>

        <FadeUp play={play} delay={1} className="hidden flex-col items-center gap-3 justify-self-center md:flex">
          <div className="h-16 w-6">
            <Lottie data={scrollLottie} className="size-full" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-taupe">Défiler</span>
        </FadeUp>

        <FadeUp play={play} delay={0.8} className="justify-self-end text-right">
          <p className="text-[10px] whitespace-nowrap uppercase tracking-[0.3em] text-taupe">Eau de parfum · 50 ml</p>
          <p className="mt-2 font-serif text-[clamp(1.6rem,3vw,2.6rem)] leading-none font-light nums">{RELEASE_LABEL}</p>
        </FadeUp>
      </div>
    </section>
  );
}
