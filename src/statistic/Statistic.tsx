import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { Statistic as AStatistic, Tooltip } from 'antd';
import { StatisticProps as AStatisticProps } from 'antd/es/statistic/Statistic';
import { TooltipProps } from 'antd/es/tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import { CLASS_NAME_PREFIX } from '../constants';
import { ConfigContext } from '../config-provider';

export interface StatisticProps extends AStatisticProps {
  footer?: React.ReactNode;
  titleTip?: string | TooltipProps;
  dataType?: 'percent' | 'currency';
}

const Statistic: FC<StatisticProps> = ({
  title,
  value,
  suffix,
  precision,
  footer,
  titleTip,
  className: propsClassName,
  dataType,
  ...restProps
}) => {
  const className = `${CLASS_NAME_PREFIX}-statistic`;

  const { emptyText } = useContext(ConfigContext);

  let internalValue = value;
  let internalSuffix = suffix || '';
  let internalPrecision = precision;

  if (dataType === 'currency' && typeof internalValue === 'number') {
    internalSuffix = '元';
    internalPrecision = 2;
    if (internalValue >= 1000000) {
      internalValue /= 10000;
      internalSuffix = '万元';
    }
  } else if (dataType === 'percent' && typeof internalValue === 'number') {
    internalValue *= 100;
    internalSuffix = `% ${internalSuffix}`;
    internalPrecision = 1;
  }

  if (!internalValue && internalValue !== 0) {
    internalValue = emptyText || '';
    internalSuffix = '';
  }

  let mixTitle = title;
  if (titleTip) {
    const tooltipProps: TooltipProps =
      typeof titleTip === 'string' ? { title: titleTip } : titleTip;
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
        className={classNames(classNames, propsClassName)}
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
