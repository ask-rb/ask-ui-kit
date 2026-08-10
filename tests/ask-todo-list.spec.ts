import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-todo-list", () => {
  test("renders nothing when empty", async ({ page }) => {
    await page.goto(url("ask-todo-list"));
    const items = await page.evaluate(() => {
      const el = document.querySelector("ask-todo-list");
      return el?.shadowRoot?.querySelectorAll(".todo").length ?? 0;
    });
    expect(items).toBe(0);
  });

  test("renders todo items with statuses", async ({ page }) => {
    await page.goto(url("ask-todo-list"));
    const titles = await page.evaluate(() => {
      const el = document.querySelector("#with-items");
      return Array.from(el?.shadowRoot?.querySelectorAll(".title") ?? []).map((n) => n.textContent);
    });
    expect(titles).toEqual([
      "Write the adapter tests",
      "Run the full suite",
      "Commit",
    ]);

    const statuses = await page.evaluate(() => {
      const el = document.querySelector("#with-items");
      return Array.from(el?.shadowRoot?.querySelectorAll(".status") ?? []).map((n) => n.textContent);
    });
    expect(statuses).toEqual(["in progress", "pending", "completed"]);
  });

  test("completed items get the completed class", async ({ page }) => {
    await page.goto(url("ask-todo-list"));
    const hasCompleted = await page.evaluate(() => {
      const el = document.querySelector("#with-items");
      return !!el?.shadowRoot?.querySelector(".todo--completed");
    });
    expect(hasCompleted).toBe(true);
  });
});
