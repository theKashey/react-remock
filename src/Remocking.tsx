import * as React from 'react';
import {ElementMatcher, Mocker, mock} from "./mocks";

export interface Props {
  component: ElementMatcher;
  by?: Mocker;
}

export class Remocking extends React.Component<Props> {
  // remock is adding the mock in `resolver`

  componentWillUnmount() {
    (this.props as any).__unmock();
  }

  render(): React.ReactNode {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}