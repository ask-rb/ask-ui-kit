import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-menu", () => {
  test("opens on trigger click and lists items", async ({ page }) => {
    await page.goto(url("ask-menu"));
    await page.evaluate(() => {
      const el = document.querySelector("#m1")!;
      el.shadowRoot!.querySelector(".trigger")!.dispatchEvent(new Event("click"));
    });
    const labels = await page.evaluate(() => {
      const el = document.querySelector("#m1");
      return Array.from(el?.shadowRoot?.querySelectorAll(".label") ?? []).map((n) => n.textContent);
    });
    expect(labels).toEqual(["project-a", "project-b"]);
  });

  test("marks the active item with a check", async ({ page }) => {
    await page.goto(url("ask-menu"));
    await page.evaluate(() => {
      const el = document.querySelector("#m1")!;
      el.shadowRoot!.querySelector(".trigger")!.dispatchEvent(new Event("click"));
    });
    const checks = await page.evaluate(() => {
      const el = document.querySelector("#m1");
      return el?.shadowRoot?.querySelectorAll(".check").length ?? 0;
    });
    expect(checks).toBe(1);
  });

  test("selecting an item emits menu-select and closes", async ({ page }) => {
    await page.goto(url("ask-menu"));
    const result = await page.evaluate(async () => {
      const el = document.querySelector("#m1")!;
      el.shadowRoot!.querySelector(".trigger")!.dispatchEvent(new Event("click"));
      await (el as any).updateComplete;
      return new Promise((resolve) => {
        el.addEventListener("menu-select", (e: Event) => resolve((e as CustomEvent).detail));
        const items = el.shadowRoot!.querySelectorAll(".item");
        items[1].dispatchEvent(new Event("click"));
      });
    });
    expect(result).toEqual({ id: "b" });
  });

  test("empty menu shows placeholder", async ({ page }) => {
    await page.goto(url("ask-menu"));
    await page.evaluate(() => {
      const el = document.querySelector("#m2")!;
      el.shadowRoot!.querySelector(".trigger")!.dispatchEvent(new Event("click"));
    });
    const empty = await page.evaluate(() => {
      const el = document.querySelector("#m2");
      return el?.shadowRoot?.querySelector(".empty")?.textContent;
    });
    expect(empty).toContain("Nothing here yet");
  });
});
