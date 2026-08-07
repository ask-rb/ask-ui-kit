/* eslint-disable no-useless-escape -- intentional: \\/</script> escapes keep the HTML parser from closing the template */
import { test, expect } from "@playwright/test";

// Real-scenario tests run against fixture pages loaded via page.goto —
// page.setContent does not execute module scripts, so fixtures are the
// only reliable way to exercise the bundled components end to end.
function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("Real scenario", () => {
  test("streaming with special characters in content", async ({ page }) => {
    const errors: { msg: string; stack?: string }[] = [];
    page.on("pageerror", (e) => errors.push({ msg: e.message, stack: e.stack }));

    await page.goto(url("real-scenario-streaming"));
    await page.waitForTimeout(500);

    const label = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      return (el as any)?.label;
    });

    expect(label).toBe("Thought for 2s");
    expect(errors.length).toBe(0);
  });

  test("ask-message with HTML-escaped content in attributes", async ({ page }) => {
    await page.goto(url("real-scenario-message"));
    await page.waitForTimeout(500);

    // Verify properties are correctly decoded from HTML entities
    const userContent = await page.evaluate(() => {
      const el = document.querySelector("ask-message");
      return (el as any)?.content;
    });
    expect(userContent).toBe('Hello "World" with <tags>');

    const assistantContent = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-message")[1];
      return (el as any)?.content;
    });
    expect(assistantContent).toBe("Normal text here");
  });
});
