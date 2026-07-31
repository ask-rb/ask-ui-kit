import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-code-block", () => {
  test("renders code content", async ({ page }) => {
    await page.goto(url("ask-code-block"));

    const code = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { code: string }>("ask-code-block");
      return el?.code;
    });
    expect(code).toBe('console.log("hello");');
  });

  test("shows language label when provided", async ({ page }) => {
    await page.goto(url("ask-code-block"));

    const lang = await page.evaluate(() => {
      const el = document.querySelector("ask-code-block");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".code-language")?.textContent;
    });
    expect(lang).toBe("javascript");
  });

  test("defaults to 'code' when no language", async ({ page }) => {
    await page.goto(url("ask-code-block"));

    const lang = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-code-block")[1];
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".code-language")?.textContent;
    });
    expect(lang).toBe("code");
  });

  test("renders empty when no code", async ({ page }) => {
    await page.goto(url("ask-code-block"));

    const hasShadow = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-code-block")[2]; // empty
      if (!el?.shadowRoot) return false;
      return el.shadowRoot.textContent !== "";
    });
    expect(hasShadow).toBe(false);
  });

  test("has copy button", async ({ page }) => {
    await page.goto(url("ask-code-block"));

    const hasBtn = await page.evaluate(() => {
      const el = document.querySelector("ask-code-block");
      if (!el?.shadowRoot) return false;
      return !!el.shadowRoot.querySelector(".code-copy-btn");
    });
    expect(hasBtn).toBe(true);
  });

  test("copy button shows 📋 label", async ({ page }) => {
    await page.goto(url("ask-code-block"));

    const btnText = await page.evaluate(() => {
      const el = document.querySelector("ask-code-block");
      if (!el?.shadowRoot) return null;
      return el.shadowRoot.querySelector(".code-copy-btn")?.textContent?.trim();
    });
    expect(btnText).toContain("📋");
    expect(btnText).toContain("Copy");
  });

  test("renders code inside <pre><code>", async ({ page }) => {
    await page.goto(url("ask-code-block"));

    const preCode = await page.evaluate(() => {
      const el = document.querySelector("ask-code-block");
      if (!el?.shadowRoot) return null;
      const pre = el.shadowRoot.querySelector(".code-body");
      const code = pre?.querySelector("code");
      return code?.textContent;
    });
    expect(preCode).toBe('console.log("hello");');
  });
});
