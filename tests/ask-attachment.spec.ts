import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-attachment", () => {
  test("renders file name", async ({ page }) => {
    await page.goto(url("ask-attachment"));
    const name = await page.evaluate(() => {
      const el = document.querySelector("ask-attachment");
      return (el as any)?.name;
    });
    expect(name).toBe("report.pdf");
  });

  test("formats size correctly", async ({ page }) => {
    await page.goto(url("ask-attachment"));
    const sizeText = await page.evaluate(() => {
      const el = document.querySelector("ask-attachment");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".attachment-size")?.textContent;
    });
    expect(sizeText).toBe("1.0MB");
  });

  test("shows PDF icon for PDF type", async ({ page }) => {
    await page.goto(url("ask-attachment"));
    const icon = await page.evaluate(() => {
      const el = document.querySelector("ask-attachment");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".attachment-preview")?.textContent?.trim();
    });
    expect(icon).toBe("📕");
  });

  test("shows remove button when removable", async ({ page }) => {
    await page.goto(url("ask-attachment"));
    const hasBtn = await page.evaluate(() => {
      const el = document.querySelector("ask-attachment");
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".attachment-remove");
    });
    expect(hasBtn).toBe(true);
  });

  test("hides remove button when not removable", async ({ page }) => {
    await page.goto(url("ask-attachment"));
    const hasBtn = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-attachment")[2];
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".attachment-remove");
    });
    expect(hasBtn).toBe(false);
  });

  test("fires ask-remove event on remove click", async ({ page }) => {
    await page.goto(url("ask-attachment"));
    const detail = await page.evaluate(() => {
      const el = document.querySelector("ask-attachment");
      if (!el) return null;
      return new Promise((resolve) => {
        el.addEventListener("ask-remove", ((e: CustomEvent) => resolve(e.detail)) as EventListener, { once: true });
        const btn = el.shadowRoot?.querySelector(".attachment-remove") as HTMLElement;
        btn?.click();
      });
    });
    expect(detail).toEqual({ name: "report.pdf" });
  });
});
