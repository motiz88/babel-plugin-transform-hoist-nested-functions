var _this = this;

(function () {
  // NOTE: not hoisted
  return () => this;
})();

class A {
  method() {
    // FIXME: not hoisted but we could make it a "private" method
    return () => this;
  }
}

var
// NOTE: hoisted
_B = function B() {
  return this;
};

var _hoistedAnonymousFunc2 = () => _B;

(function A() {
  // NOTE: hoisted
  return _hoistedAnonymousFunc2;
})();

// NOTE: not hoisted
() => _this;