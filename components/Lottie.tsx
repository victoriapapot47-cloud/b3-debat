"use client";

import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

// Moteur WASM servi depuis /public (copié au postinstall)
setWasmUrl("/lottie/dotlottie-player.wasm");

type Props = { data: Record<string, unknown>; className?: string };

export default function Lottie({ data, className }: Props) {
  return <DotLottieReact data={data} autoplay loop className={className} />;
}
