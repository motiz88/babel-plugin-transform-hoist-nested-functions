var
// NOTE: hoisted
_inner = function inner() {};

(function () {
  var inner = _inner;

  return inner;
})();

var
// NOTE: hoisted
_inner2 = function inner() {};

(function () {
  var inner = _inner2;

  return inner;
})();

var _inner3 = function inner() {};

(function () {
  // NOTE: hoisted
  return _inner3;
})();

var _hoistedAnonymousFunc = function () {};

(function () {
  // NOTE: hoisted
  return _hoistedAnonymousFunc;
})();

var _hoistedAnonymousFunc2 = () => {};

(function () {
  // NOTE: hoisted
  return _hoistedAnonymousFunc2;
})();

var _hoistedAnonymousFunc3 = () => {};

(function () {
  // NOTE: hoisted
  const x = _hoistedAnonymousFunc3;
  return x;
})();