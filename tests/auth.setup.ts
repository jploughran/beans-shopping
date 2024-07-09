import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    await page.goto('https://beans-shopping.vercel.app/sign-in');
    await page.getByRole('heading', { name: 'Bean Shopping' }).click();
    await page.locator('img').click();
    await page.getByPlaceholder('Enter email...').click();
    await page.getByPlaceholder('Enter email...').fill('review@apple.com');
    await page.getByPlaceholder('Enter email...').press('Tab');
    await expect(page.getByText('Please Enter your password')).toBeVisible();
    await page.getByPlaceholder('Enter password...').click();
    await page.getByPlaceholder('Enter password...').fill('Test1234!');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('https://beans-shopping.vercel.app');

    await expect(page.getByRole('link', { name: 'Lists' })).toBeVisible();

    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});
