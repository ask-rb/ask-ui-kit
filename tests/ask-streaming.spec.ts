import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-streaming", () => {
  test("renders content when active", async ({ page }) => {
    await page.goto(url("ask-streaming"));

    const hasShadow = await page.evaluate(() => {
      const el = document.querySelector("ask-streaming");
      return el?.shadowRoot !== null;
    });
    expect(hasShadow).toBe(true);

    const content = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { content: string }>("ask-streaming");
      return el?.content;
    });
    expect(content).toBe("Hello, I am thinking...");
  });

  test("shows cursor when active", async ({ page }) => {
    await page.goto(url("ask-streaming"));

    const hasCursor = await page.evaluate(() => {
      const el = document.querySelector("ask-streaming");
      if (!el?.shadowRoot) return false;
      return !!el.shadowRoot.querySelector(".streaming-cursor");
    });
    expect(hasCursor).toBe(true);
  });

  test("renders nothing when not active", async ({ page }) => {
    await page.goto(url("ask-streaming"));

    const isVisible = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-streaming")[1]; // second is inactive
      if (!el?.shadowRoot) return false;
      return el.shadowRoot.textContent !== "";
    });
    expect(isVisible).toBe(false);
  });

  test("active property reflects to attribute", async ({ page }) => {
    await page.goto(url("ask-streaming"));

    const hasAttr = await page.evaluate(() => {
      const el = document.querySelector("ask-streaming");
      return el?.hasAttribute("active");
    });
    expect(hasAttr).toBe(true);

    const noAttr = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-streaming")[1];
      return el?.hasAttribute("active");
    });
    expect(noAttr).toBe(false);
  });

  test("updates content dynamically", async ({ page }) => {
    await page.goto(url("ask-streaming"));

    await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { content: string }>("ask-streaming");
      if (el) el.content += " And more...";
    });

    const text = await page.evaluate(() => {
      const el = document.querySelector("ask-streaming");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".streaming-content")?.textContent;
    });

    expect(text?.trim()).toBe("Hello, I am thinking... And more...");
  });
});
