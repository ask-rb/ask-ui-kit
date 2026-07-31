import { test, expect } from "@playwright/test";
function url(n: string) { return `/tests/fixtures/${n}.html`; }

test.describe("ask-file-upload", () => {
  test("renders dropzone", async ({ page }) => {
    await page.goto(url("ask-file-upload"));
    const hasDropzone = await page.evaluate(() => {
      const el = document.querySelector("ask-file-upload");
      if (!el?.shadowRoot) return false;
      return !!el.shadowRoot.querySelector(".dropzone");
    });
    expect(hasDropzone).toBe(true);
  });

  test("accepts files via JSON files prop", async ({ page }) => {
    await page.goto(url("ask-file-upload"));
    // Set files programmatically via page.evaluate
    await page.evaluate(() => {
      const el = document.querySelector("ask-file-upload") as any;
      if (el) {
        el.files = JSON.stringify([
          { name: "test.pdf", size: 1024, type: "application/pdf" },
          { name: "notes.txt", size: 512, type: "text/plain" },
        ]);
      }
    });
    await page.waitForTimeout(200);
    // Check that attachment elements appear (inner component renders them)
    const attachCount = await page.locator("ask-attachment").count();
    expect(attachCount).toBe(2);
  });

  test("fires ask-files-select on file input change", async ({ page }) => {
    await page.goto(url("ask-file-upload"));
    // Programmatically trigger the file input
    const detail = await page.evaluate(() => {
      const el = document.querySelector("ask-file-upload");
      if (!el) return null;
      return new Promise((resolve) => {
        el.addEventListener("ask-files-select", ((e: CustomEvent) => {
          resolve(e.detail);
        }) as EventListener, { once: true });
        // Create a FileList-like object
        const input = el.shadowRoot?.querySelector(".dropzone-input") as HTMLInputElement;
        if (input) {
          const file = new File(["test"], "test.txt", { type: "text/plain" });
          const dt = new DataTransfer();
          dt.items.add(file);
          Object.defineProperty(input, "files", { value: dt.files });
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });
    expect(detail).toBeDefined();
    expect((detail as any)?.files?.length).toBe(1);
    expect((detail as any)?.files[0]?.name).toBe("test.txt");
  });

  test("disabled prop prevents interaction", async ({ page }) => {
    await page.goto(url("ask-file-upload"));
    const isDisabled = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-file-upload")[2];
      if (!el?.shadowRoot) return false;
      return el.shadowRoot.querySelector(".dropzone")?.classList.contains("dropzone--disabled");
    });
    expect(isDisabled).toBe(true);
  });
});
