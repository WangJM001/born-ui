---
title: Statistic
---

## 功能图谱

<img src='./demos/images/features.png' />

## 基础用法

<code src="./demos/basic.tsx"/>

## 显示组

<code src="./demos/group.tsx"/>

## API

### Statistic

> 这里只列出与 antd statistic 不同的 api

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| footer | 尾部 | `React.ReactNode` | - |
| titleTip | 标题栏提示 | `string \| TooltipProps` | - |
| dataType | 根据类型内置了格式化方法，`currency`当值大于 `1000000` 时，转换单位为`万元` | `currency \| percent` | - |

### StatisticGroup

| 属性       | 描述             | 类型      | 默认值 |
| ---------- | ---------------- | --------- | ------ |
| className  | className        | `string`  | -      |
| max        | 单行最大显示数量 | `number`  | 4      |
| expandable | 是否可展开       | `boolean` | true   |
