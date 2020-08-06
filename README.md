```text
 react-              /$$      /$$                     /$$      
                    | $$$    /$$$                    | $$      
  /$$$$$$   /$$$$$$ | $$$$  /$$$$  /$$$$$$   /$$$$$$$| $$   /$$
 /$$__  $$ /$$__  $$| $$ $$/$$ $$ /$$__  $$ /$$_____/| $$  /$$/
| $$  \__/| $$$$$$$$| $$  $$$| $$| $$  \ $$| $$      | $$$$$$/ 
| $$      | $$_____/| $$\  $ | $$| $$  | $$| $$      | $$_  $$ 
| $$      |  $$$$$$$| $$ \/  | $$|  $$$$$$/|  $$$$$$$| $$ \  $$
|__/       \_______/|__/     |__/ \______/  \_______/|__/  \__/
```

[![Build Status](https://secure.travis-ci.org/theKashey/react-remock.svg)](http://travis-ci.org/theKashey/react-remock)
[![Greenkeeper badge](https://badges.greenkeeper.io/theKashey/react-remock.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/react-remock.svg)](https://www.npmjs.com/package/react-remock)
[![downloads](https://badgen.net/npm/dm/react-remock)](https://www.npmtrends.com/react-remock)

JFYI: You can __mock any React Component__, rendered anywhere, and for the any reason.

This is like __proxyquire__, or jest.mock. Not for node.js, but for React. Pure __React Dependency Injection__.

- Every time you can NOT "storybook" something due to complexity. 
- Every time you can NOT "enzyme" something, cos something deeply inside is "too smart" (and you can't use shallow). 
- Every ^that^ time – mock the things you can NOT control.

Remock is based on the same technique, as [React-Hot-Loader](https://github.com/gaearon/react-hot-loader) - intercepts React calls and do... whatever you want.

# Use cases
This library was created for testing purposes only, while could be used to achive different tasks:
 - Using remock with __enzyme__ testing allows you to perform more _shallow_ mount testing.
 You can just mock out, complitely remove some (deep nested internal) Component which could make testing harder. For example - Redux Connect, always seeking proper Provider.
 
 - Using remock with __storybooks__ testing allows you to hide some parts of "bigger", stories, leaving a holes in the story plot.
   - In case you are using BEM notation - it is really super easy to cat a hole, as long dimensions are propertly of a block, not element.
   - Yet again, in case of redux - you can replace connect by another component, to make it easier to provide mocked data for the story.   

 - Remock created not only for testing, but (even more) for _hacking into_ components, and making pretty things.
 
## Featured in
- [(in)Finite War](https://dev.to/thekashey/infinite-war-995)
- [Why I Always Use Shallow Rendering](https://hackernoon.com/why-i-always-use-shallow-rendering-a3a50da60942)

# API

Play in codesandbox - https://codesandbox.io/s/xk7vp60o4

API is simple - it gets `React.createElement` as an input and returns `React.createElement` as an output.
And it will be called when real `React.createElement` has been called.

If you will not return anything - element willbe completely mocked. In other cases - you could specify what to return.
```js
 import {remock} from 'react-remock';

 remock.mock('ComponentName'); // you can mock by name
 remock.mock(/Connect\((.*)\)/); // you can mock by RegExp
 
 remock.mock(ComponentClass); // you can mock by class
 
 remock.mock({ propName:42 }); // you can mock by component props
 
 remock.transparent(Component); // replaces Component by () => children. Makes it "transparent"
 
 remock.renderProp(Component, ...arguments); // "unwraps" renderProp component, by calling function-as-children with provided arguments 
 
 remock.match((type, props, children) => true); // you can mock using user-defined function
 
 remock.mock(Component, (type, props, children) => ({type?, props?, children?})); // you can alter rendering
 
 // unmock any mock `like` this
 remock.unmock('ComponentName' | ComponentName);
 
 const unmock = remock.mock(ComponentClass);
 // remove mock this mock only
 unmock();
 
 // and dont forget to
 remock.clearMock();

 // "scoped" mocks for local cleanups 
 remock.push();
 remock.mock('anything')
 remock.pop();

 
 
 // You can also use "declarative" React API. (only with mount!)
 // mocking has a global effect, `Remocking` would only automate cleanup
 mount(
   <div>
       <Remocking component="Red" />
       <Red />
   </div>
 );
```
PS: preact support it yet untested

## Additional API
```js
import {createElement, enable, disable} from 'react-remock';

createElement() // is a "real" React.createElement;

disable() ;// you can always disable rewiremock as a whole
enable(); // and enable it back
```

## Dev/Production
The best way - not to use remock, and not require it in production.

If that is undoable - use "dev" exports, which will return mocked API for production builds.
```js
import {remock} from 'remock/dev';

// you still can run all the commands
// but remock core does not exists.
remock.mock(...);
```

## More examples
```js
// change prop on Hello
remock.mock(Hello, () => ({props:{name:"Remock"}}))

// change h2 to h3, change style, change children
remock.mock('h2', (type, props, children) => { 
  return ({
  type: 'h4',
  props: {
    ...props,
    style: {color:'#700'},   
  },
  children: `🧙️ ${children} 🛠`
})})

// wrap divs with a border
remock.mock('div', (type, props) => ({
  props: {
    ...props,
    style:{
      ...props.style,
      border:'1px solid #000'
    },
  }
}));
```

# Why you may need it?
- to empower shallow rendering [Why I Always Use Shallow Rendering](https://medium.com/@antonkorzunov/why-i-always-use-shallow-rendering-a3a50da60942)
- to wrap your components with another components, you were able to do with jquery - see [examples for react-queue](https://github.com/theKashey/react-queue#examples)
- color React-Dev-Tools, helping distinquish Stateful/SFC and RenderProps? [code-sandboxexample](https://codesandbox.io/s/x4p2zrvw4).

# See also
Remock is a little brother of [rewiremock](https://github.com/theKashey/rewiremock)
 
# Licence
 MIT
 
 

Happy mocking!
