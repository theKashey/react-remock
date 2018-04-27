import * as React from 'react';
import {unmock} from "./mocks";

interface Props {
  component: React.ComponentType | string;
}

export class Remocking extends React.Component<Props> {
  componentWillUnmount() {
    unmock(this.props.component)
  }

  render(): React.ReactNode {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}