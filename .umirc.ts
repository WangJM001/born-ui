import { defineConfig } from 'dumi';
import { readdirSync } from 'fs';

const componentNames = readdirSync('./src');

// more config: https://d.umijs.org/config
export default defineConfig({
  title: 'Born UI',
  logo: '/logo.svg',
  outputPath: 'docs-dist',
  hash: true,
  dynamicImport: {
    loading: '@ant-design/pro-skeleton',
  },
  alias: {
    '@utech/born-ui': require('path').resolve(__dirname, './src'),
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@utech/born-ui',
        customName: (name: string) => {
          if (componentNames.includes(name)) {
            return `@utech/born-ui/${name}`;
          }
          return `antd/es/${name}`;
        },
        style: true,
      },
      'import-born-ui',
    ],
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'import-lodash',
    ],
    [
      'import',
      {
        libraryName: 'ahooks',
        libraryDirectory: 'es',
        camel2DashComponentName: false,
      },
      'import-a-hooks',
    ],
  ],
  styles: [`.__dumi-default-menu-header > a.__dumi-default-menu-logo { width: 42px; }`],
});
