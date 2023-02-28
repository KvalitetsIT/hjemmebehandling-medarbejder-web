import { test, expect } from '@playwright/test';

test('Questionnaires edit visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/questionnaires/qn1/edit');
    // wait for the page to load
    await page.waitForSelector('div[style*="assets/icons/_group.svg"]');
    await expect(page).toHaveScreenshot({ fullPage: true});
});