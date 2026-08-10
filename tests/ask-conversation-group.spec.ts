import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-conversation-group", () => {
  test("shows label and count; expanded renders children", async ({ page }) => {
    await page.goto(url("ask-conversation-group"));
    const label = await page.evaluate(() => {
      const el = document.querySelector("#g1");
      return el?.shadowRoot?.querySelector(".label")?.textContent;
    });
    expect(label).toBe("project-a");

    const count = await page.evaluate(() => {
      const el = document.querySelector("#g1");
      return el?.shadowRoot?.querySelector(".count")?.textContent;
    });
    expect(count).toBe("2");

    const childVisible = await page.evaluate(() => {
      const el = document.querySelector("#g1");
      return !!el?.querySelector(".child");
    });
    expect(childVisible).toBe(true);
  });

  test("collapsed group hides children", async ({ page }) => {
    await page.goto(url("ask-conversation-group"));
    const childVisible = await page.evaluate(() => {
      const el = document.querySelector("#g2");
      return !!el?.querySelector(".child");
    });
    expect(childVisible).toBe(false);
  });

  test("toggle expands and emits group-toggle", async ({ page }) => {
    await page.goto(url("ask-conversation-group"));
    const detail = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#g2")!;
        el.addEventListener("group-toggle", (e: Event) => resolve((e as CustomEvent).detail));
        el.shadowRoot!.querySelector(".header")!.dispatchEvent(new Event("click"));
      });
    });
    expect(detail).toEqual({ expanded: true });
    const childVisible = await page.evaluate(() => {
      const el = document.querySelector("#g2");
      return !!el?.querySelector(".child");
    });
    expect(childVisible).toBe(true);
  });
});
