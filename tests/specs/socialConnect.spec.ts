import { test, expect } from '@playwright/test';
import { env } from '../utils/env';
import { SocialConnectPage } from '../pages/socialConnectPage';
import { GoogleOAuthPage } from '../pages/googleOAuthPage';
import { LoginManager } from '../core/loginManager';

test('Connect YouTube via Google OAuth', async ({ browser }, testInfo) => {
 
  const loginManager = new LoginManager(browser);
  const context = await loginManager.createContextWithCredentials(env.username, env.password);
  const page = await context.newPage();
  const socialPage = new SocialConnectPage(browser, context, page);
  const googlePage = new GoogleOAuthPage(browser, context, page);
  await test.step('Login to demo.spikerz.com', async () => {
    await page.goto(`${env.demoUrl}/social-connect`);
    await expect(page).toHaveTitle('Spikerz | #1 Social Media Protection Service');
    await testInfo.attach('Social Connect Page login', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });
  });

  await test.step('Trigger YouTube connect modal', async () => {
    await socialPage.clickConnectYoutube();
    await testInfo.attach('Clicked Connect YouTube', { body: await page.screenshot(), contentType: 'image/png' });
  });

  await test.step('Google OAuth login', async () => {
    await googlePage.login(env.gmailUser, env.gmailPassword);
    await testInfo.attach('Google Login', { body: await page.screenshot(), contentType: 'image/png' });
  });

  await test.step('Grant permissions and verify YouTube connection', async () => {
    await googlePage.acceptPermissions();
    await expect(await socialPage.isYoutubeConnected()).toBeTruthy();
    await testInfo.attach('YouTube Connected', { body: await page.screenshot(), contentType: 'image/png' });
  });
});
