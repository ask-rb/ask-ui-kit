import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-chat-input", () => {
  test("renders with default placeholder", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const placeholder = await page.evaluate(() => {
      const el = document.querySelector("ask-chat-input");
      if (!el?.shadowRoot) return null;
      const ta = el.shadowRoot.querySelector(".input-textarea") as HTMLTextAreaElement;
      return ta?.placeholder;
    });
    expect(placeholder).toBe("Type a message...");
  });

  test("accepts custom placeholder", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const placeholder = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-chat-input")[1];
      if (!el?.shadowRoot) return null;
      const ta = el.shadowRoot.querySelector(".input-textarea") as HTMLTextAreaElement;
      return ta?.placeholder;
    });
    expect(placeholder).toBe("Ask me anything...");
  });

  test("has send button visible by default", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const sendVisible = await page.evaluate(() => {
      const el = document.querySelector("ask-chat-input");
      if (!el?.shadowRoot) return null;
      const send = el.shadowRoot.querySelector(".btn-send") as HTMLElement;
      return send?.style.display !== "none";
    });
    expect(sendVisible).toBe(true);
  });

  test("shows stop button when streaming", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const stopVisible = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-chat-input")[2]; // streaming
      if (!el?.shadowRoot) return null;
      const stop = el.shadowRoot.querySelector(".btn-stop") as HTMLElement;
      return stop?.classList.contains("btn-hidden") === false;
    });
    expect(stopVisible).toBe(true);

    const sendHidden = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-chat-input")[2];
      if (!el?.shadowRoot) return null;
      const send = el.shadowRoot.querySelector(".btn-send") as HTMLElement;
      return send?.classList.contains("btn-hidden");
    });
    expect(sendHidden).toBe(true);
  });

  test("disables textarea when disabled", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const isDisabled = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-chat-input")[3]; // disabled
      if (!el?.shadowRoot) return null;
      const ta = el.shadowRoot.querySelector(".input-textarea") as HTMLTextAreaElement;
      return ta?.disabled;
    });
    expect(isDisabled).toBe(true);
  });

  test("fires ask-submit event on Enter", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const eventData = await page.evaluate(() => {
      const el = document.querySelector("ask-chat-input");
      if (!el) return null;

      return new Promise((resolve) => {
        el.addEventListener("ask-submit", ((e: CustomEvent) => {
          resolve(e.detail);
        }) as EventListener, { once: true });

        // Type in the textarea and press Enter
        const ta = el.shadowRoot?.querySelector(".input-textarea") as HTMLTextAreaElement;
        if (ta) {
          ta.value = "hello";
          ta.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
          ta.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        }
      });
    });

    expect(eventData).toEqual({ value: "hello" });
  });

  test("does not fire submit on Shift+Enter", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const fired = await page.evaluate(() => {
      const el = document.querySelector("ask-chat-input");
      if (!el) return Promise.resolve(false);

      return new Promise<boolean>((resolve) => {
        let didFire = false;
        el.addEventListener("ask-submit", (() => {
          didFire = true;
        }) as EventListener, { once: true });

        const ta = el.shadowRoot?.querySelector(".input-textarea") as HTMLTextAreaElement;
        if (ta) {
          ta.value = "hello";
          ta.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter", shiftKey: true, bubbles: true, cancelable: true,
          }));
        }

        // Wait a frame to see if the event fires
        setTimeout(() => resolve(didFire), 100);
      });
    });

    expect(fired).toBe(false);
  });

  test("fires ask-stop event when stop button clicked", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const eventFired = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-chat-input")[2]; // streaming
      if (!el) return false;

      return new Promise<boolean>((resolve) => {
        el.addEventListener("ask-stop", (() => {
          resolve(true);
        }) as EventListener, { once: true });

        const stopBtn = el.shadowRoot?.querySelector(".btn-stop") as HTMLElement;
        stopBtn?.click();
      });
    });

    expect(eventFired).toBe(true);
  });

  test("streaming property reflects to attribute", async ({ page }) => {
    await page.goto(url("ask-chat-input"));

    const hasStreaming = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-chat-input")[2]; // streaming
      return el?.hasAttribute("streaming");
    });
    expect(hasStreaming).toBe(true);
  });
});
