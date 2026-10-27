import { startLandingSketch } from "./landingSketch.js";
import "./LandingView.css";

/**
 * Creates the landing view with a hydra sketch background.
 * Call `exit()` to fade the landing out; `onExited` fires once the fade ends.
 * @param {{ fadeDuration?: number, onExited?: () => void }} context
 * @returns {{ element: HTMLElement, exit: () => void, destroy: () => void }}
 */
export function createLandingView({ fadeDuration = 3000, onExited } = {}) {
  const abortController = new AbortController();
  let stopSketch = null;
  let fadeTimeout = null;
  let isMounted = true;

  const element = document.createElement("div");
  element.className = "landingView";
  element.style.setProperty("--landing-fade-duration", `${fadeDuration}ms`);

  const canvas = document.createElement("canvas");
  canvas.className = "landingView__canvas";
  canvas.setAttribute("aria-hidden", "true");

  element.append(canvas);

  async function startSketch() {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      return;
    }

    try {
      stopSketch = await startLandingSketch({
        canvas,
        signal: abortController.signal,
      });
      if (!isMounted) {
        stopSketch?.();
        stopSketch = null;
      }
    } catch (error) {
      if (!isMounted) return;
      console.warn("Landing sketch unavailable:", error);
    }
  }

  function exit() {
    if (!isMounted || fadeTimeout) return;
    // Flush styles so the opacity transition starts from 1 after the element is re-attached
    element.getBoundingClientRect();
    element.classList.add("landingView--exiting");
    fadeTimeout = setTimeout(() => {
      onExited?.();
    }, fadeDuration);
  }

  function destroy() {
    isMounted = false;
    abortController.abort();
    clearTimeout(fadeTimeout);
    stopSketch?.();
    stopSketch = null;
    element.remove();
  }

  startSketch();

  return { element, exit, destroy };
}
