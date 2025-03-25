import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
    },
    reporters: ['junit', 'json', 'default'],
    outputFile: {
      junit: './coverage/junit-report.xml',
      json: './coverage/json-report.json',
    },
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom',
    globals: true,
  }
});