---
applyTo: "frontend_oxjs/**/*.js"
---

# OxJS Project Architecture & Global State ($app) Guidelines

This document defines the strict engineering standards for managing application state, media pipelines, global singletons (`$app`), and resource cleanup in this codebase.

---

## 1. The `$app` Singleton Rules

In OxJS applications (like Pad.ma), `$app` serves as the central application orchestrator, global event bus, and shared state container.

1. **Read-Only Direct Access:** Components may read configuration or state from `$app`, but MUST NEVER mutate `$app` properties directly.
2. **Event-Driven Mutations:** Mutate global state or trigger application-wide actions exclusively through `$app.trigger()` or dedicated `$app` dispatch methods.
3. **No Component Tight-Coupling:** Reusable components inside `src/components/` MUST NOT reference `$app` directly. Pass callbacks, initial state, or events down as props. Only Page Orchestrators (`src/pages/`) should interface with `$app`.

```javascript
// ❌ BAD: Reusable component reaching into $app directly
export function createVideoPlayer() {
  const video = document.createElement('video');
  video.onplay = () => { $app.state.isPlaying = true; }; // Direct mutation
  return video;
}

// ✅ GOOD: Component emits via props; Page binds to $app
export function createVideoPlayer({ onPlay }) {
  const video = document.createElement('video');
  video.onplay = () => onPlay?.();
  return video;
}

```

---

## 2. Mandatory Asynchronous Pipeline & Listener Teardown

Because OxJS relies heavily on time-coded media, custom event streams, and `Ox.Async` queues, **every created subscription or async pipeline MUST be tracked and destroyed.**

### The Lifecycle Contract

Every component factory returning DOM elements MUST also return a `destroy()` function if it sets up any of the following:

* `$app.on()` or custom `Ox.UI` event listeners
* `setInterval`, `setTimeout`, or `requestAnimationFrame`
* Active `fetch` / `Ox.Request` pipelines
* Heavy media instances (HTML5 Video/Audio players, canvas contexts)

```javascript
// Template for Any Stateful/Async OxJS Module
export function createTimelineViewer({ streamUrl }) {
  const container = document.createElement('div');
  const abortController = new AbortController();
  const bindings = [];

  // 1. Registering an App-Level Listener
  const handleTimeUpdate = (data) => {
    // Update local UI
  };
  $app.on('media:timeupdate', handleTimeUpdate);
  bindings.push(() => $app.off('media:timeupdate', handleTimeUpdate));

  // 2. Return standard node AND teardown contract
  return {
    element: container,
    destroy() {
      // Abort pending network requests
      abortController.abort();

      // Unbind all events cleanly
      bindings.forEach(unbind => unbind());

      // Clear container DOM
      container.innerHTML = '';
    }
  };
}

```

---

## 3. UI State Management via $app

When managing UI visibility, active panels, or global modals across pages:

* **Use App-Level Events for Cross-Cutting Concerns:** Modals, notifications, or global audio playback should listen to events published to `$app`.
* **Clean Up Route Transitions:** When switching routes or pages, invoke the active page's `destroy()` method before clearing `$app.UI.main` or appending new views.

```javascript
// Router Teardown Example
export function navigateTo(newRouteFactory) {
  if ($app.activePage && typeof $app.activePage.destroy === 'function') {
    $app.activePage.destroy(); // Halts async pipelines & removes listeners
  }

  $app.activePage = newRouteFactory();
  
  const mainView = document.getElementById('app-main');
  mainView.innerHTML = '';
  mainView.appendChild($app.activePage.element);
}

```

---

## 4. Code Review Checklist for OxJS Projects

When reviewing PRs or authoring code, ensure:

* [ ] No direct property assignments on `$app` (e.g., `$app.user = ...` ❌).
* [ ] Components in `src/components/` do not reference `$app`.
* [ ] Any function calling `$app.on(...)` or `Ox.UI` event listeners exposes a `destroy()` method calling `$app.off(...)`.
* [ ] All async data pipelines use `AbortController` or cancellation checks to prevent memory leaks after unmounting.
