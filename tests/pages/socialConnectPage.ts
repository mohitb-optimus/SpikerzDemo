import { Browser, BrowserContext, Page, TestInfo } from '@playwright/test';
import { BaseTestHelper } from '../core/baseTestHelper';

export class SocialConnectPage extends BaseTestHelper {
  constructor(
    private browser: Browser,
    private context: BrowserContext,
    private page: Page
  ) {
    super();
  }
  private readonly youtubeImage = 'nz-card >> internal:has-text="Youtube Soon!"i >> internal:role=img'; 
  private readonly connectWithYoutubeButton = 'app-google-and-youtube-login >> internal:role=button';
  private readonly connectedYoutubeTile = '.ant-card-body';
  
  async clickConnectYoutube(testInfo: TestInfo) {
    
    await this.safeClick(this.page, this.youtubeImage, testInfo, 3, 10000);
    await this.safeWaitForResponse(this.page, '**/assets/youtube-branding/yt_logo_rgb_light.png', testInfo, 3, 15000);
    console.log('YouTube image loaded');
    await this.page.waitForLoadState('load'); // Wait for 2 seconds to ensure the button is fully loaded
    await this.safeClick(this.page, this.connectWithYoutubeButton, testInfo,3, 10000);
    console.log('Clicked Connect with Youtube button');
  }

  async isYoutubeConnected(testInfo: TestInfo) {
    await this.safeWaitForSelector(this.page, this.connectedYoutubeTile, testInfo, 'visible', 3, 10000); 
    return await this.page.getByRole('heading', { name: 'Connect with Youtube' }).isVisible();
  }
}
