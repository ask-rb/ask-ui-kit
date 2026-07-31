# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: real-scenario.spec.ts >> Real scenario >> streaming with special characters in content
- Location: tests/real-scenario.spec.ts:4:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Real scenario", () => {
  4  |   test("streaming with special characters in content", async ({ page }) => {
  5  |     await page.goto("about:blank");
  6  | 
  7  |     const errors: { msg: string; stack?: string }[] = [];
  8  |     page.on("pageerror", (e) => errors.push({ msg: e.message, stack: e.stack }));
  9  | 
  10 |     await page.setContent(`
  11 |       <!DOCTYPE html>
  12 |       <html>
  13 |       <head>
  14 |         <meta charset="utf-8">
  15 |       </head>
  16 |       <body>
  17 |         <div id="target"></div>
  18 |         <script type="module">
  19 |           import "/dist/index.js";
  20 | 
  21 |           const el = document.createElement("ask-thinking");
  22 |           el.setAttribute("streaming", "");
  23 |           el.label = "Thinking";
  24 |           el.dataset.startTime = String(Date.now());
  25 |           document.getElementById("target").appendChild(el);
  26 | 
  27 |           const texts = [
  28 |             'Step 1: analyze the data',
  29 |             'Step 2: "double quotes" inside',
  30 |             "Step 3: 'single quotes' inside",
  31 |             'Step 4: <angle brackets> inside',
  32 |             "Step 5: special chars and stuff",
  33 |           ];
  34 |           for (const t of texts) {
  35 |             el.content += t + "\\n";
  36 |           }
  37 | 
  38 |           el.removeAttribute("streaming");
  39 |           el.dataset.finalized = "";
  40 |           el.label = "Thought for 2s";
  41 |         <\/script>
  42 |       </body>
  43 |       </html>
  44 |     `);
  45 | 
  46 |     await page.waitForTimeout(1000);
  47 |     
  48 |     if (errors.length > 0) {
  49 |       console.log("ERRORS FOUND:", JSON.stringify(errors[0], null, 2));
  50 |     }
  51 |     
> 52 |     expect(errors.length).toBe(0);
     |                           ^ Error: expect(received).toBe(expected) // Object.is equality
  53 |   });
  54 | 
  55 |   test("ask-message with HTML-escaped content in attributes", async ({ page }) => {
  56 |     await page.goto("about:blank");
  57 | 
  58 |     await page.setContent(`
  59 |       <!DOCTYPE html>
  60 |       <html>
  61 |       <head>
  62 |         <meta charset="utf-8">
  63 |         <script type="module" src="/dist/index.js"><\/script>
  64 |       </head>
  65 |       <body>
  66 |         <ask-message role="user" content="Hello &#34;World&#34; with &#60;tags&#62;"></ask-message>
  67 |         <ask-message role="assistant" content="Normal text here"></ask-message>
  68 |       </body>
  69 |       </html>
  70 |     `);
  71 | 
  72 |     await page.waitForTimeout(1000);
  73 | 
  74 |     // Verify properties are correctly decoded
  75 |     const userContent = await page.evaluate(() => {
  76 |       const el = document.querySelector("ask-message");
  77 |       return (el as any)?.content;
  78 |     });
  79 |     expect(userContent).toBe('Hello "World" with <tags>');
  80 |   });
  81 | });
  82 | 
```