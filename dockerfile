# Use Playwright base image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.55.0-jammy
FROM mcr.microsoft.com/playwright:v1.47.2-focal
# Set working directory
WORKDIR /app
WORKDIR /app
# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./
COPY package*.json tsconfig.json ./
RUN npm install
# Install dependencies
RUN npm ci
# Copy the rest of the project
COPY . .
COPY . .
# Build TypeScript
# Install all browsers
RUN npm run build
RUN npx playwright install --with-deps
# Set environment variables (ensures non-interactive CI mode)
ENV CI=true
# Default command (can be overridden in GitHub Actions if needed)
# Default command (headless by default, can be overridden in CI)
CMD ["npx", "playwright", "test", "--reporter=html,line,allure-playwright,json", "--output=test-results"]