import * as React from 'react';
import {AnyElement, getMocks, mock, PartialMockedElement} from "./mocks";
 import {Remocking} from './Remocking';

const resolver = (type: AnyElement, props: any, children: any[]): PartialMockedElement | React.ReactElement<any> => {
  if (type === Remocking) {
     props.__unmock = mock(props.component, props.by);
  }
  const mocks = getMocks().filter(match => match.test(type, props || {}, children));
  if (mocks.length) {
    return mocks[mocks.length - 1].replace(type, props, children)
  }
  return undefined;
};


export {
  resolver
}