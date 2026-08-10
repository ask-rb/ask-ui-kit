import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-conversation-item", () => {
  test("renders title and meta", async ({ page }) => {
    await page.goto(url("ask-conversation-item"));
    const title = await page.evaluate(() => {
      const el = document.querySelector("#c1");
      return el?.shadowRoot?.querySelector(".title")?.textContent;
    });
    expect(title).toBe("Fix the login bug");

    const meta = await page.evaluate(() => {
      const el = document.querySelector("#c1");
      return el?.shadowRoot?.querySelector(".meta")?.textContent;
    });
    expect(meta).toBe("3 msgs");
  });

  test("clicking the row emits conversation-select", async ({ page }) => {
    await page.goto(url("ask-conversation-item"));
    const detail = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#c1")!;
        el.addEventListener("conversation-select", (e: Event) => resolve((e as CustomEvent).detail));
        el.shadowRoot!.querySelector(".item")!.dispatchEvent(new Event("click"));
      });
    });
    expect(detail).toEqual({ id: "c1" });
  });

  test("hover actions emit rename/archive/delete", async ({ page }) => {
    await page.goto(url("ask-conversation-item"));
    const events = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#c1")!;
        const seen: string[] = [];
        for (const type of ["conversation-rename", "conversation-archive", "conversation-delete"]) {
          el.addEventListener(type, () => seen.push(type));
        }
        const btns = el.shadowRoot!.querySelectorAll(".mini");
        btns.forEach((b) => b.dispatchEvent(new Event("click")));
        resolve(seen);
      });
    });
    expect(events).toEqual(["conversation-rename", "conversation-archive", "conversation-delete"]);
  });
});
