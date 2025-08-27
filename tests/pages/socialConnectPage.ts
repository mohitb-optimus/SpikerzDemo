import { BasePage } from '../core/basePage';

export class SocialConnectPage extends BasePage {
  async clickConnectYoutube() {
    await this.page.locator('nz-card').filter({ hasText: 'Youtube Soon!' }).getByRole('img').click();
    await this.page.locator('app-google-and-youtube-login').getByRole('button').click();
  }

  async isYoutubeConnected() {
    await this.page.waitForURL(/social-connect\/youtube\?state/);
    return await this.page.getByRole('heading', { name: 'Connect with Youtube' }).isVisible();
  }
}
