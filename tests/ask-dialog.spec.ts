import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-dialog", () => {
  test("shows the panel when open with header and body", async ({ page }) => {
    await page.goto(url("ask-dialog"));
    const header = await page.evaluate(() => {
      const el = document.querySelector("#d1");
      return el?.shadowRoot?.querySelector("h3")?.textContent;
    });
    expect(header).toBe("Open workspace");

    const body = await page.evaluate(() => {
      const el = document.querySelector("#d1");
      return el?.shadowRoot?.querySelector(".body")?.textContent?.trim();
    });
    expect(body).toContain("Path to a project directory");
  });

  test("hidden dialog renders nothing", async ({ page }) => {
    await page.goto(url("ask-dialog"));
    const visible = await page.evaluate(() => {
      const el = document.querySelector("#d2");
      return getComputedStyle(el).display;
    });
    expect(visible).toBe("none");
  });

  test("close button dismisses and emits dialog-close", async ({ page }) => {
    await page.goto(url("ask-dialog"));
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#d1")!;
        el.addEventListener("dialog-close", () => resolve("closed"));
        el.shadowRoot!.querySelector(".close")!.dispatchEvent(new Event("click"));
      });
    });
    expect(result).toBe("closed");
  });

  test("backdrop click dismisses", async ({ page }) => {
    await page.goto(url("ask-dialog"));
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#d1")!;
        el.addEventListener("dialog-close", () => resolve("closed"));
        const overlay = el.shadowRoot!.querySelector(".overlay")!;
        overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    });
    expect(result).toBe("closed");
  });
});
