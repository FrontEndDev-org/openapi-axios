import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.ts'],
    coverage: {
      reporter: ['lcov', 'text'],
    },
  },
});
