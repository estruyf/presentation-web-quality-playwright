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

# Why E2E Testing?

- **User-Centric**: Tests reflect real user scenarios
- **Comprehensive Coverage**: Validates full application stack
- **Regression Prevention**: Catches bugs before they reach production
- **Cross-Browser Assurance**: Ensures consistent behavior across browsers
- **Faster Feedback**: Automated tests run quickly and frequently
- **Key when building on top of 3rd party services**

---
layout: default
---

# What is Playwright?

[Playwright](https://playwright.dev/) is a open-source framework for E2E testing of web applications.

- Developed by Microsoft
- Supports **Chromium**, **Firefox**, and **WebKit**
- Provides a **unified API** for cross-browser testing
- Rich features for **reliable** and **fast** tests


---
layout: default
---

# Why Playwright?

- **Cross-Browser Testing**: Single API for multiple browsers
- **Auto-Waiting**: Built-in waits for elements and actions
- **Powerful Selectors**: Semantic and flexible element selection
- **Headless & Headed Modes**: Run tests in both modes
- **Rich Reporting**: Detailed test reports and screenshots
- **Easy Setup**: Quick to get started with minimal configuration
- **Multi-Language Support**: JavaScript, TypeScript, Python, C#, and Java


**Advantages over Selenium:**
- **No WebDriver management** - Playwright handles browser binaries
- **Better reliability** - Auto-retry and smart waiting mechanisms
- **Modern architecture** - Direct browser communication vs WebDriver protocol


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
  await page.getByRole('input', { name: 'username' }).fill('elio');
  await page.getByLabel('Password').fill('secret');
  await page.getByTestId('btn-login').click();
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

# Always expect the unexpected!

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
      route.fulfill({ status: 500, json: { error: 'Internal Server Error' } });
    } else {
      route.continue();
    }
  });

  await page.goto('/speaker/session/new');

  // Test error handling UI
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

# Configuration & Parallel Execution

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


---
layout: default
---

# Running Tests

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/engagetime.spec.ts

# Run with UI Mode
npx playwright test --ui
```
