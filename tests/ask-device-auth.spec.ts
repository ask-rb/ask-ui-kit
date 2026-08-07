import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-device-auth", () => {
  test("renders the verification URI, user code, and steps", async ({ page }) => {
    await page.goto(url("ask-device-auth"));
    await page.evaluate(() => {
      const el = document.querySelector("ask-device-auth");
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      const text = root.textContent ?? "";
      if (!text.includes("https://auth.x.ai/activate")) throw new Error("missing verification uri");
      if (!text.includes("ABCD-EFGH")) throw new Error("missing user code");
      if (!text.includes("1. Open this link")) throw new Error("missing step 1");
      if (!text.includes("2. Enter this code")) throw new Error("missing step 2");
      if (!text.includes("3. Authorize")) throw new Error("missing step 3");
      const link = root.querySelector("a") as HTMLAnchorElement;
      if (link?.getAttribute("href") !== "https://auth.x.ai/activate") throw new Error("wrong link href");
      if (link?.getAttribute("target") !== "_blank") throw new Error("link should open in a new tab");
    });
  });

  test("emits ask-authorize when the complete button is clicked", async ({ page }) => {
    await page.goto(url("ask-device-auth"));
    const fired = await page.evaluate(() => {
      const el = document.querySelector("ask-device-auth");
      return new Promise<boolean>((resolve) => {
        el?.addEventListener("ask-authorize", () => resolve(true));
        const root = el?.shadowRoot;
        (root?.querySelector(".authorize") as HTMLElement)?.click();
      });
    });
    expect(fired).toBe(true);
  });

  test("pending shows the not-authorized notice", async ({ page }) => {
    await page.goto(url("ask-device-auth"));
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-device-auth")[1];
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (!root.textContent?.includes("Not authorized yet")) {
        throw new Error("pending instance should show the notice");
      }
    });
  });

  test("non-pending instances hide the notice", async ({ page }) => {
    await page.goto(url("ask-device-auth"));
    await page.evaluate(() => {
      const el = document.querySelector("ask-device-auth");
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (root.textContent?.includes("Not authorized yet")) {
        throw new Error("non-pending instance should not show the notice");
      }
    });
  });

  test("expires-label renders the meta line", async ({ page }) => {
    await page.goto(url("ask-device-auth"));
    await page.evaluate(() => {
      const el = document.querySelector("ask-device-auth");
      const root = el?.shadowRoot;
      if (!root) throw new Error("no shadow root");
      if (!root.textContent?.includes("The code expires in 5 minutes")) {
        throw new Error("expires label should appear in the meta line");
      }
    });
  });
});
