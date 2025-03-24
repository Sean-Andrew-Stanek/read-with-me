import { test, expect } from '@playwright/test';

test.beforeEach('Go to the url', async({ page }) => {
  await page.goto('/');
})

test('should have welcome text', async ({ page }) => {
  await expect(page.getByText('Welcome to Read With Me')).toBeVisible();
});

test('should have correct metadata', async ({ page }) => {
  await expect(page).toHaveTitle(/Read With Me/);
});

test('should lead to google signin button', async ({ page }) => {
  const signinBtn = page.getByRole('button', {name: /Sign In/i});
  await signinBtn.click();
  await expect(page.getByRole('button', {name: /Continue with Google/i})).toBeVisible();
});


