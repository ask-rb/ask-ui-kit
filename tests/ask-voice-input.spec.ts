import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-voice-input", () => {
  test("renders mic button", async ({ page }) => {
    await page.goto(url("ask-voice-input"));
    const btn = await page.evaluate(() => {
      const el = document.querySelector("ask-voice-input");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".voice-btn")?.textContent?.trim();
    });
    expect(btn).toBe("🎤");
  });

  test("shows recording state with stop button", async ({ page }) => {
    await page.goto(url("ask-voice-input"));
    const btn = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-voice-input")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".voice-btn")?.textContent?.trim();
    });
    expect(btn).toBe("⏹");
  });

  test("recording reflects to attribute", async ({ page }) => {
    await page.goto(url("ask-voice-input"));
    const hasAttr = await page.evaluate(() => {
      return document.querySelectorAll("ask-voice-input")[1]?.hasAttribute("recording");
    });
    expect(hasAttr).toBe(true);
    const noAttr = await page.evaluate(() => {
      return document.querySelector("ask-voice-input")?.hasAttribute("recording");
    });
    expect(noAttr).toBe(false);
  });

  test("fires ask-record-start on click when idle", async ({ page }) => {
    await page.goto(url("ask-voice-input"));
    const fired = await page.evaluate(() => {
      const el = document.querySelector("ask-voice-input");
      if (!el) return false;
      return new Promise<boolean>((resolve) => {
        el.addEventListener("ask-record-start", (() => resolve(true)) as EventListener, { once: true });
        const btn = el.shadowRoot?.querySelector(".voice-btn") as HTMLElement;
        btn?.click();
      });
    });
    expect(fired).toBe(true);
  });

  test("fires ask-record-stop on click when recording", async ({ page }) => {
    await page.goto(url("ask-voice-input"));
    const fired = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-voice-input")[1]; // recording
      if (!el) return false;
      return new Promise<boolean>((resolve) => {
        el.addEventListener("ask-record-stop", (() => resolve(true)) as EventListener, { once: true });
        const btn = el.shadowRoot?.querySelector(".voice-btn") as HTMLElement;
        btn?.click();
      });
    });
    expect(fired).toBe(true);
  });

  test("disabled button does not fire events", async ({ page }) => {
    await page.goto(url("ask-voice-input"));
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-voice-input")[2]; // disabled
      if (!el) return;
      el.addEventListener("ask-record-start", (() => {
        (window as any).voiceFired = true;
      }) as EventListener, { once: true });
      const btn = el.shadowRoot?.querySelector(".voice-btn") as HTMLElement;
      btn?.click();
    });
    await page.waitForTimeout(100);
    const firedResult = await page.evaluate(() => (window as any).voiceFired);
    expect(firedResult).toBeFalsy();
  });

  test("shows timer while recording", async ({ page }) => {
    await page.goto(url("ask-voice-input"));
    const hasTimer = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-voice-input")[1]; // recording
      if (!el?.shadowRoot) return false;
      return !!el.shadowRoot.querySelector(".voice-timer");
    });
    expect(hasTimer).toBe(true);
  });
});
