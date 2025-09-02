#!/bin/bash
set -e

# Run Playwright tests with Allure + HTML reporting
npx playwright test --reporter=line,allure-playwright,html

# Generate static Playwright HTML report
npx playwright show-report playwright-report --output=playwright-report

# Generate static Allure report
npx allure generate allure-results --clean -o allure-report
