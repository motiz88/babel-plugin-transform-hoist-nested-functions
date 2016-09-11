# babel-plugin-transform-hoist-nested-functions

[![Greenkeeper badge](https://badges.greenkeeper.io/motiz88/babel-plugin-transform-hoist-nested-functions.svg)](https://greenkeeper.io/)
[![circle][circle-image]][circle-url]
[![npm][npm-image]][npm-url]
[![coverage][coverage-image]][coverage-url]

[![semantic release][semantic-release-image]][semantic-release-url]
[![js-semistandard-style][semistandard-image]][semistandard-url]
[![MIT License][license-image]][license-url]

Babel plugin to hoist nested functions to the outermost scope possible without changing their
contract.

## Examples

### Example 1 - basic hoisting

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

### Example 2 - nested method hoisting

To enable this transformation, pass the `methods: true` option to the plugin (see below).
The output code depends on the ES2015 `Symbol` feature and the stage 2 class properties proposal.
You will _most likely_ want to run `babel-plugin-transform-class-properties` after `transform-hoist-nested-function`.

**In**

```js
class Foo {
  bar () {
    return () => this;
  }
}
```

**Out**

```js
const _hoistedMethod = new Symbol("_hoistedMethod"),

class Foo {
  [_hoistedMethod] = () => this;

  bar() {
    return this[_hoistedMethod];
  }
}
```

## Motivation

Patterns like [React "render callbacks"](https://discuss.reactjs.org/t/children-as-a-function-render-callbacks/626),
that make heavy use of nested functions, incur the nonzero runtime cost of creating those
functions over and over. JavaScript engines [don't always optimize this cost away](https://bugs.chromium.org/p/v8/issues/detail?id=505).

To mitigate this cost, this plugin moves functions out of inner scopes wherever possible. A
function can be moved up through any scope that it does not reference explicitly. This is somewhat
analogous to what [babel-plugin-transform-react-constant-elements](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements/)
does (and in fact some of the same Babel machinery is applied).

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
factory() === factory(); // ⬅ value depends on whether foo() is hoisted
```

That last expression evaluates to `false` in plain JavaScript, but is `true` if `foo()` has been
hoisted.

More fundamentally, **references to hoisted inner functions are allowed to escape their enclosing
scopes**. You should determine whether this is appropriate for your code before using this plugin.

## Benchmarks

[Here][benchmark-url] are benchmark results from the latest successful build on `master` using Node
v4 (make your own with `npm run benchmark`). The benchmark code is [here][benchmarks-directory] -
each file exports a single function that is repeatedly run and timed by [Benchmark.js]
(https://benchmarkjs.com).

From these preliminary results, it appears that hoisting functions this way can in fact improve
performance, at least in principle; but the benefit may not always be significant.

## Installation

```sh
$ npm install --save-dev babel-plugin-transform-hoist-nested-functions
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```js
// without options
{
  "plugins": ["transform-hoist-nested-functions"]
}

// with options
// NOTE: transform-class-properties is required in order to run the code
{
  "plugins": [
    ["transform-hoist-nested-functions", {
      "methods": true
    }],
    "transform-class-properties"
  ]
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

[circle-image]: https://img.shields.io/circleci/project/motiz88/babel-plugin-transform-hoist-nested-functions/master.svg?style=flat-square
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
[benchmark-url]: https://circleci.com/api/v1/project/motiz88/babel-plugin-transform-hoist-nested-functions/latest/artifacts/0/$CIRCLE_ARTIFACTS/benchmark.log?filter=successful&branch=master
[benchmarks-directory]: https://github.com/motiz88/babel-plugin-transform-hoist-nested-functions/tree/master/benchmarks
