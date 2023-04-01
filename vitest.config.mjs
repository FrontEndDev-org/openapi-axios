import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      PKG_NAME: 'pkg-name-for-test',
      PKG_VERSION: 'pkg-version-for-test',
    },
    include: ['test/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      reporter: ['lcov', 'text'],
      // 包含所有源文件的覆盖率，而不是仅被单测的部分
      all: true,
    },
  },
});
