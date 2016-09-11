const _hoistedMethod = new Symbol("_hoistedMethod"),
      _hoistedMethod2 = new Symbol("_hoistedMethod2");

var _hoistedAnonymousFunc2 = function () {};

class A {
  outer() {
    // NOTE: hoisted
    _hoistedAnonymousFunc2();
  }
}

class B {
  [_hoistedMethod] = () => this;

  outer() {
    // NOTE: hoisted to bound method
    this[_hoistedMethod]();
  }
}

class C {
  [_hoistedMethod2] = () => this;

  static outer() {
    // NOTE: hoisted to static method
    console.log(this[_hoistedMethod2]());
  }
}