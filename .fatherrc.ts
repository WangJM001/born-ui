export default {
  entry: 'src/index.tsx',
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  cjs: { type: 'babel' },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: false,
      },
      'import-antd',
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
};
