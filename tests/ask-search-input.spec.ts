import { test, expect } from "@playwright/test";

function url(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-search-input", () => {
  test("emits search-input with the value", async ({ page }) => {
    await page.goto(url("ask-search-input"));
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#s1")!;
        el.addEventListener("search-input", (e: Event) => resolve((e as CustomEvent).detail));
        const input = el.shadowRoot!.querySelector("input")!;
        input.value = "login";
        input.dispatchEvent(new Event("input"));
      });
    });
    expect(result).toEqual({ value: "login" });
  });

  test("clear button empties the value", async ({ page }) => {
    await page.goto(url("ask-search-input"));
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const el = document.querySelector("#s1")!;
        const input = el.shadowRoot!.querySelector("input")!;
        input.value = "login";
        input.dispatchEvent(new Event("input"));
        el.addEventListener("search-input", (e: Event) => resolve((e as CustomEvent).detail));
        el.shadowRoot!.querySelector(".clear")!.dispatchEvent(new Event("click"));
      });
    });
    expect(result).toEqual({ value: "" });
  });
});
