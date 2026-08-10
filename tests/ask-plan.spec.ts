import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-plan", () => {
  test("renders the plan body", async ({ page }) => {
    await page.goto(url("ask-plan"));
    const body = await page.evaluate(() => {
      const el = document.querySelector("ask-plan");
      return el?.shadowRoot?.querySelector(".body")?.textContent;
    });
    expect(body).toContain("Step 1: Refactor the adapter");
  });

  test("pending plan shows approve/reject buttons", async ({ page }) => {
    await page.goto(url("ask-plan"));
    const hasButtons = await page.evaluate(() => {
      const el = document.querySelector("ask-plan");
      const shadow = el?.shadowRoot;
      return !!shadow?.querySelector(".btn-approve") && !!shadow?.querySelector(".btn-reject");
    });
    expect(hasButtons).toBe(true);
  });

  test("approved plan shows chip without buttons", async ({ page }) => {
    await page.goto(url("ask-plan"));
    const approved = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-plan")[1];
      const shadow = el?.shadowRoot;
      return {
        chip: shadow?.querySelector(".status-chip")?.textContent,
        hasButtons: !!shadow?.querySelector(".btn-approve"),
      };
    });
    expect(approved.chip).toBe("Approved");
    expect(approved.hasButtons).toBe(false);
  });

  test("dispatches plan-approved with the plan", async ({ page }) => {
    await page.goto(url("ask-plan"));
    const detail = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("ask-plan")!;
        el.addEventListener("plan-approved", (e: Event) => resolve((e as CustomEvent).detail));
        el.shadowRoot!.querySelector(".btn-approve")!.dispatchEvent(new Event("click"));
      });
    });
    expect(detail).toEqual({ plan: "Step 1: Refactor the adapter\nStep 2: Add tests" });
  });
});
