import { test, expect } from '@playwright/test';

test('should have welcome text', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Welcome to Read With Me')).toBeVisible();
});

test('should have correct metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Read With Me/);
  page.pause();
});

test('should contain the signin button', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', {name: /Sign In/i})).toBeVisible();
});

test('should lead to google signin button', async ({ page }) => {
  await page.goto('/');
  const signinBtn = page.getByRole('button', {name: /Sign In/i});

  await signinBtn.click();

  await expect(page.getByRole('button', {name: /Continue with Google/i})).toBeVisible();
});


