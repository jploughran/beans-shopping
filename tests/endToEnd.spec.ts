import { test, expect } from '@playwright/test';

test('auth setup worked', async ({ page }) => {
    await page.goto('https://beans-shopping.vercel.app');
    await expect(page.getByRole('link', { name: 'Lists' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Store Items' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add List' })).toBeVisible();
});
