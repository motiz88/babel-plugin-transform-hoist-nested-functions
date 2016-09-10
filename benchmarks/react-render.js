// jsdom setup - used with enzyme full rendering

const jsdom = require('jsdom').jsdom;

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

const {createElement} = require('react');
const { mount } = require('enzyme');

function CounterState ({children, counter}) {
  return children({counter});
}

function App (props) {
  return createElement(
    'ol',
    null,
    createElement(
      CounterState,
      props,
      ({counter}) => createElement('li', null, 'Counter 1 is ', counter)
    ),
    createElement(
      CounterState,
      props,
      ({counter}) => createElement('li', null, 'Counter 2 is ', counter)
    )
  );
}

let counter = 0;
const wrapper = mount(createElement(App, {counter}));
module.exports = function () {
  wrapper.setProps({ counter: ++counter });
};
