import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-tool-approval", () => {
  test("renders tool name and args for pending action", async ({ page }) => {
    await page.goto(url("ask-tool-approval"));
    const name = await page.evaluate(() => {
      const el = document.querySelector("ask-tool-approval");
      return el?.shadowRoot?.querySelector(".tool-name")?.textContent;
    });
    expect(name).toBe("bash");

    const args = await page.evaluate(() => {
      const el = document.querySelector("ask-tool-approval");
      return el?.shadowRoot?.querySelector(".args")?.textContent;
    });
    expect(args).toContain("rm -rf tmp");
  });

  test("pending shows approve/reject buttons", async ({ page }) => {
    await page.goto(url("ask-tool-approval"));
    const hasButtons = await page.evaluate(() => {
      const el = document.querySelector("ask-tool-approval");
      const shadow = el?.shadowRoot;
      return !!shadow?.querySelector(".btn-approve") && !!shadow?.querySelector(".btn-reject");
    });
    expect(hasButtons).toBe(true);
  });

  test("resolved actions show status chip and no buttons", async ({ page }) => {
    await page.goto(url("ask-tool-approval"));
    const approved = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-tool-approval")[1];
      const shadow = el?.shadowRoot;
      return {
        chip: shadow?.querySelector(".status-chip")?.textContent,
        hasButtons: !!shadow?.querySelector(".btn-approve"),
      };
    });
    expect(approved.chip).toBe("Approved");
    expect(approved.hasButtons).toBe(false);
  });

  test("dispatches approval-approved on click", async ({ page }) => {
    await page.goto(url("ask-tool-approval"));
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("ask-tool-approval")!;
        el.addEventListener("approval-approved", (e: Event) => {
          resolve((e as CustomEvent).detail);
        });
        el.shadowRoot!.querySelector(".btn-approve")!.dispatchEvent(new Event("click"));
      });
    });
    expect(result).toEqual({ id: 7 });
  });

  test("dispatches approval-rejected on click", async ({ page }) => {
    await page.goto(url("ask-tool-approval"));
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("ask-tool-approval")!;
        el.addEventListener("approval-rejected", (e: Event) => {
          resolve((e as CustomEvent).detail);
        });
        el.shadowRoot!.querySelector(".btn-reject")!.dispatchEvent(new Event("click"));
      });
    });
    expect(result).toEqual({ id: 7 });
  });
});
