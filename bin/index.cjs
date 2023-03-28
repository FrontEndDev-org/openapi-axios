#!/usr/bin/env node

const { start } = require('../dist-cjs/index.cjs');

start()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
