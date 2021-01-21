import { Card as ACard } from 'antd';
import type { CardProps as ACardProps } from 'antd/lib/card';
import Grid from 'antd/lib/card/Grid';
import Meta from 'antd/lib/card/Meta';
import classNames from 'classnames';
import React from 'react';
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

export interface CardInterface extends React.FC<CardProps> {
  Grid: typeof Grid;
  Meta: typeof Meta;
}

const className = `${CLASS_NAME_PREFIX}-card`;

const Card: CardInterface = ({ headerSplit, ghost, className: propsClassName, ...restProps }) => (
  <ACard
    className={classNames(className, propsClassName, {
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

Card.Grid = Grid;
Card.Meta = Meta;

export default Card;
