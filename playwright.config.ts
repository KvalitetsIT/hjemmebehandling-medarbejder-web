import { PlaywrightTestConfig, devices, ViewportSize } from '@playwright/test';

const mobileViewport: ViewportSize = { width: 600, height: 1280 };
const tabletViewport: ViewportSize = { width: 800, height: 1280 };
const dekstopViewport: ViewportSize = { width: 1200, height: 1280 };
const dekstopViewportWide: ViewportSize = { width: 1600, height: 1280 };

const config: PlaywrightTestConfig = {
    testDir: './',
    testMatch: ['**/*.spec.ts'],
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    use: {
        baseURL: 'http://localhost:3000',
    },
    projects: [
        {
            name: 'chromium desktop wide',
            use: {
                ...devices['Desktop Chrome'],
                viewport: dekstopViewportWide
            },
        },
        {
            name: 'chromium desktop',
            use: {
                ...devices['Desktop Chrome'],
                viewport: dekstopViewport
            },
        },
        {
            name: 'chromium tablet',
            use: {
                ...devices['Desktop Chrome'],
                viewport: tabletViewport
            },
        },
        {
            name: 'chromium mobile',
            use: {
                ...devices['Desktop Chrome'],
                viewport: mobileViewport
            },
        },
    ],
};
export default config;