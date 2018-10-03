import * as React from 'react';

export type AnyElement = string | React.ComponentType<any>;
export type ElementMatcher = AnyElement | RegExp;
export type PartialMockedElement = { type?: AnyElement, props?: any, children?: any[] };

export type Matcher = (type: ElementMatcher, props: any, children?: any[]) => boolean;
export type Mocker = (type: AnyElement, props?: any, children?: any[]) => undefined | PartialMockedElement | React.ComponentType<any>

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
const MockedTransparent: React.SFC = ({children}) => children as any;

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
        (
          typeof type !== 'function' && (
            elementName === type ||
            (typeof type!=="string" && !!elementName.match(type))
          )
        )
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

const transparent = (type: ElementMatcher) => {
  return mock(type, () => ({type: MockedTransparent}))
};

const renderProp = (type: ElementMatcher, ...args: any[]) => {
  return mock(
    type,
    (type, props, _children) => {
      const children = Array.isArray(_children) ? _children[0]:_children;

      if(typeof children !== "function"){
        console.error('remock: mocked', type,' expects', children,' to be a function (it is ',typeof children,')');
        return {};
      }
      return {
        type: MockedTransparent,
        props: {itWas: type}, children: (children as any)(...args)
      }
    }
  )
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

  transparent,
  renderProp,

  clearMocks,

  getMocks
}