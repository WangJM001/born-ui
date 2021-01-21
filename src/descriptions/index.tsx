import { InfoCircleOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd/lib/descriptions';
import ADescriptions from 'antd/lib/descriptions';
import type { DescriptionsItemProps as ADescriptionsItemProps } from 'antd/lib/descriptions/Item';
import AItem from 'antd/lib/descriptions/Item';
import type { TooltipProps } from 'antd/lib/tooltip';
import Tooltip from 'antd/lib/tooltip';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import React, { cloneElement, useContext } from 'react';
import { ConfigContext } from '../config-provider';
import { CLASS_NAME_PREFIX } from '../constants';

export * from 'antd/lib/descriptions';

const className = `${CLASS_NAME_PREFIX}-descriptions`;

export interface DescriptionsItemProps extends ADescriptionsItemProps {
  suffix?: string;
  tip?: string | TooltipProps;
}

const Item = (props: DescriptionsItemProps) => <AItem {...props} />;

const Descriptions = ({ children, className: propsClassName, ...restProps }: DescriptionsProps) => {
  const { emptyText } = useContext(ConfigContext);
  const childNodes = toArray(children)
    .filter((n) => n)
    .map((node, i) => {
      const nodeProps = node.props as DescriptionsItemProps;
      if (!React.isValidElement(node) || (!nodeProps.children && nodeProps.children !== 0)) {
        return (
          <Item key={i} {...nodeProps}>
            {emptyText}
          </Item>
        );
      }

      const itemChildren = [nodeProps.children];
      if (nodeProps.suffix) {
        itemChildren.push(nodeProps.suffix);
      }

      if (nodeProps.tip) {
        const tooltipProps: TooltipProps =
          typeof nodeProps.tip === 'string' ? { title: nodeProps.tip } : nodeProps.tip;
        itemChildren.push(
          <Tooltip key="tip" {...tooltipProps}>
            <InfoCircleOutlined className={`${className}-tooltip-icon`} />
          </Tooltip>,
        );
      }

      return cloneElement(node, { key: i }, itemChildren);
    });
  return (
    <ADescriptions className={classNames(className, propsClassName)} {...restProps}>
      {childNodes}
    </ADescriptions>
  );
};

Descriptions.Item = Item;

export default Descriptions;
