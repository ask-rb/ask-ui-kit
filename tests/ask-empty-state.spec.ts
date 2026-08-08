import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-empty-state", () => {
  test("renders the heading and default icon", async ({ page }) => {
    await page.goto(url("ask-empty-state"));
    const data = await page.evaluate(() => {
      const el = document.querySelector("ask-empty-state")!;
      const root = el.shadowRoot!;
      return {
        heading: root.querySelector(".heading")?.textContent,
        hasDefaultIcon: !!root.querySelector('slot[name="icon"] svg'),
      };
    });
    expect(data.heading).toBe("What should we work on in ask-rb?");
    expect(data.hasDefaultIcon).toBe(true);
  });

  test("slots body content", async ({ page }) => {
    await page.goto(url("ask-empty-state"));
    const bodyText = await page.evaluate(() => {
      const el = document.querySelector("ask-empty-state")!;
      const slot = el.shadowRoot!.querySelector(".body slot")!;
      return slot.assignedElements().map((n) => n.textContent).join("");
    });
    expect(bodyText).toBe("Body content");
  });

  test("custom icon slot replaces the default", async ({ page }) => {
    await page.goto(url("ask-empty-state"));
    const custom = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-empty-state")[1]!;
      const slot = el.shadowRoot!.querySelector('slot[name="icon"]');
      return slot!.assignedElements().length;
    });
    expect(custom).toBe(1);
  });

  test("renders without heading", async ({ page }) => {
    await page.goto(url("ask-empty-state"));
    const hasHeading = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-empty-state")[2]!;
      return !!el.shadowRoot!.querySelector(".heading");
    });
    expect(hasHeading).toBe(false);
  });
});
