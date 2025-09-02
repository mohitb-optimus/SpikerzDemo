# Use Playwright base image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.55.0-jammy

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Build TypeScript
RUN npm run build

# Set environment variables (ensures non-interactive CI mode)
ENV CI=true

# Default command (can be overridden in GitHub Actions if needed)
CMD ["npx", "playwright", "test", "--reporter=html,line,allure-playwright,json", "--output=test-results"]