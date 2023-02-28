import { test, expect } from '@playwright/test';

test('Patient visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/patients/1212758392/careplans/Aktiv');
    // wait for the page to load
    await page.waitForSelector('div[style*="assets/icons/_group.svg"]');
    await expect(page).toHaveScreenshot({ fullPage: true});
});