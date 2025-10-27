---
theme: monomi
layout: section
---

# E2E Testing with Playwright

---
layout: default
---

# What is E2E Testing?

End-to-End (E2E) testing simulates real user interactions with your application:

✅ Tests entire **user workflows**

✅ **Validates UI** behavior and state

✅ Ensures **features work** across browsers

✅ Catches **integration issues** early

✅ Builds **confidence in production releases**

---
layout: default
---

# Why Playwright?

<div class="features-grid">

**Cross-Browser** 🌐
- Chromium, Firefox, WebKit
- Single unified API

**Reliable** 🎯
- Auto-wait mechanisms
- Web-first assertions
- Network isolation

**Fast** ⚡
- Parallel execution
- Lightweight
- No flakiness

**Developer Friendly** 👨‍💻
- Record & Playback
- UI Mode debugging
- Trace viewer

</div>

<style>
.features-grid {
  display: grid;
  grid-template-columns: .5fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}
</style>

---
layout: image-right
image: .demo/assets/website.png
---

# Using Playwright

<br />
<br />

### Navigation

```ts
await page.goto('https://eliostruyf.com');
```

<br />

### Get an element

```ts
const title = page.locator('header h2');
```

<br />

### Test assertion

```ts
await expect(title).toHaveText('Elio Struyf');
```

<dt-show clicks="1">

<dt-arrow
  x1="365"
  y1="390"
  x2="470"
  y2="25"
  line-color="#ff69b4"
  line-width="2"
  arrow-head="both">
</dt-arrow>

</dt-show>

---
layout: default
---

# Basic Test Example

<br />
<br />

```typescript
import { test, expect } from '@playwright/test';

test('Check if header contains correct text', async ({ page }) => {
  // Navigate to the application
  await page.goto('https://www.eliostruyf.com');
  
  // Get the title element
  const title = page.locator('header h2');

  // Verify the title text
  await expect(title).toHaveText('Elio Struyf');
});
```

---
layout: default
---

# Test Isolation & Best Practices

- **Each test gets a fresh context** - No state pollution between tests
- **Use semantic locators** - `getByRole()`, `getByLabel()`, `getByTestId()`
- **Web-first assertions** - Auto-retry until timeout
- **Organize into steps** - Use `test.step()` for clarity

```typescript
await test.step('Login', async () => {
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button:has-text("Sign in")');
});
```

---
layout: default
---

# API Testing

<br />
<br />

```typescript
import { test, expect } from '@playwright/test';

test('Create a new session', async ({ request }) => {
  // Create issue via API
  const response = await request.post('/sessions', {
    data: {
      title: 'Enhancing web application quality with Playwright',
      description: 'The abstract of the session goes here.',
      features: { enableQA: true, enablePolls: true, enableFeedback: true }
    }
  });
  
  expect(response.ok()).toBeTruthy();
  const issue = await response.json();
  expect(issue.title).toBe('Enhancing web application quality with Playwright');
});
```

---
layout: default
---

# API Mocking

<br />
<br />

```typescript
import { test, expect } from '@playwright/test';

test('Create a new session', async ({ request }) => {
  await page.route('**/sessions', route => {
    if (route.request().method === 'POST') {
      route.fulfill({ json });
    } else {
      route.continue();
    }
  });

  await page.goto('/speaker/session/new');

  // 1. Fill form fields
  // 2. Click submit button
  // 3. Verify success message
});
```

---
layout: section
---

# The lazy way of testing

---
layout: image-right
image: .demo/assets/homepage-diff.png
---

# Pixel matching with snapshots

- Create a screenshot baseline
- Compare future runs against baseline

<br />

```ts
test("Check layout shift", async ({ page, browserName }) => {
  await page.goto("http://eliostruyf.com");

  await expect(page).toHaveScreenshot(`homepage.png`);
});
```

<style>
  pre {
    font-size: 12px;
  }
</style>


---
layout: default
---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/engagetime.spec.ts

# Run with UI Mode
npx playwright test --ui
```

---
layout: default
---

## Configuration & Parallel Execution

- **Parallel by default** - Multiple tests run simultaneously
- **Serial when needed** - Use `test.describe.configure({ mode: 'serial' })`
- **Cross-browser matrix** - Configure test projects for different browsers
- **Retries & timeouts** - Fine-tune execution behavior

```typescript
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],=
  retries: 2,
  timeout: 30000,
});
```
