import * as React from 'react';
import {AnyElement, getMocks, mock, PartialMockedElement} from "./mocks";
import {Remocking} from './Components';

const resolver = (type: AnyElement, props: any, children: any[]): PartialMockedElement | React.ReactElement<any> => {
  if (type === Remocking) {
    mock(props.component);
  }
  const mocks = getMocks().filter(match => match.test(type, props || {}, children));
  if (mocks.length) {
    return mocks[mocks.length - 1].replace(type, props, children)
  }
  return {type, props, children};
};


export {
  resolver
}