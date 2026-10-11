// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createGenerativityControls,
  destroyGenerativityControls,
} from "./GenerativityControls.js";

describe("createGenerativityControls", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders accessible controls with defaults", () => {
    const controls = createGenerativityControls();

    expect(controls.tagName).toBe("SECTION");
    expect(controls.getAttribute("aria-labelledby")).toBe(
      controls.querySelector("h2").id,
    );
    expect(controls.querySelectorAll('input[type="radio"]')).toHaveLength(3);
    expect(controls.querySelector('input[value="medium"]').checked).toBe(true);
    expect(controls.querySelector("select").value).toBe("relevance");
    expect(controls.querySelector('input[type="number"]').value).toBe("10");
    expect(controls.querySelector('[aria-live="polite"]').textContent).toBe(
      "5-15 sec",
    );
  });

  it("emits normalized state when controls change", () => {
    const onChange = vi.fn();
    const controls = createGenerativityControls({
      initialValues: { length: "short", sortBy: "date", limit: 12 },
      onChange,
    });
    const longOption = controls.querySelector('input[value="long"]');
    longOption.checked = true;
    longOption.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onChange).toHaveBeenLastCalledWith({
      length: "long",
      sortBy: "date",
      limit: 12,
    });
    expect(controls.querySelector('[aria-live="polite"]').textContent).toBe(
      "> 15 sec",
    );

    const sortSelect = controls.querySelector("select");
    sortSelect.value = "random";
    sortSelect.dispatchEvent(new Event("change", { bubbles: true }));
    const limitInput = controls.querySelector('input[type="number"]');
    limitInput.value = "500";
    limitInput.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenLastCalledWith({
      length: "long",
      sortBy: "random",
      limit: 50,
    });
    expect(limitInput.value).toBe("50");
  });

  it("removes change listeners when destroyed", () => {
    const onChange = vi.fn();
    const controls = createGenerativityControls({ onChange });
    const sortSelect = controls.querySelector("select");

    destroyGenerativityControls(controls);
    sortSelect.value = "date";
    sortSelect.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).not.toHaveBeenCalled();
  });
});