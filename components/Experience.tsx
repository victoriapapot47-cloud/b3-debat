"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import PerfumeScene from "./PerfumeScene";
import Preloader from "./Preloader";
import Nav from "./Nav";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import Notes from "./Notes";
import Marquee from "./Marquee";
import Launch from "./Launch";
import Footer from "./Footer";

export default function Experience() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-loading", !ready);
  }, [ready]);

  const handleLoaded = useCallback(() => setLoaded(true), []);
  const handleComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <PerfumeScene onProgress={setProgress} onLoaded={handleLoaded} revealed={ready} />

      <AnimatePresence>
        {!ready && <Preloader key="preloader" progress={progress} loaded={loaded} onComplete={handleComplete} />}
      </AnimatePresence>

      <Nav play={ready} />
      <main className="relative z-10">
        <Hero play={ready} />
        <Manifesto />
        <Notes />
        <Marquee />
        <Launch />
      </main>
      <Footer />
    </>
  );
}
