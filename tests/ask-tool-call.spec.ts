import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-tool-call", () => {
  test("renders with tool name", async ({ page }) => {
    await page.goto(url("ask-tool-call"));

    const names = await page.evaluate(() => {
      const els = document.querySelectorAll("ask-tool-call");
      return Array.from(els).map((el) => (el as any).name);
    });
    expect(names).toEqual(["Read File", "Extract Data", "Process PDF", "Default Tool"]);
  });

  test("shows spinning icon when running", async ({ page }) => {
    await page.goto(url("ask-tool-call"));

    const icon = await page.evaluate(() => {
      const el = document.querySelector("ask-tool-call");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-icon")?.textContent;
    });
    expect(icon).toBe("⚙");

    const hasSpinClass = await page.evaluate(() => {
      const el = document.querySelector("ask-tool-call");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-icon")?.classList.contains("tool-icon--running");
    });
    expect(hasSpinClass).toBe(true);
  });

  test("shows checkmark when done", async ({ page }) => {
    await page.goto(url("ask-tool-call"));

    const icon = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-tool-call")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-icon")?.textContent;
    });
    expect(icon).toBe("✓");

    const hasSpin = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-tool-call")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-icon")?.classList.contains("tool-icon--running");
    });
    expect(hasSpin).toBe(false);
  });

  test("shows cross when failed with error styling", async ({ page }) => {
    await page.goto(url("ask-tool-call"));

    const icon = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-tool-call")[2];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-icon")?.textContent;
    });
    expect(icon).toBe("✕");

    const hasErrorClass = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-tool-call")[2];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-card")?.classList.contains("tool-card--failed");
    });
    expect(hasErrorClass).toBe(true);
  });

  test("shows duration when provided", async ({ page }) => {
    await page.goto(url("ask-tool-call"));

    const duration = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-tool-call")[1]; // done with duration
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-duration")?.textContent;
    });
    expect(duration).toBe("1234ms");

    // Running tool should NOT have duration (0 = no display)
    const noDuration = await page.evaluate(() => {
      const el = document.querySelector("ask-tool-call"); // running, no duration
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".tool-duration");
    });
    expect(noDuration).toBeNull();
  });

  test("status label changes with status", async ({ page }) => {
    await page.goto(url("ask-tool-call"));

    const labels = await page.evaluate(() => {
      const els = document.querySelectorAll("ask-tool-call");
      return Array.from(els).map((el) => {
        if (!el.shadowRoot) return null;
        return el.shadowRoot.querySelector(".tool-status")?.textContent;
      });
    });
    expect(labels).toEqual(["running", "done", "failed", "running"]);
  });
});
