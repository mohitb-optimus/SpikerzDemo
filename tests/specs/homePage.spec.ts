import { test, expect, Browser, TestInfo } from '@playwright/test';
import { env } from '../utils/env';
import { LoginManager } from '../core/loginManager';
import { BaseTestHelper } from '../core/baseTestHelper';

class HomePageTest extends BaseTestHelper {
  async run(browser:Browser, testInfo: TestInfo) {
    const loginManager = new LoginManager(browser);
    const context = await loginManager.createContextWithCredentials(env.username, env.password);
    const page = await context.newPage();

    await test.step('Login to demo.spikerz.com', async () => {
      await this.loginToSpikerz(page, testInfo, `${env.demoUrl}`);
    });
  }
}

test('Login to Home Page', async ({ browser }, testInfo) => {
  const homePageTest = new HomePageTest();
  await homePageTest.run(browser, testInfo);
});