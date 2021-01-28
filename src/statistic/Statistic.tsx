import type { FC } from 'react';
import React, { useContext } from 'react';
import classNames from 'classnames';
import { Statistic as AStatistic, Tooltip } from 'antd';
import type { StatisticProps as AStatisticProps } from 'antd/es/statistic/Statistic';
import type { TooltipProps } from 'antd/es/tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import { CLASS_NAME_PREFIX } from '../constants';
import { ConfigContext } from '../config-provider';

export interface StatisticProps extends AStatisticProps {
  footer?: React.ReactNode;
  tip?: string | TooltipProps;
  dataType?: 'percent' | 'currency';
  extra?: React.ReactNode;
  size?: 'default' | 'small';
}

const Statistic: FC<StatisticProps> = ({
  title,
  value,
  suffix,
  precision,
  footer,
  tip,
  className: propsClassName,
  dataType,
  extra,
  size,
  ...restProps
}) => {
  const className = `${CLASS_NAME_PREFIX}-statistic`;

  const { emptyText } = useContext(ConfigContext);

  let internalValue = value;
  let internalSuffix = suffix;
  let internalPrecision = precision;

  if (dataType === 'currency' && typeof internalValue === 'number') {
    internalPrecision = internalPrecision || 2;
    internalSuffix = '元';
    // if (internalValue >= 1000000) {
    //   internalValue /= 10000;
    //   internalSuffix = '万元';
    // }
  } else if (dataType === 'percent' && typeof internalValue === 'number') {
    internalValue *= 100;
    internalSuffix = '%';
    internalPrecision = internalPrecision || 1;
  }

  if (!internalValue && internalValue !== 0) {
    internalValue = emptyText || '';
    internalSuffix = '';
  }

  internalSuffix = (
    <>
      {internalSuffix && <span className={`${className}-content-suffix`}>{internalSuffix}</span>}
      {extra && <span className={`${className}-content-extra`}>{extra}</span>}
    </>
  );

  let mixTitle = title;
  if (tip) {
    const tooltipProps: TooltipProps = typeof tip === 'string' ? { title: tip } : tip;
    mixTitle = (
      <>
        {title}
        <Tooltip {...tooltipProps}>
          <InfoCircleOutlined className={`${className}-tooltip-icon`} />
        </Tooltip>
      </>
    );
  }

  return (
    <>
      <AStatistic
        className={classNames(className, propsClassName, {
          [`${className}-small`]: size === 'small',
        })}
        title={mixTitle}
        value={internalValue}
        suffix={internalSuffix}
        precision={internalPrecision}
        {...restProps}
      />
      {footer && <div className={`${className}-footer`}>{footer}</div>}
    </>
  );
};

export default Statistic;
