import { defineConfig } from '@playwright/test';
import os from 'node:os';

export default defineConfig({
  testDir: './tests',
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', {
      detail: true,
      suiteTitle: true,
      environmentInfo: {
        OS: os.platform(),
        Architecture: os.arch(),
        NodeVersion: process.version,
      },
      categories: [
        { name: 'Missing file errors', messageRegex: '.*ENOENT: no such file or directory.*' },
        { name: 'Internal Server Error', messageRegex: '.*Internal Server Error.*' },
        { name: 'Timeout errors', messageRegex: '.*timeout.*' },
        { name: 'Accessibility', messageRegex: '.*accessibility.*' }
      ],
    }],
  ],

  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
