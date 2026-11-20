"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Props = {
  /** Progression réelle du chargement du modèle (0 → 1) */
  onProgress: (value: number) => void;
  onLoaded: () => void;
  /** Lance l'apparition du flacon une fois le preloader terminé */
  revealed: boolean;
};

type Stop = { center: number; x: number; y: number; scale: number; bg: THREE.Color };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Scène Three.js fixe en arrière-plan : le flacon reste à l'écran pendant
 * toute l'expérience. Le scroll pilote sa rotation, et chaque section
 * (attribut data-bottle) décrit la position / l'échelle cible du flacon.
 */
export default function PerfumeScene({ onProgress, onLoaded, revealed }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(revealed);
  const callbacks = useRef({ onProgress, onLoaded });
  callbacks.current = { onProgress, onLoaded };

  useEffect(() => {
    revealedRef.current = revealed;
  }, [revealed]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Renderer / scène / caméra ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color("#e9dfd0");
    scene.background = bgColor;

    const camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.9;

    const key = new THREE.DirectionalLight("#fff4e6", 2.2);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#ffd9b0", 1.4);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    /* ---------- Grand titre « JULIA » derrière le flacon ----------
       Rendu dans la scène pour être réfracté par le verre. */
    const titleCanvas = document.createElement("canvas");
    titleCanvas.width = 4096;
    titleCanvas.height = 1400;
    const titleTexture = new THREE.CanvasTexture(titleCanvas);
    titleTexture.colorSpace = THREE.SRGBColorSpace;
    titleTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const titleMaterial = new THREE.MeshBasicMaterial({
      map: titleTexture,
      alphaTest: 0.35,
      toneMapped: false,
    });
    const titlePlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1400 / 4096), titleMaterial);
    titlePlane.position.z = -2.5;
    scene.add(titlePlane);

    const drawTitle = () => {
      const ctx = titleCanvas.getContext("2d");
      if (!ctx) return;
      const family =
        getComputedStyle(document.documentElement).getPropertyValue("--font-cormorant").trim() || "serif";
      ctx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);
      ctx.fillStyle = "#cdb99c";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `300 1050px ${family}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "40px";
      ctx.fillText("JULIA", titleCanvas.width / 2, titleCanvas.height / 2 - 40);
      titleTexture.needsUpdate = true;
    };
    drawTitle();
    document.fonts?.ready.then(drawTitle);

    /* ---------- Flacon ---------- */
    const bottlePivot = new THREE.Group(); // position / échelle (sections)
    const bottleSpin = new THREE.Group(); // rotation (scroll)
    bottlePivot.add(bottleSpin);
    scene.add(bottlePivot);
    bottlePivot.visible = false;

    const glass = new THREE.MeshPhysicalMaterial({
      color: "#fbf6ee",
      metalness: 0,
      roughness: 0.04,
      transmission: 1,
      thickness: 0.9,
      ior: 1.5,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color("#f3e3cc"),
      attenuationDistance: 2.5,
      envMapIntensity: 1.2,
      side: THREE.FrontSide,
    });
    // Liquide opaque : il doit être capturé par la passe de transmission du verre
    const liquid = new THREE.MeshPhysicalMaterial({
      color: "#b0581f",
      roughness: 0.18,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      sheen: 0.35,
      sheenColor: new THREE.Color("#ffcf96"),
      emissive: new THREE.Color("#4a1a05"),
      emissiveIntensity: 0.35,
      envMapIntensity: 0.9,
    });
    const cap = new THREE.MeshPhysicalMaterial({
      color: "#c9a774",
      metalness: 1,
      roughness: 0.28,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.1,
    });

    const loader = new GLTFLoader();
    let disposed = false;
    loader.load(
      "/models/parfum.glb",
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        model.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (!mesh.isMesh) return;
          const name = mesh.name.toLowerCase();
          if (name.includes("liquid")) mesh.material = liquid;
          else if (name.includes("circle")) mesh.material = cap;
          else mesh.material = glass;
        });

        // Normalisation : centré, hauteur ≈ 2.4 unités
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const s = 2.4 / size.y;
        model.scale.setScalar(s);
        model.position.set(-center.x * s, -center.y * s, -center.z * s);
        bottleSpin.add(model);
        bottlePivot.visible = true;

        callbacks.current.onProgress(1);
        callbacks.current.onLoaded();
      },
      (event) => {
        if (event.total) callbacks.current.onProgress(clamp(event.loaded / event.total));
      },
      (error) => {
        console.error("Impossible de charger parfum.glb", error);
        callbacks.current.onLoaded();
      },
    );

    /* ---------- Pointeur (parallaxe légère) ---------- */
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ---------- Dimensions ---------- */
    const view = { width: 0, height: 0, mobile: false };
    const visibleAt = (z: number) => {
      const dist = camera.position.z - z;
      const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
      return { h, w: h * camera.aspect };
    };
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const v = visibleAt(0);
      view.width = v.w;
      view.height = v.h;
      view.mobile = w < 768;
      const t = visibleAt(titlePlane.position.z);
      const titleWidth = t.w * (view.mobile ? 1.15 : 0.94);
      titlePlane.scale.setScalar(titleWidth);
    };
    onResize();
    window.addEventListener("resize", onResize);

    /* ---------- Lecture des sections ---------- */
    const readStops = (): Stop[] => {
      const nodes = document.querySelectorAll<HTMLElement>("[data-bottle]");
      return Array.from(nodes).map((node) => {
        const rect = node.getBoundingClientRect();
        const spec = (view.mobile && node.dataset.bottleM) || node.dataset.bottle || "";
        const [x = 0, y = 0, scale = 1] = spec.split(",").map(Number);
        return {
          center: rect.top + rect.height / 2,
          x,
          y,
          scale,
          bg: new THREE.Color(node.dataset.bg ?? "#e9dfd0"),
        };
      });
    };

    const target = { x: 0, y: 0, scale: 1 };
    const current = { x: 0, y: -0.4, scale: 0.6, rot: 0, intro: 0 };
    const tmpColor = new THREE.Color();
    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      const k = 1 - Math.pow(0.0015, dt); // lissage indépendant du framerate

      // Progression globale du scroll → rotation
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? clamp(window.scrollY / maxScroll) : 0;

      // Interpolation entre les sections autour du centre de l'écran
      const stops = readStops();
      const mid = window.innerHeight / 2;
      if (stops.length) {
        let a = stops[0];
        let b = stops[0];
        let t = 0;
        if (mid <= stops[0].center) {
          a = b = stops[0];
        } else if (mid >= stops[stops.length - 1].center) {
          a = b = stops[stops.length - 1];
        } else {
          for (let i = 0; i < stops.length - 1; i++) {
            if (mid >= stops[i].center && mid <= stops[i + 1].center) {
              a = stops[i];
              b = stops[i + 1];
              t = smooth((mid - a.center) / (b.center - a.center || 1));
              break;
            }
          }
        }
        // x : fraction de la demi-largeur visible · y : fraction de la demi-hauteur
        const spread = view.width * (view.mobile ? 0.5 : 0.26);
        target.x = lerp(a.x, b.x, t) * spread;
        target.y = lerp(a.y, b.y, t) * view.height * 0.5;
        target.scale = lerp(a.scale, b.scale, t);
        tmpColor.copy(a.bg).lerp(b.bg, t);
        bgColor.lerp(tmpColor, k);
      }

      // Apparition après le preloader
      current.intro = lerp(current.intro, revealedRef.current ? 1 : 0, k * 0.5);
      const intro = current.intro;

      current.x = lerp(current.x, target.x, k);
      current.y = lerp(current.y, target.y, k);
      current.scale = lerp(current.scale, target.scale, k);
      current.rot = lerp(current.rot, progress * Math.PI * 4, reduceMotion ? 1 : k);

      pointer.sx = lerp(pointer.sx, pointer.x, k * 0.6);
      pointer.sy = lerp(pointer.sy, pointer.y, k * 0.6);

      const float = reduceMotion ? 0 : Math.sin(elapsed * 0.9) * 0.05;
      bottlePivot.position.set(current.x, current.y + float + (1 - intro) * -0.8, 0);
      bottlePivot.scale.setScalar(current.scale * lerp(0.75, 1, intro));
      bottleSpin.rotation.set(
        pointer.sy * 0.12 + Math.sin(current.rot * 0.5) * 0.08,
        current.rot + (1 - intro) * -1.2 + pointer.sx * 0.25,
        Math.sin(current.rot * 0.25) * 0.05,
      );

      // Le grand titre suit le défilement du hero (comme du texte HTML)
      const hero = document.getElementById("hero");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const pxToWorld = visibleAt(titlePlane.position.z).h / window.innerHeight;
        titlePlane.position.y = (-rect.top * 1.25 + (view.mobile ? -40 : 0)) * pxToWorld;
        titlePlane.visible = rect.bottom > -200;
      }
      titlePlane.position.x = -pointer.sx * 0.08;
      titleMaterial.alphaTest = lerp(0.98, 0.35, intro);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      [glass, liquid, cap, titleMaterial].forEach((m) => m.dispose());
      titleTexture.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
