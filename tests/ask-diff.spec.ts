import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-diff", () => {
  test("renders the file header with add/remove counts", async ({ page }) => {
    await page.goto(url("ask-diff"));
    const header = await page.evaluate(() => {
      const el = document.querySelector("ask-diff");
      return el?.shadowRoot?.querySelector(".file-header")?.textContent?.trim();
    });
    expect(header).toContain("orders_controller.rb");
    expect(header).toContain("+1");
    expect(header).toContain("−1");
  });

  test("colors added and removed lines", async ({ page }) => {
    await page.goto(url("ask-diff"));
    const addClass = await page.evaluate(() => {
      const el = document.querySelector("ask-diff");
      return !!el?.shadowRoot?.querySelector(".line--add");
    });
    const delClass = await page.evaluate(() => {
      const el = document.querySelector("ask-diff");
      return !!el?.shadowRoot?.querySelector(".line--del");
    });
    expect(addClass).toBe(true);
    expect(delClass).toBe(true);
  });

  test("shows content of the added line", async ({ page }) => {
    await page.goto(url("ask-diff"));
    const addedText = await page.evaluate(() => {
      const el = document.querySelector("ask-diff");
      return el?.shadowRoot?.querySelector(".line--add .content")?.textContent;
    });
    expect(addedText).toContain("where(status: params[:status])");
  });

  test("shows 'No changes' for empty diff", async ({ page }) => {
    await page.goto(url("ask-diff"));
    const empty = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-diff")[1];
      return el?.shadowRoot?.querySelector(".diff--empty")?.textContent;
    });
    expect(empty).toContain("No changes");
  });
});
