# babel-plugin-transform-hoist-nested-functions
[![circle][circle-image]][circle-url]
[![npm][npm-image]][npm-url]
[![coverage][coverage-image]][coverage-url]

[![semantic release][semantic-release-image]][semantic-release-url]
[![js-semistandard-style][semistandard-image]][semistandard-url]
[![MIT License][license-image]][license-url]

Babel plugin to hoist nested functions to the outermost scope possible without changing their
contract.

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

Patterns like [React "render callbacks"]
(https://discuss.reactjs.org/t/children-as-a-function-render-callbacks/626),
that make heavy use of nested functions, incur the nonzero runtime cost of creating those
functions over and over. JavaScript engines [don't always optimize this cost away]
(https://bugs.chromium.org/p/v8/issues/detail?id=505).

To mitigate this cost, this plugin moves functions out of inner scopes wherever possible. A
function can be moved up through any scope that it does not reference explicitly. This is somewhat
analogous to what [babel-plugin-transform-react-constant-elements]
(https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements/)
does (and in fact some of the same Babel machinery is applied).


## Benchmarks

Coming soon. (Make your own with `npm run benchmark`)

## Caveats

### Experimental

This is a new, experimental plugin. Expect changes (adhering religiously to semver), and
please, please, **PLEASE** test and benchmark your code _very thoroughly_ before using this in
anything important.

### Not 100% transparent

While the plugin aims not to change the behavior of hoisted functions, the fact that they are
reused rather than recreated does have some visible consequences.

Consider the following code:

```js
function factory () {
  return function foo () {}; // foo() will be hoisted right above factory()
}
factory() === factory(); // :arrow_left:
```

That last expression evaluates to `false` in plain JavaScript, but will be `true` if `foo()` is
hoisted. 

More fundamentally, **references to hoisted inner functions are allowed to escape their enclosing
scopes**. You should determine whether this is appropriate for your code before using this plugin.

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

## Development

Use npm v3: `npm install -g npm@3`

```sh
git clone https://github.com/motiz88/babel-plugin-transform-hoist-nested-functions
cd babel-plugin-transform-hoist-nested-functions
npm install
# ... hackity hack hack ...
npm run test:local # Including tests (mocha), code coverage (nyc), code style (eslint), type checks
                   # (flow) and benchmarks.  
```

See package.json for more dev scripts you can use.

## Contributing

PRs are very welcome. Please make sure that `test:local` passes on your branch.

[circle-image]: https://img.shields.io/circleci/project/motiz88/babel-plugin-transform-hoist-nested-functions.svg?style=flat-square
[circle-url]: https://circleci.com/gh/motiz88/babel-plugin-transform-hoist-nested-functions
[npm-image]: https://img.shields.io/npm/v/babel-plugin-transform-hoist-nested-functions.svg?style=flat-square
[npm-url]: https://npmjs.org/package/babel-plugin-transform-hoist-nested-functions
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[license-image]: http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[license-url]: http://motiz88.mit-license.org/
[semistandard-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square
[semistandard-url]: https://github.com/Flet/semistandard
[coverage-image]: https://img.shields.io/codecov/c/github/motiz88/babel-plugin-transform-hoist-nested-functions.svg
[coverage-url]: https://codecov.io/gh/motiz88/babel-plugin-transform-hoist-nested-functions
