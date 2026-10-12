// Raw hydra editor code; paste landing.hydra.js into the hydra editor as-is
import sketchCode from "./landing.hydra.js?raw";

const HYDRA_SYNTH_URL =
  "https://unpkg.com/hydra-synth@1.4.0/dist/hydra-synth.js";

// Same signature as the hydra editor's loadScript, so the sketch runs unchanged
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(script);
  });
}

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
const sketch = new AsyncFunction("loadScript", sketchCode);

/**
 * Starts hydra on the canvas and runs the sketch.
 * Resolves to a `stop()` function, or `null` if aborted before finishing.
 * @param {{ canvas: HTMLCanvasElement, signal: AbortSignal }} options
 * @returns {Promise<(() => void) | null>}
 */
export async function startLandingSketch({ canvas, signal }) {
  await loadScript(HYDRA_SYNTH_URL);
  if (signal.aborted) return null;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const hydra = new window.Hydra({
    canvas,
    detectAudio: false,
    makeGlobal: true,
  });
  window.hydra = hydra;

  const stop = () => {
    hydra.hush?.();
    hydra.loop?.stop?.();
    hydra.regl?.destroy?.();
  };

  try {
    await sketch(loadScript);
  } catch (error) {
    stop();
    throw error;
  }
  if (signal.aborted) {
    stop();
    return null;
  }

  return stop;
}
