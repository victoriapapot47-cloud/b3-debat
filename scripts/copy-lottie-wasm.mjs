// Copie le moteur WASM de LottieFiles dans /public pour l'héberger nous-mêmes
// (pas de dépendance à un CDN tiers au chargement de la page).
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const src = join(dirname(require.resolve("@lottiefiles/dotlottie-web")), "dotlottie-player.wasm");
mkdirSync("public/lottie", { recursive: true });
copyFileSync(src, "public/lottie/dotlottie-player.wasm");
console.log("✓ dotlottie-player.wasm copié dans public/lottie");
