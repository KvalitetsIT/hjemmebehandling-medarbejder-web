import { test, expect } from '@playwright/test';

test('Actives visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/active/1');
    // wait for the page to load
    await page.waitForSelector('div[style*="assets/icons/_group.svg"]');
    await expect(page).toHaveScreenshot({ fullPage: true});
});