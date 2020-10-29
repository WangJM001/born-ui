import React, { useContext } from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import ADescriptions, { DescriptionsProps } from 'antd/lib/descriptions';
import Item, { DescriptionsItemProps } from 'antd/lib/descriptions/Item';
import { CLASS_NAME_PREFIX } from '../constants';
import { ConfigContext } from '../config-provider';

export * from 'antd/lib/descriptions';

const className = `${CLASS_NAME_PREFIX}-descriptions`;

const Descriptions = ({ children, className: propsClassName, ...restProps }: DescriptionsProps) => {
  const { emptyText } = useContext(ConfigContext);
  const childNodes = toArray(children)
    .filter((n) => n)
    .map((node, i) => {
      if (
        !React.isValidElement(node) ||
        (!(node.props as DescriptionsItemProps).children &&
          (node.props as DescriptionsItemProps).children !== 0)
      )
        return (
          <Item key={i} {...node.props}>
            {emptyText}
          </Item>
        );
      return node;
    });
  return (
    <ADescriptions className={classNames(className, propsClassName)} {...restProps}>
      {childNodes}
    </ADescriptions>
  );
};

Descriptions.Item = Item;

export default Descriptions;
