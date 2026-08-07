import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

async function selectEvent(page: import("@playwright/test").Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement;
    return new Promise<{ id: string }>((resolve) => {
      el.addEventListener("ask-select", (e) =>
        resolve((e as CustomEvent).detail as { id: string })
      );
    });
  }, selector);
}

test.describe("ask-sidebar", () => {
  test("renders group headers and nested conversations", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    await page.evaluate(() => {
      const el = document.querySelector("ask-sidebar");
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      const text = root.textContent ?? "";
      if (!text.includes("Sites") || !text.includes("Chats")) throw new Error("missing groups");
      if (!text.includes("Ruby on Rails")) throw new Error("missing site node");
      if (!text.includes("Migrations help")) throw new Error("missing nested conversation");
    });
  });

  test("emits ask-select when a conversation is clicked", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    const promise = selectEvent(page, "ask-sidebar");
    await page.evaluate(() => {
      const el = document.querySelector("ask-sidebar");
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      const labels = Array.from(root.querySelectorAll(".node-label")) as HTMLElement[];
      const target = labels.find((l) => l.textContent === "Migrations help");
      (target?.closest(".node") as HTMLElement)?.click();
    });
    const detail = await promise;
    expect(detail.id).toBe("chat-1");
  });

  test("collapsed group hides its nodes until the header is clicked", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-sidebar")[1];
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (root.textContent?.includes("collapsed group chat")) {
        throw new Error("collapsed group should hide its nodes");
      }
      const headers = Array.from(root.querySelectorAll(".group-header")) as HTMLElement[];
      headers[0]?.click();
    });
    await page.waitForTimeout(50);
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-sidebar")[1];
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (!root.textContent?.includes("collapsed group chat")) {
        throw new Error("group should reveal its nodes after toggle");
      }
    });
  });

  test("site node expands to reveal its conversations", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    await page.evaluate(() => {
      const el = document.querySelector("ask-sidebar");
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      const buttons = Array.from(root.querySelectorAll(".node")) as HTMLElement[];
      const ruby = buttons.find((b) => b.textContent?.includes("ruby-lang.org"));
      ruby?.click();
    });
    await page.waitForTimeout(50);
    await page.evaluate(() => {
      const el = document.querySelector("ask-sidebar");
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (!root.textContent?.includes("Syntax question")) {
        throw new Error("expanded site should show its conversations");
      }
    });
  });

  test("emits ask-new-chat from the New chat button", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    const fired = await page.evaluate(() => {
      const el = document.querySelector("ask-sidebar");
      return new Promise<boolean>((resolve) => {
        el?.addEventListener("ask-new-chat", () => resolve(true));
        const root = el?.shadowRoot;
        (root?.querySelector(".new-chat") as HTMLElement)?.click();
      });
    });
    expect(fired).toBe(true);
  });

  test("empty groups render an empty state, not a crash", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-sidebar")[2];
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (!root.textContent?.includes("No conversations")) {
        throw new Error("expected an empty state");
      }
    });
  });

  test("kebab-case attributes map to properties", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    await page.evaluate(() => {
      const first = document.querySelector("ask-sidebar");
      if (first?.activeId !== "chat-2") throw new Error(`active-id not mapped (got ${first?.activeId})`);
      const second = document.querySelectorAll("ask-sidebar")[1];
      if (second?.newChatLabel !== "Start a chat") {
        throw new Error(`new-chat-label not mapped (got ${second?.newChatLabel})`);
      }
    });
  });

  test("collapse state survives a reload (sessionStorage)", async ({ page }) => {
    await page.goto(url("ask-sidebar"));
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-sidebar")[1];
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (root.textContent?.includes("collapsed group chat")) {
        throw new Error("group should start collapsed (fixture default)");
      }
      (Array.from(root.querySelectorAll(".group-header")) as HTMLElement[])[0]?.click();
    });
    await page.reload();
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-sidebar")[1];
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (!root.textContent?.includes("collapsed group chat")) {
        throw new Error("expanded state should be restored from sessionStorage after reload");
      }
    });
  });
});
