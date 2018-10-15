import * as React from 'react';
import {resolver} from '../resolver';

const SIGN = 'isPatchedByReactRewiremock';

export const createElement = React.createElement;
export const cloneElement = React.cloneElement;
export const createFactory = React.createFactory;

function patchReact(React: any) {
  if (React) {
    if (!React.createElement[SIGN]) {

      React.createElement =
        (type: any, props: any = {}, ...args: any[]) => {
          const anyProps = props || {};
          const {type: newType = type, props: newProps = props, children = args} = resolver(type, props, args) as any;
          const key = anyProps.key;
          const ref = anyProps.ref;
          const finalProps = {
            key,
            ref,
            ...newProps
          };

          return finalProps && (finalProps.children !== anyProps.children)
            ? createElement(newType, finalProps)
            : createElement(newType, finalProps, ...children);
        };

      React.cloneElement =
        (type: any, props: any, ...args: any[]) => {
          const newElement = cloneElement(type, props, ...args);
          const key = newElement.key;
          const ref = newElement.ref;
          // extract children to separate prop
          const {children = [], ...rest} = newElement.props || {};
          return React.createElement(newElement.type, {
            key,
            ref,
            ...rest
          }, ...children);
        };

      React.createFactory = (type: any) => {
        const factory = React.createElement.bind(null, type);
        factory.type = type;
        return factory;
      }

      Object.defineProperty(React.createElement, SIGN, {
        configurable: false,
        writable: false,
        enumerable: false,
        value: true,
      });
    } else {
      console.log('skipping double patching');
    }
  }
}

export const enable = () => patchReact(React);
export const disable = () => {
  const R = React as any;
  R.createElement = createElement;
  R.cloneElement = cloneElement;
  R.createFactory = createFactory;
};

enable();