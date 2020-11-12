import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import React from 'react';
import classNames from 'classnames';
import { CLASS_NAME_PREFIX } from '../constants';

export interface TrendProps {
  colorful?: boolean;
  flag: 'up' | 'down';
  style?: React.CSSProperties;
  reverseColor?: boolean;
  className?: string;
}

const Trend: React.FC<TrendProps> = ({
  colorful = true,
  reverseColor = false,
  flag,
  children,
  className: propsClassName,
  ...rest
}) => {
  const className = `${CLASS_NAME_PREFIX}-trend`;

  const classString = classNames(
    className,
    {
      [`${className}-grey`]: !colorful,
      [`${className}-reverse`]: reverseColor && colorful,
    },
    propsClassName,
  );
  return (
    <div {...rest} className={classString} title={typeof children === 'string' ? children : ''}>
      <span className={`${className}-${flag}`}>{children}</span>
      {flag && (
        <span className={`${className}-${flag}`}>
          {flag === 'up' ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </span>
      )}
    </div>
  );
};

export default Trend;
