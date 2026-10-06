---
applyTo: "frontend_oxjs/app/components/**/*.js"
excludeAgent: "code-review"
---

# Component Design Instructions & Guidelines

This document outlines the standard architecture, patterns, and testing requirements for creating reusable UI components in this repository using **Factory Functions**.

---

## 1. Core Architecture Principles

All components in this repository follow the **Functional Factory Pattern**.

1. **Pure Factory Functions:** Every component MUST be exported as a JavaScript function that accepts a single `props` object and returns a standard `HTMLElement`.
2. **Encapsulated State:** Component state MUST remain inside closure scope. Do not pollute global scope or attach arbitrary properties to DOM nodes.
3. **No Heavy Framework Abstractions:** Components rely strictly on standard DOM APIs (`document.createElement`, `addEventListener`, `classList`).
4. **Accessible by Default:** Every component MUST include appropriate ARIA attributes (`aria-expanded`, `aria-hidden`, `role`) updated dynamically during state changes.

---

## 2. Standard File & Folder Structure

When creating a new component, place it in `src/components/<ComponentName>/` with the following structure:


```

src/components/
└── /
├── .js       # Factory implementation
├── .css      # Component-scoped styles
└── .test.js  # Unit tests

```

---

## 3. Factory Component Template

Use the following template when creating new components:

```javascript
// src/components/Button/Button.js

/**
 * @typedef {Object} ButtonProps
 * @property {string} label - The visible button text
 * @property {'primary' | 'secondary' | 'danger'} [variant='primary'] - Visual variant
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {Function} [onClick] - Click handler callback
 */

/**
 * Creates a reusable Button component.
 * @param {ButtonProps} props
 * @returns {HTMLElement}
 */
export function createButton({
  label,
  variant = 'primary',
  disabled = false,
  onClick
} = {}) {
  // 1. Validation / Error handling for required props
  if (!label) {
    throw new Error('[Button]: "label" prop is required.');
  }

  // 2. Element Creation & Class Setup
  const button = document.createElement('button');
  button.className = `btn btn-${variant}`;
  button.textContent = label;

  // 3. Accessibility & State Flags
  if (disabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }

  // 4. Event Binding
  if (typeof onClick === 'function' && !disabled) {
    button.addEventListener('click', (e) => onClick(e, { element: button }));
  }

  // 5. Return Node
  return button;
}

```

---

## 4. Stateful Factory Pattern Template

For components requiring toggle states, menus, or overlays (e.g., Modals, Dropdowns, Toggles), encapsulate state inside closures and expose cleanup or control methods when needed.

```javascript
// Example: Stateful Component Pattern
export function createToggle({ initialActive = false, onChange } = {}) {
  // Encapsulated State
  let isActive = Boolean(initialActive);

  // DOM Elements
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'toggle-btn';

  // State Renderer
  const render = () => {
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.classList.toggle('is-active', isActive);
    button.textContent = isActive ? 'ON' : 'OFF';
  };

  // Event Handlers
  button.addEventListener('click', () => {
    isActive = !isActive;
    render();
    if (typeof onChange === 'function') {
      onChange(isActive);
    }
  });

  // Initial Render
  render();

  return button;
}

```

---

## 5. CSS & Styling Conventions

* **BEM or Flat Scoped Class Names:** Class names MUST be scoped to the component namespace to prevent global leakage (e.g., `.dropdown`, `.dropdown-item`, `.dropdown-menu`).
* **CSS Custom Properties for Themes:** Use CSS variables for colors, spacing, and typography.

```css
/* src/components/Button/Button.css */
.btn {
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  border-radius: var(--radius-sm, 4px);
  font-family: inherit;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary, #0066cc);
  color: #ffffff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

```

---

## 6. Testing Requirements

Every component MUST have a co-located `.test.js` file tested via Vitest or Jest with JSDOM.

### Unit Test Checklist:

* [ ] Renders correctly with default props.
* [ ] Correctly applies variant / modifier classes.
* [ ] Triggers event callbacks (`onClick`, `onChange`) when interacted with.
* [ ] Does NOT trigger callbacks when disabled.
* [ ] Updates ARIA attributes on state changes.

```javascript
// src/components/Button/Button.test.js
import { describe, it, expect, vi } from 'vitest';
import { createButton } from './Button.js';

describe('createButton Factory', () => {
  it('renders correctly with given label and variant', () => {
    const btn = createButton({ label: 'Submit', variant: 'secondary' });

    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Submit');
    expect(btn.classList.contains('btn-secondary')).toBe(true);
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    const btn = createButton({ label: 'Click Me', onClick: handleClick });

    btn.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents click events when disabled', () => {
    const handleClick = vi.fn();
    const btn = createButton({ label: 'Disabled', disabled: true, onClick: handleClick });

    btn.click();
    expect(handleClick).not.toHaveBeenCalled();
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
  });
});
```
