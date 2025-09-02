Got it 👍 — here’s the **copy-paste ready** README.md content with all the updates (Docker, GitHub Actions, GitHub Pages, Debugging Failures).

---

````markdown
# Spikerz Demo Assessment with Playwright and Typescript

This project is a Playwright + TypeScript test automation framework with Allure + Playwright reporting, Docker support, and CI/CD integration via GitHub Actions.

## Features

- Playwright test runner with TypeScript  
- HTTP Basic Auth login management  
- Reusable helpers (`safeClick`, `safeFill`, `safeType`, `safeGoto`, `safeWaitForSelector`, `safeWaitForResponse`)  
- Allure reporting integration  
- Playwright HTML reporting  
- Modular Page Object Model (POM)  
- Environment variable support  
- Dockerized Playwright dependencies  
- CI/CD with GitHub Actions  
- Automatic report hosting on GitHub Pages  

---

## Prerequisites

- Node.js 18+ (for local development)  
- A valid Google/YouTube account  
- Access to the Spikerz platform  
- Docker  

---

## Project Structure

- `tests/` - Test specs, page objects, core utilities  
- `playwright.config.ts` - Playwright configuration  
- `allure-report/` & `allure-results/` - Allure reporting output  
- `playwright-report/` - Playwright HTML report output  

---

## Scripts

| Command               | Description                              |
|-----------------------|------------------------------------------|
| `npm test`            | Run all Playwright tests                 |
| `npm run test:headed` | Run tests in headed mode                 |
| `npm run test:ui`     | Launch Playwright test UI                |
| `npm run build`       | Compile TypeScript                       |
| `npm run clean`       | Remove test and report output folders    |

---

## Environment Variables

Set the following variables (in `.env.local` or GitHub Secrets):

```ini
DEMO_URL=https://demo.spikerz.com
DEMO_USERNAME=your_site_username
DEMO_PASSWORD=your_site_password
GMAIL_USER=your_google_email
GMAIL_PASSWORD=your_google_password
````

---

## 🐳 Running with Docker

### 1️⃣ Build Docker Image

```sh
docker build -t spikerzdemo .
```

### 2️⃣ Run Tests in Docker

```sh
docker run --rm \
  -e DEMO_USERNAME=myuser \
  -e DEMO_PASSWORD=mypass \
  -e GMAIL_USER=mygmail \
  -e GMAIL_PASSWORD=mygmailpass \
  -e DEMO_URL=https://demo.spikerz.com \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/allure-results:/app/allure-results \
  -v $(pwd)/allure-report:/app/allure-report \
  -v $(pwd)/playwright-report:/app/playwright-report \
  spikerzdemo \
  npx playwright test --reporter=line,allure-playwright,html
```

### 3️⃣ View Reports Locally

* **Playwright HTML report:**
  `./playwright-report/index.html`

* **Allure report:**
  `./allure-report/index.html`

---

## ⚡ CI/CD with GitHub Actions

The GitHub Actions workflow (`.github/workflows/tests.yml`) will:

1. Build Docker image
2. Run Playwright tests inside container
3. Generate static Playwright + Allure reports
4. Upload reports as artifacts
5. Deploy reports to GitHub Pages

---

## 🌐 GitHub Pages Reports

After each CI/CD run, reports are hosted at:

* **Playwright Report** →
  `https://<your-username>.github.io/<your-repo>/reports/playwright-report/`

* **Allure Report** →
  `https://<your-username>.github.io/<your-repo>/reports/allure-report/`

Enable Pages in GitHub:
**Repo → Settings → Pages → Source = gh-pages branch.**

---

## 🐞 Debugging Failures

When a test fails:

* **Artifacts** → Downloadable from the **Actions run summary**:

  * `test-results/` → raw Playwright logs, screenshots, HTML snapshots, traces
  * `playwright-report/` → static HTML report with step-by-step logs
  * `allure-report/` → rich historical test report

* **Traces & Screenshots**
  If enabled in `playwright.config.ts`:

  ```ts
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  }
  ```

  You’ll get:

  * `trace.zip` (open with `npx playwright show-trace trace.zip`)
  * `.png` screenshots
  * `.webm` videos

These artifacts make it easy to replay failures and debug issues directly from CI.

---

## ✅ Summary

* **Locally** → Run via Docker, view reports in `index.html`
* **CI/CD** → Runs on push/PR, reports deployed to GitHub Pages
* **Artifacts** → Debug failures with screenshots, traces, logs
* **Reports** → Playwright + Allure for complete visibility

```

---

👉 Do you want me to also drop in a **ready-to-use `playwright.config.ts` snippet** with `trace`, `screenshot`, and `video` enabled so your team doesn’t have to configure it manually?
```
