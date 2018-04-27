import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {remock, Remocking} from '../src';

const ComponentRed = () => <React.Fragment>Red</React.Fragment>;
const ComponentBlue = () => <React.Fragment>Blue</React.Fragment>;
const ComponentBlack = () => <React.Fragment>Black</React.Fragment>;
const Color: React.SFC<{ color: string }> = ({color}) => <React.Fragment>{color}</React.Fragment>;

describe('Remock', () => {

  describe('mock', () => {
    it('test before all', () => {
      const wrapper = shallow(<div>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
      </div>);
      expect(wrapper.html()).toBe("<div>RedBlueRedBlueRedBlue</div>");
    });

    it('Should mock all red ones by name', () => {
      remock.mock('ComponentRed');
      const wrapper = shallow(<div>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
      </div>);
      remock.clearMocks();
      expect(wrapper.html()).toBe("<div>BlueBlueBlue</div>");
    });

    it('Should mock all red ones by RegExp', () => {
      remock.mock(/Component(Red|Blue)/);
      const wrapper = shallow(<div>
        <ComponentRed/><ComponentBlue/><ComponentBlack/>
      </div>);
      remock.clearMocks();
      expect(wrapper.html()).toBe("<div>Black</div>");
    });

    it('Should mock all Blue ones by Class', () => {
      remock.mock(ComponentBlue);
      const wrapper = shallow(<div>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
      </div>);
      remock.clearMocks();
      expect(wrapper.html()).toBe("<div>RedRedRed</div>");
    });

    it('Should replace all Blue ones by Black', () => {
      remock.mock(ComponentBlue, () => ({type: Color, props: {color: 'Black'}}));
      const wrapper = shallow(<div>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
      </div>);
      remock.clearMocks();
      expect(wrapper.html()).toBe("<div>RedBlackRedBlackRedBlack</div>");
    });

    it('test after all', () => {
      const wrapper = shallow(<div>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
        <ComponentRed/><ComponentBlue/>
      </div>);
      expect(wrapper.html()).toBe("<div>RedBlueRedBlueRedBlue</div>");
    });
  });

  describe('match', () => {
    it('Should match by prop', () => {
      remock.match((type, props = {}) => props.color === "red", () => ({props: {color: "match"}}));
      const wrapper = shallow(<div>
        <Color color="blue"/><Color color="red"/><Color color="green"/>
      </div>);
      remock.clearMocks();
      expect(wrapper.html()).toBe("<div>bluematchgreen</div>");
    });
  });

  describe('Remock', () => {
    it('Should mock red', () => {
      const wrapper1 = mount(
        <div>
          <Remocking component="ComponentRed"/>

          <ComponentRed/>
          <ComponentBlue/>

          <Remocking component={ComponentBlue}/>
        </div>
      );

      expect(wrapper1.html()).toBe("<div>Blue</div>");
      wrapper1.unmount();
    });

    it('Should mock blue', () => {
      const wrapper2 = mount(
          <div>
            <Remocking component={ComponentBlue} />

            <ComponentRed/>
            <ComponentBlue/>
          </div>
      );
      expect(wrapper2.html()).toBe("<div>Red</div>");
      wrapper2.unmount();
    });
  });


});
