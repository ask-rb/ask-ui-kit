import { test, expect } from "@playwright/test";

function fixtureUrl(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-message", () => {
  test("renders with default role and empty content", async ({ page }) => {
    await page.goto(fixtureUrl("ask-message"));

    // Check the empty <ask-message></ask-message> (third instance)
    const props = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-message")[2] as HTMLElement & { role: string; content: string };
      return { role: el?.role, content: el?.content };
    });
    expect(props).toEqual({ role: "user", content: "" });

    // Also check that all three instances have the right roles
    const allRoles = await page.evaluate(() => {
      const els = document.querySelectorAll<HTMLElement & { role: string }>("ask-message");
      return Array.from(els).map((el) => el.role);
    });
    expect(allRoles).toEqual(["user", "assistant", "user"]);
  });

  test("accepts role and content attributes", async ({ page }) => {
    // Create a fresh element dynamically
    await page.goto(fixtureUrl("ask-message"));

    const props = await page.evaluate(() => {
      const el = document.createElement("ask-message");
      el.setAttribute("role", "assistant");
      el.setAttribute("content", "Hello world");
      document.body.appendChild(el);
      // @ts-expect-error custom element
      return { role: el.role, content: el.content };
    });

    expect(props).toEqual({ role: "assistant", content: "Hello world" });
  });

  test("updates content and role dynamically", async ({ page }) => {
    await page.goto(fixtureUrl("ask-message"));

    const result = await page.evaluate(() => {
      const el = document.createElement("ask-message");
      document.body.appendChild(el);
      // @ts-expect-error custom element
      el.content = "First";
      // @ts-expect-error custom element
      return el.content;
    });
    expect(result).toBe("First");

    const afterUpdate = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { content: string; role: string }>("ask-message");
      if (!el) return null;
      el.content = "Updated";
      el.role = "assistant";
      return { content: el.content, role: el.role };
    });
    expect(afterUpdate).toEqual({ content: "Updated", role: "assistant" });
  });

  test("renders content inside shadow DOM", async ({ page }) => {
    await page.goto(fixtureUrl("ask-message"));

    const hasContent = await page.evaluate(() => {
      const el = document.querySelector("ask-message");
      if (!el) return null;
      const root = el.shadowRoot;
      if (!root) return null;
      return Array.from(root.querySelectorAll("div")).some((d) => d.textContent?.includes("Hello from user"));
    });

    expect(hasContent).toBe(true);
  });

  test("user message has message-row--right class", async ({ page }) => {
    await page.goto(fixtureUrl("ask-message"));

    const hasRight = await page.evaluate(() => {
      const el = document.querySelector("ask-message");
      if (!el?.shadowRoot) return null;
      const outerDiv = el.shadowRoot.children[0] as HTMLElement;
      return outerDiv?.className?.includes("message-row--right");
    });

    expect(hasRight).toBe(true);
  });

  test("assistant message does not have message-row--right class", async ({ page }) => {
    await page.goto(fixtureUrl("ask-message"));

    const hasRight = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-message")[1]; // second is assistant
      if (!el?.shadowRoot) return null;
      const outerDiv = el.shadowRoot.children[0] as HTMLElement;
      return outerDiv?.className?.includes("message-row--right");
    });

    expect(hasRight).toBe(false);
  });

  test("assistant message shows its text content", async ({ page }) => {
    await page.goto(fixtureUrl("ask-message"));

    const text = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-message")[1]; // second is assistant
      if (!el?.shadowRoot) return null;
      const innerDiv = el.shadowRoot.querySelector("div > div");
      return innerDiv?.textContent;
    });

    expect(text).toBe("Hello from assistant");
  });

  test("user message has background color CSS variable applied", async ({ page }) => {
    await page.goto(fixtureUrl("ask-message"));

    const bg = await page.evaluate(() => {
      const el = document.querySelector("ask-message");
      if (!el?.shadowRoot) return null;
      // Find the inner bubble div with background
      const outer = el.shadowRoot.children[0] as HTMLElement;
      const inner = outer.querySelector("div") as HTMLElement;
      return window.getComputedStyle(inner).getPropertyValue("background-color");
    });

    // Should not be transparent (user bubble has a background)
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
  });
});
