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

    it('Should not mock string without exact match', () => {
      remock.mock('Component');
      remock.mock('componentred');
      const wrapper = shallow(<div>
        <ComponentRed/><ComponentBlue/><ComponentBlack/>
      </div>);
      remock.clearMocks();
      expect(wrapper.html()).toBe("<div>RedBlueBlack</div>");
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

    it('Should replace children', () => {
      remock.mock(ComponentBlue, (type, props) => <span {...props}>mocked</span>);
      const wrapper = shallow(<div>
        <ComponentBlue>original</ComponentBlue>
        <ComponentBlue>child</ComponentBlue>
      </div>);
      remock.clearMocks();
      expect(wrapper.html()).toBe("<div><span>mocked</span><span>mocked</span></div>");
    });

    it('should transparentize', () => {
      const BadComponent: React.SFC = () => <span>dead end</span>;

      const wrapper1 = mount(<BadComponent>good content</BadComponent>);
      expect(wrapper1.html()).toBe("<span>dead end</span>");

      remock.transparent(BadComponent);
      const wrapper2 = mount(<BadComponent>
        <div>good content</div>
      </BadComponent>);
      remock.clearMocks();

      expect(wrapper2.html()).toBe("<div>good content</div>");
    });

    it('should unwrap renderprop', () => {
      const RenderProp: React.SFC<{ children: (a: number) => React.ReactElement<any> }> = ({children}) => children(42);

      const wrapper1 = mount(<RenderProp>{x => <div>{x}</div>}</RenderProp>);
      expect(wrapper1.html()).toBe("<div>42</div>");

      const wrapper2 = shallow(<RenderProp>{x => <div>{x}</div>}</RenderProp>);
      expect(wrapper2.html()).toBe("<div>42</div>");

      remock.renderProp(RenderProp, 24);
      const wrapper3 = mount(<RenderProp>{x => <div>{x}</div>}</RenderProp>);
      remock.clearMocks();
      expect(wrapper3.html()).toBe("<div>24</div>");
    });

    it('should unwrap class renderprop', () => {

      class RenderProp extends React.Component<{ children: (a: number) => React.ReactElement<any> }> {
        render() {
          return <div>will render {this.props.children(42)}</div>;
        }
      }

      const TopLevel: React.SFC = () => <RenderProp>{x => <div>{x}</div>}</RenderProp>;

      const wrapper1 = mount(<TopLevel/>);
      expect(wrapper1.text()).toBe("will render 42");

      const wrapper2 = shallow(<TopLevel/>);
      expect(wrapper2.text()).toBe("<RenderProp />");

      remock.renderProp(RenderProp, 24);
      const wrapper3 = mount(<TopLevel/>);
      remock.clearMocks();
      expect(wrapper3.text()).toBe("24");
    });

    // ---------------------------

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
          <Remocking component={ComponentBlue}/>

          <ComponentRed/>
          <ComponentBlue/>
        </div>
      );
      expect(wrapper2.html()).toBe("<div>Red</div>");
      wrapper2.unmount();
    });
  });

  describe('React API', () => {
    describe('createElement', () => {
      it('replace type', () => {
        remock.mock('ComponentRed', () => ({type: ComponentBlue}));
        const test = React.createElement(ComponentRed, {prop1: 1}, 42);
        remock.clearMocks();
        expect(test.type).toBe(ComponentBlue);
        expect(test.props).toEqual({
          prop1: 1,
          children: 42
        });
      });

      it('replace prop', () => {
        remock.mock('ComponentRed', () => ({props: {prop2: 2}}));
        const test = React.createElement(ComponentRed, {prop1: 1}, 42);
        remock.clearMocks();
        expect(test.props).toEqual({
          prop2: 2,
          children: 42
        })
      });

      it('merge prop', () => {
        remock.mock('ComponentRed', (type, props) => ({props: {...props, prop2: 2}}));
        const test = React.createElement(ComponentRed, {prop1: 1, key: 'key'}, 42);
        remock.clearMocks();
        expect(test.key).toBe('key');
        expect(test.props).toEqual({
          prop1: 1,
          prop2: 2,
          children: 42
        })
      });

      it('replace child', () => {
        remock.mock('ComponentRed', () => ({children: 24 as any}));
        const test = React.createElement(ComponentRed, {prop1: 1, children: 22}, 42);
        remock.clearMocks();
        expect(test.props).toEqual({
          prop1: 1,
          children: 24
        })
      });

      it('replace child via props', () => {
        remock.mock('ComponentRed', () => ({props: {children: 24 as any}}));
        const test = React.createElement(ComponentRed, {prop1: 1}, 42);
        remock.clearMocks();
        expect(test.props).toEqual({
          children: 24
        })
      });

      it('support child overwrite', () => {
        const test1 = React.createElement(ComponentRed, {prop1: 1}, 42);
        expect(test1.props).toEqual({
          prop1: 1,
          children: 42
        });
        const test2 = React.createElement(ComponentRed, {prop1: 2, children: 24}, 42);
        expect(test2.props).toEqual({
          prop1: 2,
          children: 42
        });
      });
    });

    describe('cloneElement', () => {

      const base = React.createElement(ComponentRed, {prop1: 1, key: 'key'}, 42);

      it('replace type', () => {
        remock.mock('ComponentRed', () => ({type: ComponentBlue}));
        const test = React.cloneElement(base, {prop2: 2}, 24);
        remock.clearMocks();
        expect(test.type).toBe(ComponentBlue);
        expect(test.key).toBe('key');
        expect(test.props).toEqual({
          prop1: 1,
          prop2: 2,
          children: 24
        });
      });

      it('replace prop', () => {
        remock.mock('ComponentRed', () => ({props: {prop3: 2}}));
        const test = React.cloneElement(base, {prop2: 2}, 24);
        remock.clearMocks();
        expect(test.props).toEqual({
          prop3: 2,
          children: 24
        })
      });

      it('replace prop, but not children', () => {
        remock.mock('ComponentRed', () => ({props: {prop3: 2}}));
        const test = React.cloneElement(base, {prop2: 2});
        remock.clearMocks();
        expect(test.props).toEqual({
          prop3: 2,
          children: 42
        })
      });

      it('merge prop', () => {
        remock.mock('ComponentRed', (type, props) => ({props: {...props, prop3: 3}, children: 24 as any}));
        const test = React.cloneElement(base, {prop2: 2}, 24);
        remock.clearMocks();
        expect(test.props).toEqual({
          prop1: 1,
          prop2: 2,
          prop3: 3,
          children: 24
        })
      });

      it('replace prop', () => {
        remock.mock('ComponentRed', () => ({children: 24 as any}));
        const test = React.cloneElement(base, {prop2: 2}, 24);
        remock.clearMocks();
        expect(test.props).toEqual({
          prop1: 1,
          prop2: 2,
          children: 24
        })
      });
    });

  });

});
