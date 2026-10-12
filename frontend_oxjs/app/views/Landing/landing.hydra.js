await loadScript(
  "https://cdn.jsdelivr.net/gh/geikha/hyper-hydra@latest/hydra-src.js",
);
await loadScript(
  "https://cdn.jsdelivr.net/gh/geikha/hyper-hydra@latest/hydra-wrap.js",
);
hydraWrap.setMirror();
await loadScript(
  "https://cdn.statically.io/gh/opheliagame/livecode@709eea9cfca2a1b4c279df6f7ba783747ff6b7ee/public/functions/draw-multiline-text-svg.js",
);
s0.initImage(op.svgTextUrl(["pad.ma videogrep"], "system-ui"));

noise(Math.random() * 420 + 42, Math.random() * 42)
  .modulate(osc(Math.random() * 42, -0.5).rotate(Math.PI / 2))
  .add(src(s0))
  .out();
