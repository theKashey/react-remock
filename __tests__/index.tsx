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

    it('should transparentize', () => {
      const BadComponent:React.SFC = () => <span>dead end</span>;

      const wrapper1 = mount(<BadComponent>good content</BadComponent>);
      expect(wrapper1.html()).toBe("<span>dead end</span>");

      remock.transparent(BadComponent);
      const wrapper2 = mount(<BadComponent><div>good content</div></BadComponent>);
      remock.clearMocks();

      expect(wrapper2.html()).toBe("<div>good content</div>");
    });

    it('should unwrap renderprop', () => {
      const RenderProp:React.SFC<{children: (a:number) => React.ReactElement<any>}> = ({children}) => children(42);

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

      class RenderProp extends React.Component<{children: (a:number) => React.ReactElement<any>}> {
        render(){
          return <div>will render {this.props.children(42)}</div>;
        }
      }

      const TopLevel: React.SFC = () => <RenderProp>{x => <div>{x}</div>}</RenderProp>;

      const wrapper1 = mount(<TopLevel/>);
      expect(wrapper1.text()).toBe("will render 42");

      const wrapper2 = shallow(<TopLevel />);
      expect(wrapper2.text()).toBe("<RenderProp />");

      remock.renderProp(RenderProp, 24);
      const wrapper3 = mount(<TopLevel />);
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
