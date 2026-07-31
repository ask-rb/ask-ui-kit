import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-conversation-list", () => {
  test("renders conversation items", async ({ page }) => {
    await page.goto(url("ask-conversation-list"));
    const titles = await page.evaluate(() => {
      const el = document.querySelector("ask-conversation-list");
      if (!el?.shadowRoot) return [];
      return Array.from(el.shadowRoot.querySelectorAll(".item-title")).map(t => t.textContent);
    });
    expect(titles).toContain("Hello World");
    expect(titles).toContain("Second Chat");
    expect(titles).toContain("Old Conversation");
  });

  test("shows section headers", async ({ page }) => {
    await page.goto(url("ask-conversation-list"));
    const sections = await page.evaluate(() => {
      const el = document.querySelector("ask-conversation-list");
      if (!el?.shadowRoot) return [];
      return Array.from(el.shadowRoot.querySelectorAll(".section-header")).map(s => s.textContent);
    });
    expect(sections).toContain("Open");
    expect(sections).toContain("Closed");
  });

  test("highlights active conversation", async ({ page }) => {
    await page.goto(url("ask-conversation-list"));
    const active = await page.evaluate(() => {
      const el = document.querySelector("ask-conversation-list");
      if (!el?.shadowRoot) return [];
      return Array.from(el.shadowRoot.querySelectorAll(".conversation-item")).map(c =>
        c.classList.contains("conversation-item--active")
      );
    });
    expect(active[1]).toBe(true); // Second Chat is activeId="2"
    expect(active[0]).toBe(false);
  });

  test("fires ask-select event on click", async ({ page }) => {
    await page.goto(url("ask-conversation-list"));
    const detail = await page.evaluate(() => {
      const el = document.querySelector("ask-conversation-list");
      if (!el) return null;
      return new Promise((resolve) => {
        el.addEventListener("ask-select", ((e: CustomEvent) => resolve(e.detail)) as EventListener, { once: true });
        const items = el.shadowRoot?.querySelectorAll(".conversation-item");
        (items?.[0] as HTMLElement)?.click();
      });
    });
    expect(detail).toEqual({ id: "1" });
  });

  test("shows empty state when no items", async ({ page }) => {
    await page.goto(url("ask-conversation-list"));
    const isEmpty = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-conversation-list")[1];
      if (!el?.shadowRoot) return false;
      return !!el.shadowRoot.querySelector(".empty-state");
    });
    expect(isEmpty).toBe(true);
  });

  test("shows message count", async ({ page }) => {
    await page.goto(url("ask-conversation-list"));
    const meta = await page.evaluate(() => {
      const el = document.querySelector("ask-conversation-list");
      if (!el?.shadowRoot) return [];
      return Array.from(el.shadowRoot.querySelectorAll(".item-meta")).map(m => m.textContent);
    });
    expect(meta[0]).toContain("3 messages");
  });
});
