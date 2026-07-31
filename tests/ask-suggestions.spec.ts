import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-suggestions", () => {
  test("renders suggestion chips", async ({ page }) => {
    await page.goto(url("ask-suggestions"));
    const chips = await page.evaluate(() => {
      const el = document.querySelector("ask-suggestions");
      if (!el?.shadowRoot) return [];
      return Array.from(el.shadowRoot.querySelectorAll(".suggestion-chip")).map(c => c.textContent);
    });
    expect(chips).toEqual(["What files?", "Help me", "Show code"]);
  });

  test("renders custom label", async ({ page }) => {
    await page.goto(url("ask-suggestions"));
    const label = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-suggestions")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".suggestions-label")?.textContent;
    });
    expect(label).toBe("Try asking");
  });

  test("renders default label", async ({ page }) => {
    await page.goto(url("ask-suggestions"));
    const label = await page.evaluate(() => {
      const el = document.querySelector("ask-suggestions");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".suggestions-label")?.textContent;
    });
    expect(label).toBe("Suggestions");
  });

  test("renders nothing when empty", async ({ page }) => {
    await page.goto(url("ask-suggestions"));
    const hasContent = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-suggestions")[2];
      if (!el?.shadowRoot) return false;
      return el.shadowRoot.textContent !== "";
    });
    expect(hasContent).toBe(false);
  });

  test("fires ask-select event with suggestion on click", async ({ page }) => {
    await page.goto(url("ask-suggestions"));
    const detail = await page.evaluate(() => {
      const el = document.querySelector("ask-suggestions");
      if (!el) return null;
      return new Promise((resolve) => {
        el.addEventListener("ask-select", ((e: CustomEvent) => resolve(e.detail)) as EventListener, { once: true });
        const chips = el.shadowRoot?.querySelectorAll(".suggestion-chip");
        (chips?.[0] as HTMLElement)?.click();
      });
    });
    expect(detail).toEqual({ suggestion: "What files?" });
  });
});
