---
theme: monomi
layout: section
---

# Multiple Users and Permissions

---
layout: default
---

# Handling Multiple Users

- Create auth session states for different user roles.
- Write tests for different user roles and permissions.
- Define the session state to use in each test.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin User Tests', () => {
  test.use({ storageState: 'playwright/.auth/reader.json' });

  test('Reader is not able to access admin dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/login');
  });
});

