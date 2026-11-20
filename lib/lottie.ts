/**
 * Animations Lottie (format JSON Bodymovin) dessinées à la main,
 * lues par le player LottieFiles (@lottiefiles/dotlottie-react).
 */

const INK = [0.165, 0.133, 0.11, 1];

const ease = { i: { x: [0.65], y: [1] }, o: { x: [0.35], y: [0] } };

const transform = {
  ty: "tr",
  p: { a: 0, k: [0, 0] },
  a: { a: 0, k: [0, 0] },
  s: { a: 0, k: [100, 100] },
  r: { a: 0, k: 0 },
  o: { a: 0, k: 100 },
  sk: { a: 0, k: 0 },
  sa: { a: 0, k: 0 },
};

const layerBase = (nm: string, ind: number, p: number[], op: number) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm,
  sr: 1,
  ao: 0,
  ip: 0,
  op,
  st: 0,
  bm: 0,
  ks: {
    o: { a: 0, k: 100 },
    r: { a: 0, k: 0 },
    p: { a: 0, k: [...p, 0] },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
});

/** Anneau fin qui se trace et tourne — preloader */
export const ringLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 150,
  w: 240,
  h: 240,
  nm: "julia-ring",
  ddd: 0,
  assets: [],
  layers: [
    {
      ...layerBase("ring", 1, [120, 120], 150),
      ks: {
        ...layerBase("ring", 1, [120, 120], 150).ks,
        r: { a: 1, k: [{ t: 0, s: [-90], ...ease }, { t: 150, s: [270] }] },
      },
      shapes: [
        {
          ty: "gr",
          nm: "circle",
          it: [
            { ty: "el", d: 1, nm: "e", s: { a: 0, k: [200, 200] }, p: { a: 0, k: [0, 0] } },
            {
              ty: "st",
              nm: "s",
              c: { a: 0, k: INK },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 1.2 },
              lc: 2,
              lj: 1,
              ml: 4,
            },
            transform,
          ],
        },
        {
          ty: "tm",
          nm: "trim",
          m: 1,
          o: { a: 0, k: 0 },
          s: { a: 1, k: [{ t: 0, s: [0], ...ease }, { t: 70, s: [0], ...ease }, { t: 140, s: [100] }] },
          e: { a: 1, k: [{ t: 0, s: [0], ...ease }, { t: 70, s: [100] }] },
        },
      ],
    },
    {
      ...layerBase("inner", 2, [120, 120], 150),
      ks: {
        ...layerBase("inner", 2, [120, 120], 150).ks,
        o: { a: 0, k: 35 },
        r: { a: 1, k: [{ t: 0, s: [0], ...ease }, { t: 150, s: [-180] }] },
      },
      shapes: [
        {
          ty: "gr",
          nm: "circle",
          it: [
            { ty: "el", d: 1, nm: "e", s: { a: 0, k: [170, 170] }, p: { a: 0, k: [0, 0] } },
            {
              ty: "st",
              nm: "s",
              c: { a: 0, k: INK },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 0.8 },
              lc: 2,
              lj: 1,
              ml: 4,
              d: [
                { n: "d", nm: "dash", v: { a: 0, k: 2 } },
                { n: "g", nm: "gap", v: { a: 0, k: 6 } },
                { n: "o", nm: "offset", v: { a: 0, k: 0 } },
              ],
            },
            transform,
          ],
        },
      ],
    },
  ],
};

/** Ligne verticale qui s'écoule — indicateur de scroll */
export const scrollLottie = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 110,
  w: 40,
  h: 120,
  nm: "julia-scroll",
  ddd: 0,
  assets: [],
  layers: [
    {
      ...layerBase("line", 1, [0, 0], 110),
      shapes: [
        {
          ty: "gr",
          nm: "line",
          it: [
            {
              ty: "sh",
              nm: "path",
              ks: { a: 0, k: { i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]], v: [[20, 8], [20, 112]], c: false } },
            },
            {
              ty: "st",
              nm: "s",
              c: { a: 0, k: INK },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 1.5 },
              lc: 2,
              lj: 1,
              ml: 4,
            },
            transform,
          ],
        },
        {
          ty: "tm",
          nm: "trim",
          m: 1,
          o: { a: 0, k: 0 },
          s: { a: 1, k: [{ t: 0, s: [0], ...ease }, { t: 45, s: [0], ...ease }, { t: 100, s: [100] }] },
          e: { a: 1, k: [{ t: 0, s: [0], ...ease }, { t: 55, s: [100] }] },
        },
      ],
    },
  ],
};
