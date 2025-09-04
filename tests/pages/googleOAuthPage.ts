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

  

  private readonly googleSignInText = 'internal:text="Sign in with Google"i';
  private readonly emailField = 'internal:role=textbox[name="Email or phone"i]';
  private readonly nextEmailButton = 'internal:role=button[name="Next"i]';
  private readonly passwordField = 'internal:role=textbox[name="Enter your password"i]'; 
  private readonly nextPasswordButton = 'internal:role=button[name="Next"i]';
  private readonly continueButton = 'internal:role=button[name="Continue"i]';
  private readonly captchaImg = '#captchaimg';

  async login(username: string, password: string, testInfo: TestInfo) {
    
    console.log('Starting Google OAuth login...');
    await this.safeWaitForURL(this.page, '**/signin/identifier?opparams**', testInfo);
    await this.safeType(this.page, this.emailField, username, testInfo);
    await this.safeClick(this.page, this.googleSignInText, testInfo);
    await this.safeClick(this.page, this.nextEmailButton, testInfo);
  
    console.log('Entering password...');
    await this.safeWaitForSelector(this.page, this.googleSignInText, testInfo, 'visible', 2, 10000); 
    await this.safeClick(this.page, this.googleSignInText, testInfo); 
    console.log('UI mode detected, proceeding with password entry.');
    await this.safeType(this.page, this.passwordField, password, testInfo, 10, 2, 1000);
    await this.safeClick(this.page, this.nextPasswordButton, testInfo);
    await this.page.waitForLoadState('domcontentloaded'); // Wait for potential redirects
    console.log('Password submitted, waiting for permissions page...');
  }

  async loginHeadless(username: string, password: string, testInfo: TestInfo) {
    
    console.log('Starting Google OAuth login...');
    await this.safeWaitForURL(this.page, '**/signin/identifier?opparams**', testInfo);
    await this.safeType(this.page, this.emailField, username, testInfo);
    await this.safeClick(this.page, this.googleSignInText, testInfo);
    await this.safeClick(this.page, this.nextEmailButton, testInfo);
  
    console.log('Looking FOr Captcha...');
    // Detect if a text CAPTCHA appeared
    const captchaVisible = await this.page.locator('#captchaimg').isVisible().catch(() => false);
    if (captchaVisible) {
      testInfo.skip(true, 'Skipping test because CAPTCHA was triggered');
    }
  }
    
  

  async acceptPermissions(testInfo: TestInfo) {
    console.log('Accepting permissions...');
    await this.safeWaitForResponse(this.page, response =>
      response.url().includes('signin/oauth/delegation?authuser') && response.status() === 200,
      testInfo,
      5,
      15000
    );  
    await this.safeWaitForSelector(this.page, this.continueButton, testInfo, 'visible');
    console.log('Permissions page loaded');
    await this.page.getByRole('checkbox', { name: 'Select all' }).check();
    await this.safeClick(this.page, this.continueButton, testInfo);
  }

}
