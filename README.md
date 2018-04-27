# rewiremock [![Build Status](https://secure.travis-ci.org/theKashey/react-remock.svg)](http://travis-ci.org/theKashey/react-remock)

[![NPM](https://nodei.co/npm/react-remock.png?downloads=true&stars=true)](https://nodei.co/npm/react-remock/)

JFYI: You can mock any React element, rendered anywhere, for any reason.
This is like proxyquire, or jest.mock, but for React.
>Every time you can NOT "story" something due to complexity. Every time you can NOT "enzyme" something
cos something deeply inside is "too smart" (and you can't use shallow). Every time mock the things you can NOT control.

```text
                     /$$      /$$                     /$$      
                    | $$$    /$$$                    | $$      
  /$$$$$$   /$$$$$$ | $$$$  /$$$$  /$$$$$$   /$$$$$$$| $$   /$$
 /$$__  $$ /$$__  $$| $$ $$/$$ $$ /$$__  $$ /$$_____/| $$  /$$/
| $$  \__/| $$$$$$$$| $$  $$$| $$| $$  \ $$| $$      | $$$$$$/ 
| $$      | $$_____/| $$\  $ | $$| $$  | $$| $$      | $$_  $$ 
| $$      |  $$$$$$$| $$ \/  | $$|  $$$$$$/|  $$$$$$$| $$ \  $$
|__/       \_______/|__/     |__/ \______/  \_______/|__/  \__/
```

Remock is based on the same technique, as [React-Hot-Loader](https://github.com/gaearon/react-hot-loader) - intercepts React calls and do.. what ever you want.

# Use cases
This library was create for testing purposes only.
 - Using remock with __enzyme__ testing allows you to perform more _shallow_ mount testing.
 You can just mock out, complitely remove some (deep nested internal) Component which could make testing harder. For example - Redux Connect, always seeking proper Provider.
 
 - Using remock with __storybooks__ testing allows you to hide some parts of "bigger", stories, leaving a holes in the story plot.
   - In case you are using BEM notation - it is really super easy to cat a hole, as long dimensions are propertly of a block, not element.
   - Yet again, in case of redux - you can replace connect by another component, to make it easier to provide mocked data for the story.   

# API

Play in codesandbox - https://codesandbox.io/s/xk7vp60o4

```js
 import {remock} from 'react-remock';

 remock.mock('ComponentName'); // you can mock by name
 
 remock.mock(ComponentClass); // you can mock by class
 
 remock.match((type, props) => true); // you can mock using user-defined function
 
 remock.mock(Component, (type, props, children) => ({type, props, children})); // you can alter rendering
 
 remock.unmock('ComponentName' | ComponentName);
 
 // and dont forget to
 remock.clearMock();
 
 
 // You can also use "declarative" React API. (only with mount!)
 mount(
   <div>
       <Remocking component="Red">
       <Red />
   </div>
 );
```

# See also
Remock is a little brother of [rewiremock](https://github.com/theKashey/rewiremock)
 
# Licence
 MIT
 
 

Happy mocking!
