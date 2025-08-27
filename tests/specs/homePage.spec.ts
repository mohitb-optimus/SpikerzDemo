import { test, expect } from '@playwright/test';
import { env } from '../utils/env';
import { LoginManager } from '../core/loginManager';

test('Login to Home Page', async ({ browser }, testInfo) => {
 
  const loginManager = new LoginManager(browser);
  const context = await loginManager.createContextWithCredentials(env.username, env.password);
  const page = await context.newPage();
  await test.step('Login to demo.spikerz.com', async () => {
    await page.goto(`${env.demoUrl}/social-connect`);
    await expect(page).toHaveTitle('Spikerz | #1 Social Media Protection Service');
    await testInfo.attach('Social Connect Page login', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });
  });
});