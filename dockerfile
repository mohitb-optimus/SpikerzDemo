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

# Install xvfb (virtual display server for headed mode in containers)
RUN apt-get update && apt-get install -y xvfb && rm -rf /var/lib/apt/lists/*

# Set environment variables (ensures non-interactive CI mode)
ENV CI=true

# Default command (can be overridden in GitHub Actions if needed)
# Wrap test command with xvfb-run so browsers can launch in headed mode
CMD ["xvfb-run", "-a", "npx", "playwright", "test", "--reporter=html,line,allure-playwright,json", "--output=test-results"]

