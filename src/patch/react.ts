import * as React from 'react';
import {resolver} from '../resolver';

const SIGN = 'isPatchedByReactRewiremock';

export const createElement = React.createElement;
export const cloneElement = React.cloneElement;

function patchReact(React: any) {
  if (React) {
    if (!React.createElement[SIGN]) {

      Object.defineProperty(React.createElement, SIGN, {
        configurable: false,
        writable: false,
        enumerable: false,
        value: true,
      });

      React.createElement =
        (type: any, props: any = {}, ...args: any[]) => {
          const {type: newType = type, props: newProps = props, children = args} = resolver(type, props, args);
          return newProps && newProps.children
            ? createElement(newType, newProps)
            : createElement(newType, newProps, ...children);
        };

      React.cloneElement =
        (type: any, props: any, ...args: any[]) => {
          const newElement = cloneElement(type, props, ...args);
          const children = newElement.props && newElement.props.children || [];
          return React.createElement(newElement.type, newElement.props, ...children);
        };

      React.createFactory = (type: any) => {
        const factory = React.createElement.bind(null, type);
        factory.type = type;
        return factory;
      }
    }
  }
}

patchReact(React);