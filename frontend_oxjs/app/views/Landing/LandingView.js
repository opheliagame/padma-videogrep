import { startLandingSketch } from "./landingSketch.js";
import "./LandingView.css";

const TITLE = "pad.ma videogrep";

/**
 * Creates the landing view: a hydra sketch background with the project title.
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

  const main = document.createElement("main");
  main.className = "landingView__main";

  const title = document.createElement("h1");
  title.className = "landingView__title";
  title.textContent = TITLE;

  main.append(title);
  element.append(canvas, main);

  async function startSketch() {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      element.classList.add("landingView--noSketch");
      return;
    }

    try {
      stopSketch = await startLandingSketch({
        canvas,
        signal: abortController.signal,
      });
    } catch (error) {
      if (!isMounted) return;
      element.classList.add("landingView--noSketch");
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
