import { Browser, BrowserContext, Page, TestInfo } from '@playwright/test';
import { BaseTestHelper } from '../core/baseTestHelper';

export class GoogleOAuthPage extends BaseTestHelper {
  constructor(
    private browser: Browser,
    private context: BrowserContext,
    private page: Page
  ) {
    super();
  }

  private readonly emailField = 'internal:role=textbox[name="Email or phone"i]';
  private readonly nextButton = 'internal:role=button[name="Next"i]';
  private readonly passwordField = 'internal:role=textbox[name="Enter your password"i]'; 
  private readonly selectAllCheckbox = 'internal:role=checkbox[name="Select all"i]';
  private readonly continueButton = 'internal:role=button[name="Continue"i]';

  async login(username: string, password: string, testInfo: TestInfo) {
    await this.safeType(this.page, this.emailField, username, testInfo);
    await this.safeClick(this.page, this.nextButton, testInfo, 3, 10000);
    await this.safeType(this.page, this.passwordField, password, testInfo);
    await this.safeClick(this.page, this.nextButton, testInfo, 3, 30000);
  }

  async acceptPermissions(testInfo: TestInfo) {
    await this.page.waitForURL('**/signin/oauth/v2/consentsummary?authuser=0*', { timeout: 15000 });
    await this.safeWaitForSelector(this.page, this.continueButton, testInfo, 'visible',3, 15000);
    await this.page.getByRole('checkbox', { name: 'Select all' }).check();
    await this.safeClick(this.page, this.continueButton, testInfo);
  }
}
