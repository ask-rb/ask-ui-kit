import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-prompt-card", () => {
  test("renders label and description", async ({ page }) => {
    await page.goto(url("ask-prompt-card"));
    const data = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll("ask-prompt-card"));
      return cards.slice(0, 2).map((c) => {
        const root = c.shadowRoot!;
        return {
          label: root.querySelector(".label")?.textContent,
          description: root.querySelector(".description")?.textContent ?? null,
        };
      });
    });
    expect(data[0].label).toBe("Explore and understand code");
    expect(data[0].description).toBeNull();
    expect(data[1].label).toBe("Build a new feature, app, or tool");
    expect(data[1].description).toBe("From an idea to shipped");
  });

  test("renders a colored icon per variant", async ({ page }) => {
    await page.goto(url("ask-prompt-card"));
    const icons = await page.evaluate(() => {
      // Skip the custom card (its icon is slotted, not inline).
      return Array.from(document.querySelectorAll("ask-prompt-card")).slice(0, 4).map((c) => {
        const root = c.shadowRoot!;
        const icon = root.querySelector(".icon");
        return {
          hasSvg: !!icon?.querySelector("svg"),
          color: icon ? getComputedStyle(icon).color : null,
        };
      });
    });
    // Every built-in variant ships its own SVG; colors differ (explore blue, build purple, ...)
    expect(icons.every((i) => i.hasSvg)).toBe(true);
    const colors = icons.map((i) => i.color);
    expect(new Set(colors).size).toBeGreaterThan(1);
  });

  test("custom variant renders the slotted icon", async ({ page }) => {
    await page.goto(url("ask-prompt-card"));
    const hasSlottedSvg = await page.evaluate(() => {
      const custom = document.querySelectorAll("ask-prompt-card")[4];
      const slot = custom?.shadowRoot?.querySelector(".icon slot");
      return !!slot && slot.assignedElements().length > 0;
    });
    expect(hasSlottedSvg).toBe(true);
  });

  test("click emits ask-prompt with label and variant", async ({ page }) => {
    await page.goto(url("ask-prompt-card"));
    const detail = await page.evaluate(() => {
      return new Promise((resolve) => {
        const card = document.querySelectorAll("ask-prompt-card")[0]!;
        card.addEventListener("ask-prompt", (e: Event) =>
          resolve((e as CustomEvent).detail)
        );
        (card.shadowRoot!.querySelector(".card") as HTMLElement).click();
      });
    });
    expect(detail).toEqual({ label: "Explore and understand code", variant: "explore" });
  });
});
