import {Remocking, remock} from "../src";
import * as React from 'react';
import {AppWrapper} from './styled';

const Blue = () => <div>blue</div>
const BlueHole = () => <div>blue hole</div>
const Hole: React.SFC<{caption:string}> = () => <div>hole</div>

const NewHole = ({children}:{children:any}) => <div>{children}-new-hole</div>

remock.mock('Hole', ( type, props) => ({
  type: NewHole,
  props: {
    children: "!"+props.caption
  }
}));

remock.mock('h2', (type, props: any, children: any) => {
  return ({
    type: 'h4',
    props: {
      ...props,
      color: '#400',
    },
    children: [`Mock! ${children} Mock!`]
  })});

const AppTest = () => (
  <div>
    <Blue/>
    <BlueHole/>
    <Hole caption="big" />
    <h2>test</h2>
  </div>
)

export default class App extends React.Component <{}> {

  render() {
    return (
      <AppWrapper>
        {/*<Remocking component="Blue"/>*/}
        <Remocking component={BlueHole}/>
        <AppTest/>
        Example!
        <h2>test</h2>
      </AppWrapper>
    )
  }
}