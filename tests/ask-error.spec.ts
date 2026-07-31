import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-error", () => {
  test("renders message", async ({ page }) => {
    await page.goto(url("ask-error"));
    const msg = await page.evaluate(() => {
      const el = document.querySelector("ask-error");
      return (el as any)?.message;
    });
    expect(msg).toBe("The server returned a 500 error");
  });

  test("renders default title", async ({ page }) => {
    await page.goto(url("ask-error"));
    const title = await page.evaluate(() => {
      const el = document.querySelector("ask-error");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".error-title")?.textContent;
    });
    expect(title).toBe("Something went wrong");
  });

  test("renders custom title", async ({ page }) => {
    await page.goto(url("ask-error"));
    const title = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-error")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".error-title")?.textContent;
    });
    expect(title).toBe("Connection Failed");
  });

  test("shows retry button when retryable", async ({ page }) => {
    await page.goto(url("ask-error"));
    const hasBtn = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-error")[1];
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".error-retry");
    });
    expect(hasBtn).toBe(true);
  });

  test("hides retry button when not retryable", async ({ page }) => {
    await page.goto(url("ask-error"));
    const hasBtn = await page.evaluate(() => {
      const el = document.querySelector("ask-error");
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".error-retry");
    });
    expect(hasBtn).toBe(false);
  });

  test("renders nothing when no message", async ({ page }) => {
    await page.goto(url("ask-error"));
    const hasContent = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-error")[2];
      if (!el?.shadowRoot) return true; // no shadow if empty
      return el.shadowRoot.textContent !== "";
    });
    expect(hasContent).toBe(false);
  });

  test("fires ask-retry event", async ({ page }) => {
    await page.goto(url("ask-error"));
    const fired = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-error")[1];
      if (!el) return false;
      return new Promise<boolean>((resolve) => {
        el.addEventListener("ask-retry", (() => resolve(true)) as EventListener, { once: true });
        const btn = el.shadowRoot?.querySelector(".error-retry") as HTMLElement;
        btn?.click();
      });
    });
    expect(fired).toBe(true);
  });
});
