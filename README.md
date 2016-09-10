Read babel plugin handbook -> https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md

Try http://astexplorer.net/#/Pcw9baefXI for a visual understanding.

# babel-plugin-transform-hoist-nested-functions

Babel plugin to hoist nested functions to the outermost scope possible without changing their contract.

## Example

**In**

```js
function renderApp () {
  return renderStateContainer(
    ({value}) => renderValue(value)
  );
}
```

**Out**

```js
var _hoistedAnonymousFunc = ({ value }) => renderValue(value);

function renderApp () {
  return renderStateContainer(_hoistedAnonymousFunc);
}
```

## Motivation

Patterns like [React "render callbacks"](https://discuss.reactjs.org/t/children-as-a-function-render-callbacks/626),
that make heavy use of nested functions, incur the nonzero runtime cost of creating those functions over and over. JavaScript engines
[don't always optimize this cost away](https://bugs.chromium.org/p/v8/issues/detail?id=505).

To mitigate this cost, this plugin moves functions out of inner scopes wherever possible. A function can be moved up
through any scope that it does not reference explicitly. This is somewhat analogous to what
[babel-plugin-transform-react-constant-elements](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements/)
does (and in fact uses some of the same Babel machinery is applied).


## Benchmarks

Coming soon. (Make your own with `npm run benchmark`)

## Caveats

This transformation does lead to some observable changes in behavior. For example, given the following code:

```js
function factory () {
  return function foo () {}; // will be hoisted to be a sibling of factory()
}
factory() === factory() // normally false, but true if hoisted
```

More generally, **references to inner functions are allowed to escape their enclosing scopes**, as the transformation would be much less useful otherwise.

## Installation

```sh
$ npm install --save-dev babel-plugin-transform-hoist-nested-functions
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-hoist-nested-functions"]
}
```

### Via CLI

```sh
$ babel --plugins transform-hoist-nested-functions script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-hoist-nested-functions"]
});
```
