import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  webServer: [
    { command: 'npm run dev', port: 5173, timeout: 30000 },
    { command: 'npm run dev', port: 3000, cwd: 'server', timeout: 30000, env: { TEST_MODE: 'true' } }
  ],
  use: { baseURL: 'http://localhost:5173' }
});
