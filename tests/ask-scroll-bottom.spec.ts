import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-scroll-bottom", () => {
  test("hidden by default", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const hidden = await page.evaluate(() => {
      const btn = document.querySelector("ask-scroll-bottom")?.shadowRoot?.querySelector(".scroll-btn") as HTMLElement;
      return btn?.hidden;
    });
    expect(hidden).toBe(true);
  });

  test("visible when attribute set", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const visible = await page.evaluate(() => {
      const btn = document.querySelectorAll("ask-scroll-bottom")[1]?.shadowRoot?.querySelector(".scroll-btn") as HTMLElement;
      return btn?.classList.contains("scroll-btn--visible");
    });
    expect(visible).toBe(true);
  });

  test("visible reflects to attribute", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const hasAttr = await page.evaluate(() => {
      return document.querySelector("ask-scroll-bottom")?.hasAttribute("visible");
    });
    expect(hasAttr).toBe(false);

    const hasAttr2 = await page.evaluate(() => {
      return document.querySelectorAll("ask-scroll-bottom")[1]?.hasAttribute("visible");
    });
    expect(hasAttr2).toBe(true);
  });

  test("shows badge count", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const badge = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-scroll-bottom")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".scroll-badge")?.textContent;
    });
    expect(badge).toBe("3");
  });

  test("badge caps at 99+", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const badge = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-scroll-bottom")[2];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".scroll-badge")?.textContent;
    });
    expect(badge).toBe("99+");
  });

  test("no badge when badge is 0", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const hasBadge = await page.evaluate(() => {
      const el = document.querySelector("ask-scroll-bottom");
      if (!el?.shadowRoot) return false;
      return !!el.shadowRoot.querySelector(".scroll-badge");
    });
    expect(hasBadge).toBe(false);
  });

  test("fires ask-scroll event on click", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const fired = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-scroll-bottom")[1];
      if (!el) return false;
      return new Promise<boolean>((resolve) => {
        el.addEventListener("ask-scroll", (() => resolve(true)) as EventListener, { once: true });
        const btn = el.shadowRoot?.querySelector(".scroll-btn") as HTMLElement;
        btn?.click();
      });
    });
    expect(fired).toBe(true);
  });

  test("hidden button does not show but stays in DOM", async ({ page }) => {
    await page.goto(url("ask-scroll-bottom"));
    const el = await page.evaluate(() => {
      const host = document.querySelector("ask-scroll-bottom");
      if (!host) return null;
      // Check that the host renders shadow DOM even when hidden
      return {
        hasShadow: !!host.shadowRoot,
        hidden: (host.shadowRoot.querySelector(".scroll-btn") as HTMLElement)?.hidden,
      };
    });
    expect(el?.hasShadow).toBe(true);
    expect(el?.hidden).toBe(true);
  });
});
