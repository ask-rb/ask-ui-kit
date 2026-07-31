import { test, expect } from "@playwright/test";

function fixtureUrl(name: string) {
  return `/tests/fixtures/${name}.html`;
}

test.describe("ask-thinking", () => {
  test("renders nothing when content is empty", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const emptyHasShadow = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[2]; // third is empty
      if (!el) return null;
      return el.shadowRoot !== null;
    });

    // The element exists but renders nothing (returns empty template)
    const hasBodyText = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[2];
      if (!el?.shadowRoot) return false;
      return el.shadowRoot.textContent !== "";
    });

    expect(hasBodyText).toBe(false);
  });

  test("renders with content", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const hasShadow = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      return el?.shadowRoot !== null;
    });
    expect(hasShadow).toBe(true);

    const content = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { content: string }>("ask-thinking");
      return el?.content;
    });
    expect(content).toBe("I need to analyze the user's request step by step...");
  });

  test("default label is Thought", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const labelText = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return null;
      const labelEl = el.shadowRoot.querySelector(".thinking-label");
      return labelEl?.textContent;
    });

    expect(labelText).toBe("Thought");
  });

  test("accepts custom label", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const labelText = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[1]; // second has custom label
      if (!el?.shadowRoot) return null;
      const labelEl = el.shadowRoot.querySelector(".thinking-label");
      return labelEl?.textContent;
    });

    expect(labelText).toBe("Reasoning");
  });

  test("starts collapsed by default", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const isOpen = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { open: boolean }>("ask-thinking");
      return el?.open;
    });

    expect(isOpen).toBe(false);

    const bodyVisible = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return null;
      const body = el.shadowRoot.querySelector(".thinking-body");
      return body?.classList.contains("thinking-body--expanded");
    });

    expect(bodyVisible).toBe(false);
  });

  test("respects open attribute", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const isOpen = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[3]; // fourth has open
      return (el as HTMLElement & { open: boolean })?.open;
    });

    expect(isOpen).toBe(true);

    const bodyVisible = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[3];
      if (!el?.shadowRoot) return null;
      const body = el.shadowRoot.querySelector(".thinking-body");
      return body?.classList.contains("thinking-body--expanded");
    });

    expect(bodyVisible).toBe(true);
  });

  test("toggles on click", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    // Click the header
    await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return;
      const header = el.shadowRoot.querySelector(".thinking-header") as HTMLElement;
      header?.click();
    });

    // Should now be open
    const isOpen = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { open: boolean }>("ask-thinking");
      return el?.open;
    });
    expect(isOpen).toBe(true);

    // Click again to close
    await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return;
      const header = el.shadowRoot.querySelector(".thinking-header") as HTMLElement;
      header?.click();
    });

    const isClosed = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement & { open: boolean }>("ask-thinking");
      return el?.open;
    });
    expect(isClosed).toBe(false);
  });

  test("chevron rotates on open", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const hasOpenClassBefore = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return null;
      const chevron = el.shadowRoot.querySelector(".chevron");
      return chevron?.classList.contains("chevron--open");
    });
    expect(hasOpenClassBefore).toBe(false);

    // Open it
    await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return;
      (el.shadowRoot.querySelector(".thinking-header") as HTMLElement)?.click();
    });

    const hasOpenClassAfter = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return null;
      const chevron = el.shadowRoot.querySelector(".chevron");
      return chevron?.classList.contains("chevron--open");
    });
    expect(hasOpenClassAfter).toBe(true);
  });

  test("fires ask-toggle event on click", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const eventDetail = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el) return null;

      return new Promise((resolve) => {
        el.addEventListener("ask-toggle", (e: Event) => {
          resolve((e as CustomEvent).detail);
        }, { once: true });

        if (!el.shadowRoot) return;
        (el.shadowRoot.querySelector(".thinking-header") as HTMLElement)?.click();
      });
    });

    expect(eventDetail).toEqual({ open: true });
  });

  test("aria-expanded reflects open state", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const ariaBefore = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return null;
      return (el.shadowRoot.querySelector(".thinking-header") as HTMLElement)
        ?.getAttribute("aria-expanded");
    });
    expect(ariaBefore).toBe("false");

    // Open it
    await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return;
      (el.shadowRoot.querySelector(".thinking-header") as HTMLElement)?.click();
    });

    const ariaAfter = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return null;
      return (el.shadowRoot.querySelector(".thinking-header") as HTMLElement)
        ?.getAttribute("aria-expanded");
    });
    expect(ariaAfter).toBe("true");
  });

  test("renders content text inside the body", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    // Open first element to see content
    await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return;
      (el.shadowRoot.querySelector(".thinking-header") as HTMLElement)?.click();
    });

    const bodyText = await page.evaluate(() => {
      const el = document.querySelector("ask-thinking");
      if (!el?.shadowRoot) return null;
      const body = el.shadowRoot.querySelector(".thinking-body");
      return body?.textContent;
    });

    expect(bodyText?.trim()).toBe("I need to analyze the user's request step by step...");
  });
});

test.describe("ask-thinking (streaming)", () => {
  test("renders with streaming attribute", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const hasAttr = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4]; // fifth has streaming
      return el?.hasAttribute("streaming");
    });
    expect(hasAttr).toBe(true);
  });

  test("shows dots instead of chevron when streaming", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const hasDots = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4];
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".thinking-dots");
    });
    expect(hasDots).toBe(true);

    const hasChevron = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4];
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".chevron");
    });
    expect(hasChevron).toBe(false);
  });

  test("force-expands body when streaming", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const isExpanded = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4];
      if (!el?.shadowRoot) return null;
      const body = el.shadowRoot.querySelector(".thinking-body");
      return body?.classList.contains("thinking-body--expanded");
    });
    expect(isExpanded).toBe(true);
  });

  test("does not toggle on click when streaming", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    // Click the header of the streaming element
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4];
      if (!el?.shadowRoot) return;
      const header = el.shadowRoot.querySelector(".thinking-header") as HTMLElement;
      header?.click();
    });

    // Should still be expanded (streaming overrides toggle)
    const isExpanded = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4];
      if (!el?.shadowRoot) return null;
      const body = el.shadowRoot.querySelector(".thinking-body");
      return body?.classList.contains("thinking-body--expanded");
    });
    expect(isExpanded).toBe(true);
  });

  test("renders with streaming but no content", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    const hasShadow = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[5]; // sixth has streaming no content
      return el?.shadowRoot !== null;
    });
    expect(hasShadow).toBe(true);

    // Should show the header with dots even though content is empty
    const hasDots = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[5];
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".thinking-dots");
    });
    expect(hasDots).toBe(true);
  });

  test("removing streaming switches to chevron", async ({ page }) => {
    await page.goto(fixtureUrl("ask-thinking"));

    // Remove streaming attribute
    await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4] as HTMLElement;
      el.removeAttribute("streaming");
    });

    const hasDotsAfter = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4];
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".thinking-dots");
    });
    expect(hasDotsAfter).toBe(false);

    const hasChevronAfter = await page.evaluate(() => {
      const el = document.querySelectorAll("ask-thinking")[4];
      if (!el?.shadowRoot) return null;
      return !!el.shadowRoot.querySelector(".chevron");
    });
    expect(hasChevronAfter).toBe(true);
  });
});
