import React, { FC } from 'react';
import classNames from 'classnames';
import { Card as ACard } from 'antd';
import { CardProps as ACardProps } from 'antd/lib/card';
import { CLASS_NAME_PREFIX } from '../constants';

export interface CardProps extends ACardProps {
  /**
   * 是否显示header分割线
   */
  headerSplit?: boolean;
  /**
   * 幽灵模式，即是否取消卡片header的 padding 和 背景颜色
   */
  ghost?: boolean;
}

const className = `${CLASS_NAME_PREFIX}-card`;

const Card: FC<CardProps> = ({ headerSplit, ghost, ...restProps }) => (
  <ACard
    className={classNames(className, {
      [`${className}-ghost`]: ghost,
      [`${className}-without-header-split`]: !headerSplit,
    })}
    {...restProps}
  />
);

Card.defaultProps = {
  bordered: false,
  headerSplit: false,
};

export default Card;
