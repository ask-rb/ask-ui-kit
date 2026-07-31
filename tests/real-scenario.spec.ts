import { test, expect } from "@playwright/test";

test.describe("Real scenario", () => {
  test("streaming with special characters in content", async ({ page }) => {
    await page.goto("about:blank");

    const errors: { msg: string; stack?: string }[] = [];
    page.on("pageerror", (e) => errors.push({ msg: e.message, stack: e.stack }));

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <div id="target"></div>
        <script type="module">
          import "/dist/index.js";

          const el = document.createElement("ask-thinking");
          el.setAttribute("streaming", "");
          el.label = "Thinking";
          el.dataset.startTime = String(Date.now());
          document.getElementById("target").appendChild(el);

          const texts = [
            'Step 1: analyze the data',
            'Step 2: "double quotes" inside',
            "Step 3: 'single quotes' inside",
            'Step 4: <angle brackets> inside',
            "Step 5: special chars and stuff",
          ];
          for (const t of texts) {
            el.content += t + "\\n";
          }

          el.removeAttribute("streaming");
          el.dataset.finalized = "";
          el.label = "Thought for 2s";
        <\/script>
      </body>
      </html>
    `);

    await page.waitForTimeout(1000);
    
    if (errors.length > 0) {
      console.log("ERRORS FOUND:", JSON.stringify(errors[0], null, 2));
    }
    
    expect(errors.length).toBe(0);
  });

  test("ask-message with HTML-escaped content in attributes", async ({ page }) => {
    await page.goto("about:blank");

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <script type="module" src="/dist/index.js"><\/script>
      </head>
      <body>
        <ask-message role="user" content="Hello &#34;World&#34; with &#60;tags&#62;"></ask-message>
        <ask-message role="assistant" content="Normal text here"></ask-message>
      </body>
      </html>
    `);

    await page.waitForTimeout(1000);

    // Verify properties are correctly decoded
    const userContent = await page.evaluate(() => {
      const el = document.querySelector("ask-message");
      return (el as any)?.content;
    });
    expect(userContent).toBe('Hello "World" with <tags>');
  });
});
