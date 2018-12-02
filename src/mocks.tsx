import * as React from 'react';

export type AnyElement = string | React.ComponentType<any>;
export type ElementMatcher = AnyElement | RegExp;
export type PartialMockedElement = { type?: AnyElement, props?: any, children?: any[] };

export type Matcher = (type: ElementMatcher, props: any, children?: any[]) => boolean;
export type Mocker = (type: AnyElement, props?: any, children?: any[]) => undefined | PartialMockedElement | React.ReactElement<any>
export type Unsubscribe = () => void;

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

const realAddMock = (mock: Mock): Unsubscribe => {
  matchers.push(mock);
  return () => matchers = matchers.filter(el => el !== mock);
};

const MockedOut: React.SFC = () => null;
const MockedTransparent: React.SFC = ({children}) => children as any;

const defaultMock = (type: any, props: any) => ({
  type: MockedOut,
  props: {
    itWas: getNameOf(type),
    ...props
  }
});

const mock = (type: ElementMatcher, mockBy?: Mocker): Unsubscribe => {
  const mock = {
    test: (element: AnyElement) => {
      const elementName = getNameOf(element);
      return element === type ||
        (
          typeof type !== 'function' && (
            elementName === type ||
            (typeof type !== "string" && !!elementName.match(type))
          )
        )
    },
    replace: mockBy || defaultMock
  };
  return realAddMock(mock);
};

const match = (match: Matcher, mockBy?: Mocker): Unsubscribe => {
  const mock = {
    test: match,
    replace: mockBy || defaultMock
  };
  return realAddMock(mock);
};

const transparent = (type: ElementMatcher): Unsubscribe => {
  return mock(type, () => ({type: MockedTransparent}))
};

const renderProp = (type: ElementMatcher, ...args: any[]): Unsubscribe => {
  return mock(
    type,
    (type, props, _children) => {
      const children = Array.isArray(_children) ? _children[0] : _children;

      if (typeof children !== "function") {
        console.error('remock: mocked', type, ' expects', children, ' to be a function (it is ', typeof children, ')');
        return {};
      }
      return {
        type: MockedTransparent,
        props: {
          itWas: getNameOf(type),
          ...props,
        },
        children: (children as any)(...args)
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