---
applyTo: "frontend_oxjs/app/views/**/*.js"
excludeAgent: "code-review"
---

# Page Architecture & Routing Guidelines

This document outlines the standard architecture, patterns, and state handling guidelines for authoring **Page Views** in this application.

---

## 1. Core Principles for Page Views

Unlike reusable UI components (which are isolated and generic), **Pages** act as the top-level orchestrators of feature workflows.

1. **Composition Over Creation:** Pages MUST compose reusable primitive components from `app/components/` rather than building raw HTML primitives directly.
2. **Asynchronous Lifecycle:** Pages MUST handle data fetching, loading states, and error boundary states cleanly before rendering content views.
3. **Route & Param Aware:** Pages receive routing parameters (`params`, `query`) and map them to domain data requests.
4. **Clean Disposal/Teardown:** Pages MUST expose a cleanup method (`destroy` or `unmount`) to remove global event listeners, cancel pending fetches, or stop timers when navigation occurs.

---

## 2. Standard Directory Structure

Place all pages inside `app/pages/` organized by route domain:


```

app/pages/
├── Dashboard/
│   ├── DashboardPage.js       # Page orchestrator factory
│   ├── DashboardPage.css      # Page-specific layout grid/styles
│   └── DashboardPage.test.js  # Integration & routing tests
└── UserProfile/
├── UserProfilePage.js
└── UserProfilePage.css

```

---

## 3. Page Factory Template

Use this standard pattern when creating page views:

```javascript
// app/pages/UserProfile/UserProfilePage.js

import { createButton, createModal } from '../../components';

/**
 * @typedef {Object} PageRouteContext
 * @property {Object} params - URL route parameters (e.g., { id: '123' })
 * @property {Object} query - URL query parameters
 * @property {Function} navigate - Router navigation trigger
 */

/**
 * Creates the UserProfile page view instance.
 * @param {PageRouteContext} context
 * @returns {{ element: HTMLElement, destroy: Function }}
 */
export function createUserProfilePage({ params, navigate } = {}) {
  // 1. Container Setup
  const pageContainer = document.createElement('div');
  pageContainer.className = 'page page-user-profile';

  // 2. State & Subscriptions Trackers
  let isMounted = true;
  const abortController = new AbortController();

  // 3. Render Skeleton / Loading State
  pageContainer.innerHTML = `
    <div class="page-loading" aria-busy="true">
      <p>Loading user details...</p>
    </div>
  `;

  // 4. Data Fetching & Async Render Loop
  async function loadData() {
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        signal: abortController.signal
      });

      if (!response.ok) throw new Error('User not found');
      const user = await response.json();

      if (!isMounted) return; // Prevent render if user navigated away mid-fetch

      renderPageContent(user);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (!isMounted) return;
      renderErrorState(err.message);
    }
  }

  // 5. Render Page Views
  function renderPageContent(user) {
    pageContainer.innerHTML = ''; // Clear loading state

    const header = document.createElement('header');
    header.className = 'page-header';
    header.innerHTML = `<h1>${user.name}</h1><p>${user.email}</p>`;

    // Compose Reusable Components
    const backBtn = createButton({
      label: 'Back to Dashboard',
      variant: 'secondary',
      onClick: () => navigate('/dashboard')
    });

    const editModal = createModal({
      title: 'Edit Profile',
      content: `<input type="text" value="${user.name}" id="edit-name" />`,
      onConfirm: () => console.log('Saved!')
    });

    const editBtn = createButton({
      label: 'Edit Profile',
      variant: 'primary',
      onClick: () => editModal.open()
    });

    pageContainer.appendChild(header);
    pageContainer.appendChild(backBtn);
    pageContainer.appendChild(editBtn);
    document.body.appendChild(editModal.element);
  }

  function renderErrorState(message) {
    pageContainer.innerHTML = `
      <div class="page-error" role="alert">
        <h2>Failed to load page</h2>
        <p>${message}</p>
      </div>
    `;
  }

  // 6. Trigger initial fetch
  loadData();

  // 7. Cleanup Hook (Triggered by Router on navigation)
  const destroy = () => {
    isMounted = false;
    abortController.abort(); // Cancel outstanding requests
  };

  return {
    element: pageContainer,
    destroy
  };
}

```

---

## 4. Router Integration Pattern

When mounting pages in your application's router, always call the previous page's `destroy()` hook before appending the new page to the DOM.

```javascript
// app/router.js
let currentPageInstance = null;
const appRoot = document.getElementById('app');

export function renderRoute(pageFactory, routeParams) {
  // 1. Cleanup existing page
  if (currentPageInstance && typeof currentPageInstance.destroy === 'function') {
    currentPageInstance.destroy();
  }

  // 2. Instantiate new page
  currentPageInstance = pageFactory({
    params: routeParams,
    navigate: (path) => history.pushState(null, '', path)
  });

  // 3. Update DOM
  appRoot.innerHTML = '';
  appRoot.appendChild(currentPageInstance.element);
}

```

---

## 5. Page Testing Checklist

Page integration tests should verify end-to-end data fetching and sub-component orchestration:

* [ ] Displays loading indicator initially.
* [ ] Renders page content successfully after async API calls complete.
* [ ] Displays appropriate error states when API calls fail.
* [ ] Triggers `destroy()` cleanup without raising memory leak errors.



