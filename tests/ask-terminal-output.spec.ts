import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-terminal-output", () => {
  test("renders output text", async ({ page }) => {
    await page.goto(url("ask-terminal-output"));
    const text = await page.evaluate(() => {
      const el = document.querySelector("ask-terminal-output");
      return el?.shadowRoot?.querySelector(".output")?.textContent;
    });
    expect(text).toContain("line one");
    expect(text).toContain("line two");
  });

  test("shows empty state for no output", async ({ page }) => {
    await page.goto(url("ask-terminal-output"));
    const empty = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-terminal-output")[1];
      return el?.shadowRoot?.querySelector(".output--empty")?.textContent;
    });
    expect(empty).toContain("No output");
  });

  test("clamps long output with show-all toggle", async ({ page }) => {
    await page.goto(url("ask-terminal-output"));
    const before = await page.evaluate(() => {
      const el = document.querySelector("#long");
      const shadow = el?.shadowRoot;
      const output = shadow?.querySelector(".output")?.textContent ?? "";
      return {
        lineCount: output.split("\n").length,
        hasToggle: !!shadow?.querySelector("button"),
      };
    });
    expect(before.lineCount).toBe(3);
    expect(before.hasToggle).toBe(true);

    await page.evaluate(() => {
      const el = document.querySelector("#long")!;
      const shadow = el.shadowRoot!;
      const toggle = Array.from(shadow.querySelectorAll("button")).find((b) => b.textContent === "Show all");
      toggle!.dispatchEvent(new Event("click"));
    });

    const after = await page.evaluate(() => {
      const el = document.querySelector("#long");
      const output = el?.shadowRoot?.querySelector(".output")?.textContent ?? "";
      return output.split("\n").length;
    });
    expect(after).toBe(10);
  });

  test("strips ANSI escape codes", async ({ page }) => {
    await page.goto(url("ask-terminal-output"));
    const stripped = await page.evaluate(async () => {
      const el = document.querySelector("ask-terminal-output")!;
      el.output = "\x1b[31mred text\x1b[0m";
      await (el as any).updateComplete;
      return el.shadowRoot?.querySelector(".output")?.textContent;
    });
    expect(stripped).toContain("red text");
    expect(stripped).not.toContain("\x1b[31m");
  });
});
