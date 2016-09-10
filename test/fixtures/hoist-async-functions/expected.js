var
// NOTE: hoisted
_inner = async function inner() {};

(async function () {
  var inner = _inner;

  return inner;
})();

var
// NOTE: hoisted
_inner2 = async function inner() {};

(async function () {
  var inner = _inner2;

  return inner;
})();

var _inner3 = async function inner() {};

(async function () {
  // NOTE: hoisted
  return _inner3;
})();

var _hoistedAnonymousFunc = async function () {};

(async function () {
  // NOTE: hoisted
  return _hoistedAnonymousFunc;
})();

var _hoistedAnonymousFunc2 = async () => {};

(async function () {
  // NOTE: hoisted
  return _hoistedAnonymousFunc2;
})();

var _hoistedAnonymousFunc3 = async () => {};

(async function () {
  // NOTE: hoisted
  const x = _hoistedAnonymousFunc3;
  return x;
})();