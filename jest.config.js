const { join } = require('path');

module.exports = {
  verbose: true,
  setupFiles: ['./tests/setup.js'],
  moduleNameMapper: {
    '@utech/born-ui': join(__dirname, `./src`),
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/*/style/index.tsx',
    '!src/style/index.tsx',
    '!src/*/__tests__/type.test.tsx',
    '!src/**/*/interface.{ts,tsx}',
    '!src/*/__tests__/image.test.{ts,tsx}',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost',
};
