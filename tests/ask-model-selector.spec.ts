import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-model-selector", () => {
  test("renders label", async ({ page }) => {
    await page.goto(url("ask-model-selector"));
    const label = await page.evaluate(() => {
      const el = document.querySelector("ask-model-selector");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".selector-label")?.textContent;
    });
    expect(label).toBe("Model");
  });

  test("shows selected value", async ({ page }) => {
    await page.goto(url("ask-model-selector"));
    const value = await page.evaluate(() => {
      const el = document.querySelector("ask-model-selector");
      return (el as any)?.value;
    });
    expect(value).toBe("claude3");
  });

  test("renders option labels", async ({ page }) => {
    await page.goto(url("ask-model-selector"));
    const options = await page.evaluate(() => {
      const el = document.querySelector("ask-model-selector");
      if (!el?.shadowRoot) return [];
      const select = el.shadowRoot.querySelector(".selector-select") as HTMLSelectElement;
      return select ? Array.from(select.options).map(o => o.text) : [];
    });
    expect(options).toEqual(["GPT-4", "Claude 3"]);
  });

  test("fires ask-change event on selection", async ({ page }) => {
    await page.goto(url("ask-model-selector"));
    const detail = await page.evaluate(() => {
      const el = document.querySelector("ask-model-selector");
      if (!el) return null;
      return new Promise((resolve) => {
        el.addEventListener("ask-change", ((e: CustomEvent) => resolve(e.detail)) as EventListener, { once: true });
        const select = el.shadowRoot?.querySelector(".selector-select") as HTMLSelectElement;
        if (select) {
          select.value = "gpt4";
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });
    expect(detail).toEqual({ value: "gpt4" });
  });

  test("no label when not provided", async ({ page }) => {
    await page.goto(url("ask-model-selector"));
    const hasLabel = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-model-selector")[1];
      if (!el?.shadowRoot) return false;
      return !!el.shadowRoot.querySelector(".selector-label");
    });
    expect(hasLabel).toBe(false);
  });
});
