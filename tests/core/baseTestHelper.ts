import { Page, TestInfo, expect, Response } from '@playwright/test';

export abstract class BaseTestHelper {
  // ... keep safeGoto, safeClick, safeFill, safeType, safeWaitForSelector,safeWaitForResponse ...

  // ---------- SAFE GOTO ----------
  protected async safeGoto(
    page: Page,
    url: string,
    testInfo: TestInfo,
    retries = 3,
    timeout = 15000
  ) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout,
        });

        if (!response || !response.ok()) {
          throw new Error(`Navigation failed: ${response?.status()} ${response?.statusText()}`);
        }

        return response;
      } catch (error) {
        lastError = error;

        await testInfo.attach(`Navigation attempt ${attempt} error`, {
          body: String(error),
          contentType: 'text/plain',
        });

        if (attempt < retries) await new Promise(r => setTimeout(r, 1000));
      }
    }

    await this.attachScreenshot(page, testInfo, 'Final navigation error screenshot');
    await testInfo.attach('Final navigation error HTML', {
      body: await page.content(),
      contentType: 'text/html',
    });

    throw lastError;
  }

  // ---------- SAFE CLICK ----------
  protected async safeClick(
    page: Page,
    selector: string,
    testInfo: TestInfo,
    retries = 3,
    timeout = 5000
  ) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const locator = page.locator(selector);
        await locator.click({ timeout });
        return;
      } catch (error) {
        lastError = error;

        await testInfo.attach(`Click attempt ${attempt} on ${selector} failed`, {
          body: String(error),
          contentType: 'text/plain',
        });

        if (attempt < retries) await new Promise(r => setTimeout(r, 1000));
      }
    }

    await this.attachScreenshot(page, testInfo, `Final click error on ${selector}`);
    await testInfo.attach(`Final click error HTML on ${selector}`, {
      body: await page.content(),
      contentType: 'text/html',
    });

    throw lastError;
  }

  // ---------- SAFE FILL ----------
  protected async safeFill(
    page: Page,
    selector: string,
    value: string,
    testInfo: TestInfo,
    retries = 3,
    timeout = 5000
  ) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const locator = page.locator(selector);
        await locator.fill(value, { timeout });
        return;
      } catch (error) {
        lastError = error;

        await testInfo.attach(`Fill attempt ${attempt} on ${selector} failed`, {
          body: String(error),
          contentType: 'text/plain',
        });

        if (attempt < retries) await new Promise(r => setTimeout(r, 1000));
      }
    }

    await this.attachScreenshot(page, testInfo, `Final fill error on ${selector}`);
    await testInfo.attach(`Final fill error HTML on ${selector}`, {
      body: await page.content(),
      contentType: 'text/html',
    });

    throw lastError;
  }

  // ---------- SAFE TYPE ----------
  protected async safeType(
    page: Page,
    selector: string,
    value: string,
    testInfo: TestInfo,
    delayMs = 100,
    retries = 3,
    timeout = 5000
  ) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const locator = page.locator(selector);
        await locator.click({ timeout }); // ensure focus
        await locator.pressSequentially(value, { delay: delayMs, timeout }); // ✅ modern replacement
        return;
      } catch (error) {
        lastError = error;

        await testInfo.attach(`Type attempt ${attempt} on ${selector} failed`, {
          body: String(error),
          contentType: 'text/plain',
        });

        if (attempt < retries) await new Promise(r => setTimeout(r, 1000));
      }
    }

    await this.attachScreenshot(page, testInfo, `Final type error on ${selector}`);
    await testInfo.attach(`Final type error HTML on ${selector}`, {
      body: await page.content(),
      contentType: 'text/html',
    });

    throw lastError;
  }
  // ---------- SAFE WAIT ----------
  protected async safeWaitForSelector(
    page: Page,
    selector: string,
    testInfo: TestInfo,
    state: 'visible' | 'attached' | 'hidden' | 'detached' = 'visible',
    retries = 3,
    timeout = 5000
  ) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const locator = page.locator(selector);
        await locator.waitFor({ state, timeout });
        return;
      } catch (error) {
        lastError = error;

        await testInfo.attach(`Wait attempt ${attempt} for ${selector} failed`, {
          body: String(error),
          contentType: 'text/plain',
        });

        if (attempt < retries) await new Promise(r => setTimeout(r, 1000));
      }
    }

    await this.attachScreenshot(page, testInfo, `Final wait error on ${selector}`);
    await testInfo.attach(`Final wait error HTML on ${selector}`, {
      body: await page.content(),
      contentType: 'text/html',
    });

    throw lastError;
  }

  protected async safeWaitForResponse(
    page: Page,
    urlOrPredicate: string | ((response: Response) => boolean | Promise<boolean>),
    testInfo: TestInfo,
    retries = 3,
    timeout = 10000
  ): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await page.waitForResponse(urlOrPredicate, { timeout });

        if (!response.ok()) {
          const bodyText = await response.text().catch(() => '[Could not read body]');
          await testInfo.attach(`Response ${response.status()} ${response.statusText()}`, {
            body: bodyText,
            contentType: 'text/plain',
          });
          throw new Error(`Response failed: ${response.status()} ${response.statusText()}`);
        }

        return response;
      } catch (error) {
        lastError = error;

        await testInfo.attach(`Response wait attempt ${attempt} failed`, {
          body: String(error),
          contentType: 'text/plain',
        });

        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    // ❌ Final failure → attach screenshot + HTML
    await this.attachScreenshot(page, testInfo, 'Final response wait error screenshot');
    await testInfo.attach('Final response wait error HTML', {
      body: await page.content(),
      contentType: 'text/html',
    });

    throw lastError;
  }
  // ---------- Wait for URL ----------
  protected async safeWaitForURL(
    page: Page,
    urlOrPattern: string | RegExp,
    testInfo: TestInfo,
    timeout: number = 15000,
    retries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await page.waitForURL(urlOrPattern, { timeout });
        return;
      } catch (error) {
        if (attempt === retries) {
          await testInfo.attach(`safeWaitForURL-failed-${attempt}`, {
            body: await page.screenshot(),
            contentType: 'image/png',
          });
          throw new Error(
            `safeWaitForURL failed after ${retries} retries. Last error: ${String(error)}`
          );
        }
      }
    }
  }


  // ---------- COMMON LOGIN FLOW ----------
  protected async loginToSpikerz(page: Page, testInfo: TestInfo, demoUrl: string) {
    await this.safeGoto(page, `${demoUrl}`, testInfo, 3, 15000);
    await expect(page).toHaveTitle('Spikerz | #1 Social Media Protection Service');
    await this.attachScreenshot(page, testInfo, 'Spikerz Page login');
  }

  // ---------- SCREENSHOT ----------
  protected async attachScreenshot(page: Page, testInfo: TestInfo, label: string) {
    await testInfo.attach(label, {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  }
}
