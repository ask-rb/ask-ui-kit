import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-markdown", () => {
  test("renders bold text", async ({ page }) => {
    await page.goto(url("ask-markdown"));
    const html = await page.evaluate(() => {
      const el = document.querySelector("ask-markdown");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".markdown-content")?.innerHTML;
    });
    expect(html).toContain("<strong>world</strong>");
  });

  test("renders italic text", async ({ page }) => {
    await page.goto(url("ask-markdown"));
    const html = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-markdown")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".markdown-content")?.innerHTML;
    });
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<strong>bold</strong>");
  });

  test("renders inline code", async ({ page }) => {
    await page.goto(url("ask-markdown"));
    const html = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-markdown")[2];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".markdown-content")?.innerHTML;
    });
    expect(html).toContain("<code>code</code>");
  });

  test("renders links", async ({ page }) => {
    await page.goto(url("ask-markdown"));
    const html = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-markdown")[3];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".markdown-content")?.innerHTML;
    });
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain(">link<");
  });

  test("renders pre-rendered HTML via html prop", async ({ page }) => {
    await page.goto(url("ask-markdown"));
    const html = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-markdown")[4];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".markdown-content")?.innerHTML;
    });
    expect(html).toContain("<strong>Pre-rendered</strong>");
  });

  test("renders nothing when empty", async ({ page }) => {
    await page.goto(url("ask-markdown"));
    const hasContent = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-markdown")[5];
      if (!el?.shadowRoot) return false;
      return el.shadowRoot.textContent !== "";
    });
    expect(hasContent).toBe(false);
  });
});
