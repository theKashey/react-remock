import * as React from 'react';
import {resolver} from '../resolver';

const SIGN = 'isPatchedByReactRewiremock';

function patchReact(React: any) {
  if(React) {
    if (!React.createElement[SIGN]) {

      Object.defineProperty(React.createElement, SIGN, {
        configurable: false,
        writable: false,
        enumerable: false,
        value: true,
      });

      const originalCreateElement = React.createElement;
      const originalCloneElement = React.cloneElement;

      React.createElement =
        (type: any, props: any, ...args: any[]) => {
          const {type: newType = type, props: newProps = props, children = args} = resolver(type, props, args);
          return originalCreateElement(newType, newProps, ...children);
        };

      React.cloneElement =
        (type: any, props: any, ...args: any[]) => {
          const {type: newType = type, props: newProps = props, children = args} = resolver(type, props, args);
          return originalCloneElement(newType, newProps, ...children);
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