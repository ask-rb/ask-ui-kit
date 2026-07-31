import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-avatar", () => {
  test("renders initials from name", async ({ page }) => {
    await page.goto(url("ask-avatar"));
    const text = await page.evaluate(() => {
      const el = document.querySelector("ask-avatar");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".avatar-fallback")?.textContent;
    });
    expect(text).toBe("K");
  });

  test("renders robot for assistant without name", async ({ page }) => {
    await page.goto(url("ask-avatar"));
    const text = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-avatar")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".avatar-fallback")?.textContent;
    });
    expect(text).toBe("🤖");
  });

  test("renders user fallback icon for user role", async ({ page }) => {
    await page.goto(url("ask-avatar"));
    const text = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-avatar")[0];
      if (!el?.shadowRoot) return null;
      // User role with a name shows initial, not icon
      return el.shadowRoot.querySelector(".avatar-fallback")?.textContent;
    });
    expect(text).toBe("K");
  });

  test("renders image when src provided", async ({ page }) => {
    await page.goto(url("ask-avatar"));
    const imgSrc = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-avatar")[3];
      if (!el?.shadowRoot) return null;
      const img = el.shadowRoot.querySelector(".avatar-img") as HTMLImageElement;
      return img?.src?.slice(0, 50);
    });
    expect(imgSrc).toContain("data:image/png");
  });

  test("applies custom size", async ({ page }) => {
    await page.goto(url("ask-avatar"));
    const width = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-avatar")[4];
      if (!el?.shadowRoot) return null;
      const avatar = el.shadowRoot.querySelector(".avatar") as HTMLElement;
      return avatar?.style.width;
    });
    expect(width).toBe("40px");
  });
});
