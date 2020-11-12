import React, { FC, useContext, useMemo } from 'react';
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
  /** 当值大于1000000时，转换数字为万 */
  transformNumSuffix?: boolean;
}

const Statistic: FC<StatisticProps> = ({
  title,
  value,
  suffix,
  precision,
  footer,
  titleTip,
  className: propsClassName,
  transformNumSuffix,
  ...restProps
}) => {
  const className = `${CLASS_NAME_PREFIX}-statistic`;

  const { emptyText } = useContext(ConfigContext);

  const mergeProps = useMemo(() => {
    if (transformNumSuffix) {
      let internalValue = value;
      let internalSuffix = suffix || '';
      let internalPrecision = precision;

      if (typeof value === 'number' && value >= 1000000) {
        internalValue = value / 10000;
        internalSuffix = `万${internalSuffix}`;
        if (!internalPrecision) {
          internalPrecision = 2;
        }
      }
      return {
        value:
          typeof internalValue === 'undefined' || internalValue === null
            ? emptyText || ''
            : internalValue,
        suffix:
          typeof internalValue === 'undefined' || internalValue === null
            ? undefined
            : internalSuffix,
        precision: internalPrecision,
      };
    }
    return undefined;
  }, [value, suffix, precision, transformNumSuffix]);

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
        {...restProps}
        {...mergeProps}
      />
      {footer && <div className={`${className}-footer`}>{footer}</div>}
    </>
  );
};

Statistic.defaultProps = {
  transformNumSuffix: true,
  precision: 2,
};

export default Statistic;
