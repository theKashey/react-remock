import * as React from 'react';
import {ReactElement} from 'react';

export type ReactNode = ReactElement<any>;
export type AnyElement = string | React.ComponentType;
export type PartialElement = Partial<ReactNode>;

export type Matcher = (type: AnyElement, props: any) => boolean;
export type Mocker = (type: AnyElement, props: any) => PartialElement;

export interface Mock {
  test: Matcher;
  replace: Mocker;
}

let matchers: Mock[] = [];

const getNameOf = (type: any): string => {
  if (!type) return 'Unknown';
  if (typeof type === 'string') return type;
  return type.displayName || type.name || 'Component';
};

const realAddMock = (mock: Mock) => matchers.push(mock);

const MockedOut: React.SFC = () => null;
const defaultMock = (type: any, props: any) => ({
  type: MockedOut,
  props: {
    itWas: getNameOf(type),
    ...props
  }
});

const mock = (type: AnyElement, mockBy?: Mocker) => {
  const mock = {
    test: (element: AnyElement) => getNameOf(element) === type || element === type,
    replace: mockBy || defaultMock
  };
  return realAddMock(mock);
};

const match = (match: Matcher, mockBy?: Mocker) => {
  const mock = {
    test: match,
    replace: mockBy || defaultMock
  };
  return realAddMock(mock);
};

const unmock =
  (type: AnyElement, props?: any) => {
    matchers = matchers.filter(mock => !mock.test(type, props))
  }

const clearMocks = () => {
  matchers = [];
};

const getMocks = () => matchers;


export {
  mock,
  match,
  unmock,

  clearMocks,

  getMocks
}