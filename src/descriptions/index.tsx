import React, { cloneElement, useContext } from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import ADescriptions, { DescriptionsProps } from 'antd/lib/descriptions';
import AItem, { DescriptionsItemProps as ADescriptionsItemProps } from 'antd/lib/descriptions/Item';
import { CLASS_NAME_PREFIX } from '../constants';
import { ConfigContext } from '../config-provider';

export * from 'antd/lib/descriptions';

const className = `${CLASS_NAME_PREFIX}-descriptions`;

export interface DescriptionsItemProps extends ADescriptionsItemProps {
  suffix?: string;
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

      if (nodeProps.suffix) {
        return cloneElement(node, { key: i }, [nodeProps.children, nodeProps.suffix]);
      }

      return cloneElement(node, { key: i });
    });
  return (
    <ADescriptions className={classNames(className, propsClassName)} {...restProps}>
      {childNodes}
    </ADescriptions>
  );
};

Descriptions.Item = Item;

export default Descriptions;
