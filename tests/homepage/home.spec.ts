import { test, expect } from '@playwright/test';

test('should have correct metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Read With Me/);
  page.pause();
});

test('should contain the signin button', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', {name: /Sign In/i})).toBeVisible();
});

test('should have welcome text', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Welcome to Read With Me')).toBeVisible();
});


