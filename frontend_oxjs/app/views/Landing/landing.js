import { createLandingView } from "./LandingView.js";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const isLandingRoute = window.location.pathname.replace(/\/$/, "") === basePath;

export const landingView = isLandingRoute
  ? createLandingView({
      onExited() {
        landingView.destroy();
      },
    })
  : null;

if (landingView) {
  document.body.appendChild(landingView.element);
  document.documentElement.classList.remove("landingLoading");
}
