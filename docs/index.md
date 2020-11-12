---
title: 使用说明
---

# Born UI

`born-ui` 是基于 `antd` 的 React UI 组件库

在 `antd` 组件库的基础上新添加了一些常用组件，扩展了一些原有组件

原 `antd` 组件可以通过 `born-ui` 直接使用

## 版本

```jsx | inline
import React from 'react';
import { version, dependencies } from '../package.json';

export default () => (
  <div>
    <span
      style={{ color: '#fff', backgroundColor: '#555', padding: 4, borderRadius: '2px 0 0 2px' }}
    >
      @utech/born-ui
    </span>
    <span
      style={{
        color: '#fff',
        backgroundColor: '#007ec6',
        padding: 4,
        borderRadius: '0 2px 2px 0',
      }}
    >
      v{version}
    </span>
    <span style={{ margin: '0 16px', fontSize: 16 }}>→</span>
    <span
      style={{ color: '#fff', backgroundColor: '#555', padding: 4, borderRadius: '2px 0 0 2px' }}
    >
      antd
    </span>
    <span
      style={{
        color: '#fff',
        backgroundColor: '#007ec6',
        padding: 4,
        borderRadius: '0 2px 2px 0',
      }}
    >
      v{dependencies.antd}
    </span>
  </div>
);
```

## 📦 安装

```bash
npm install antd --save
```

```bash
yarn add antd
```

## 🔨 示例

```jsx | pure
import { Button, DatePicker } from '@utech/born-ui';
import '@utech/born-ui/es/button/style';
import '@utech/born-ui/es/date-picker/style';

const App = () => (
  <>
    <Button type="primary">PRESS ME</Button>
    <DatePicker />
  </>
);
```

可以使用`babel-import-plugin`，按需加载，自动引入样式

```jsx | pure
import { Button, DatePicker } from '@utech/born-ui';

const App = () => (
  <>
    <Button type="primary">PRESS ME</Button>
    <DatePicker />
  </>
);
```
