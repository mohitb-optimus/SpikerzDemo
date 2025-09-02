import { Page, TestInfo, Response, expect } from '@playwright/test';

export abstract class BaseTestHelper {
  // Default config (can be overridden in constructor)
  private readonly defaultRetries = 3;
  private readonly defaultTimeout = 5000;
  private readonly retryDelayMs = 1000;

  constructor(
    private readonly retries: number = 3,
    private readonly timeout: number = 5000,
    private readonly exponentialBackoff: boolean = true
  ) {}

  // ---------- STRUCTURED LOGGING ----------
  private async log(
    testInfo: TestInfo,
    actionName: string,
    attempt: number,
    status: 'success' | 'retry' | 'failure',
    error?: unknown
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: actionName,
      attempt,
      status,
      error: error ? String(error) : undefined,
    };

    // Print to console for local runs
    console.log(`[BaseTestHelper]`, JSON.stringify(logEntry, null, 2));

    // Attach to Playwright report
    await testInfo.attach(`${actionName}-attempt-${attempt}-${status}`, {
      body: JSON.stringify(logEntry, null, 2),
      contentType: 'application/json',
    });
  }

  // ---------- CORE RETRY WRAPPER ----------
  private async withRetry<T>(
    actionName: string,
    action: () => Promise<T>,
    page: Page,
    testInfo: TestInfo,
    retries = this.retries,
    timeout = this.timeout
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await action();
        await this.log(testInfo, actionName, attempt, 'success');
        return result;
      } catch (error) {
        lastError = error;
        await this.log(testInfo, actionName, attempt, attempt < retries ? 'retry' : 'failure', error);

        if (attempt < retries) {
          const delay =
            this.exponentialBackoff ? this.retryDelayMs * Math.pow(2, attempt - 1) : this.retryDelayMs;
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    // Final failure: attach screenshot & HTML
    await this.attachScreenshot(page, testInfo, `Final ${actionName} failure`);
    await testInfo.attach(`Final-${actionName}-HTML`, {
      body: await page.content(),
      contentType: 'text/html',
    });

    throw lastError;
  }

  // ---------- SAFE GOTO ----------
  protected async safeGoto(page: Page, url: string, testInfo: TestInfo, retries?: number, timeout?: number) {
    return this.withRetry(
      'safeGoto',
      async () => {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeout ?? this.timeout });
        if (!response || !response.ok()) {
          throw new Error(`Navigation failed: ${response?.status()} ${response?.statusText()}`);
        }
        return response;
      },
      page,
      testInfo,
      retries,
      timeout
    );
  }

  // ---------- SAFE CLICK ----------
  protected async safeClick(page: Page, selector: string, testInfo: TestInfo, retries?: number, timeout?: number) {
    return this.withRetry(
      `safeClick-${selector}`,
      async () => {
        await page.locator(selector).click({ timeout: timeout ?? this.timeout });
      },
      page,
      testInfo,
      retries,
      timeout
    );
  }

  // ---------- SAFE FILL ----------
  protected async safeFill(page: Page, selector: string, value: string, testInfo: TestInfo, retries?: number, timeout?: number) {
    return this.withRetry(
      `safeFill-${selector}`,
      async () => {
        await page.locator(selector).fill(value, { timeout: timeout ?? this.timeout });
      },
      page,
      testInfo,
      retries,
      timeout
    );
  }

  // ---------- SAFE TYPE ----------
  protected async safeType(
    page: Page,
    selector: string,
    value: string,
    testInfo: TestInfo,
    delayMs = 100,
    retries?: number,
    timeout?: number
  ) {
    return this.withRetry(
      `safeType-${selector}`,
      async () => {
        const locator = page.locator(selector);
        await locator.click({ timeout: timeout ?? this.timeout }); // ensure focus
        await locator.pressSequentially(value, { delay: delayMs, timeout: timeout ?? this.timeout });
      },
      page,
      testInfo,
      retries,
      timeout
    );
  }

  // ---------- SAFE WAIT FOR SELECTOR ----------
  protected async safeWaitForSelector(
    page: Page,
    selector: string,
    testInfo: TestInfo,
    state: 'visible' | 'attached' | 'hidden' | 'detached' = 'visible',
    retries?: number,
    timeout?: number
  ) {
    return this.withRetry(
      `safeWaitForSelector-${selector}`,
      async () => {
        await page.locator(selector).waitFor({ state, timeout: timeout ?? this.timeout });
      },
      page,
      testInfo,
      retries,
      timeout
    );
  }

  // ---------- SAFE WAIT FOR RESPONSE ----------
  protected async safeWaitForResponse(
    page: Page,
    urlOrPredicate: string | ((response: Response) => boolean | Promise<boolean>),
    testInfo: TestInfo,
    retries?: number,
    timeout?: number
  ): Promise<Response> {
    return this.withRetry(
      `safeWaitForResponse`,
      async () => {
        const response = await page.waitForResponse(urlOrPredicate, { timeout: timeout ?? this.timeout });
        if (!response.ok()) {
          const bodyText = await response.text().catch(() => '[Could not read body]');
          await testInfo.attach(`Response ${response.status()} ${response.statusText()}`, {
            body: bodyText,
            contentType: 'text/plain',
          });
          throw new Error(`Response failed: ${response.status()} ${response.statusText()}`);
        }
        return response;
      },
      page,
      testInfo,
      retries,
      timeout
    );
  }

  // ---------- SAFE WAIT FOR URL ----------
  protected async safeWaitForURL(page: Page, urlOrPattern: string | RegExp, testInfo: TestInfo, retries?: number, timeout?: number) {
    return this.withRetry(
      `safeWaitForURL`,
      async () => {
        await page.waitForURL(urlOrPattern, { timeout: timeout ?? this.timeout });
      },
      page,
      testInfo,
      retries,
      timeout
    );
  }

  // ---------- COMMON LOGIN FLOW ----------
  protected async loginToSpikerz(page: Page, testInfo: TestInfo, demoUrl: string) {
    await this.safeGoto(page, demoUrl, testInfo);
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
