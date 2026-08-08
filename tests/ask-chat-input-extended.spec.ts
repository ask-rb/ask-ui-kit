import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-chat-input (extended)", () => {
  test("plain input stays single-row — no toolbar without the slot", async ({ page }) => {
    await page.goto(url("ask-chat-input-extended"));
    const plain = await page.evaluate(() => {
      const el = document.querySelector("#plain")!;
      const root = el.shadowRoot!;
      return {
        hasToolbar: !!root.querySelector(".input-toolbar"),
        hasContext: !!root.querySelector(".input-context"),
        hasSend: !!root.querySelector(".btn-send"),
      };
    });
    expect(plain.hasToolbar).toBe(false);
    expect(plain.hasContext).toBe(false);
    expect(plain.hasSend).toBe(true);
  });

  test("context slot renders above the input", async ({ page }) => {
    await page.goto(url("ask-chat-input-extended"));
    const ctx = await page.evaluate(() => {
      const el = document.querySelector("#toolbar")!;
      const slot = el.shadowRoot!.querySelector('.input-context slot[name="context"]');
      return slot ? slot.assignedElements().map((n) => n.textContent) : [];
    });
    expect(ctx).toEqual(["📁 ask-rb"]);
  });

  test("toolbar slot renders inside the card with the send button", async ({ page }) => {
    await page.goto(url("ask-chat-input-extended"));
    const toolbar = await page.evaluate(() => {
      const el = document.querySelector("#toolbar")!;
      const root = el.shadowRoot!;
      const toolbarEl = root.querySelector(".input-toolbar");
      const slot = toolbarEl?.querySelector('slot[name="toolbar"]');
      return {
        exists: !!toolbarEl,
        buttons: slot
          ? Array.from(slot.assignedElements()[0]?.querySelectorAll("button") ?? []).map((n) => n.textContent?.trim())
          : [],
        hasSendInToolbar: !!toolbarEl?.querySelector(".btn-send"),
        sendInMain: !!root.querySelector(".input-main .btn-send"),
      };
    });
    expect(toolbar.exists).toBe(true);
    expect(toolbar.buttons).toEqual(["+", "🛡 Approve for me"]);
    expect(toolbar.hasSendInToolbar).toBe(true);
    expect(toolbar.sendInMain).toBe(false); // moved to the toolbar row
  });

  test("typing and submit still work with the toolbar", async ({ page }) => {
    await page.goto(url("ask-chat-input-extended"));
    const submitted = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#toolbar")!;
        el.addEventListener("ask-submit", (e: Event) =>
          resolve((e as CustomEvent).detail)
        );
        const textarea = el.shadowRoot!.querySelector("textarea")!;
        textarea.value = "hello codex";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
        );
      });
    });
    expect(submitted).toEqual({ value: "hello codex" });
  });
});
