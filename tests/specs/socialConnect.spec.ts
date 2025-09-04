import { test, expect, Browser, TestInfo } from '@playwright/test';
import { env } from '../utils/env';
import { SocialConnectPage } from '../pages/socialConnectPage';
import { GoogleOAuthPage } from '../pages/googleOAuthPage';
import { LoginManager } from '../core/loginManager';
import { BaseTestHelper } from '../core/baseTestHelper';

class SocialConnectTest extends BaseTestHelper {
  async run(browser: Browser, testInfo: TestInfo) {
    const loginManager = new LoginManager(browser);
    const context = await loginManager.createContextWithCredentials(env.username, env.password);
    const page = await context.newPage();

    const socialPage = new SocialConnectPage(browser, context, page);
    const googlePage = new GoogleOAuthPage(browser, context, page);

    await test.step('Login to demo.spikerz.com', async () => {
      await this.loginToSpikerz(page, testInfo, `${env.demoUrl}/social-connect`);

    });

    await test.step('Trigger YouTube connect modal', async () => {
      await socialPage.clickConnectYoutube(testInfo);
    });

    await test.step('Google OAuth login', async () => {
      if (testInfo.project.use.headless){
        await googlePage.loginHeadless(env.gmailUser, env.gmailPassword, testInfo);
      }else{
        await googlePage.login(env.gmailUser, env.gmailPassword, testInfo);
      }      
    });

    await test.step('Grant permissions and verify YouTube connection', async () => {
      if (testInfo.project.use.headless){
        testInfo.skip(true, 'Skipping permissions step in headless mode');
      }
      await googlePage.acceptPermissions(testInfo);
      expect(await socialPage.isYoutubeConnected(testInfo)).toBeTruthy();
      await this.attachScreenshot(page, testInfo, 'YouTube Connected');
    });
  }
}

test('Connect YouTube via Google OAuth', async ({ browser }, testInfo) => {
  const socialConnectTest = new SocialConnectTest();
  await socialConnectTest.run(browser, testInfo);
});
