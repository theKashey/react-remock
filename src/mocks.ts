import * as React from 'react';

export type AnyElement = string | React.ComponentType<any>;
export type ElementMatcher = AnyElement | RegExp;

export type Matcher = (type: ElementMatcher, props: any, children?: any[]) => boolean;
export type Mocker = (type: AnyElement, props?: any, children?: any[]) => { type?: AnyElement, props?: any, children?: any[] };

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

const mock = (type: ElementMatcher, mockBy?: Mocker) => {
  const mock = {
    test: (element: AnyElement) => {
      const elementName = getNameOf(element);
      return element === type ||
      (typeof type !== 'function' && (elementName === type || !!elementName.match(type)))
    },
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