var _hoistedAnonymousFunc2 = function () {};

class A {
  outer() {
    // NOTE: hoisted
    _hoistedAnonymousFunc2();
  }
}

class B {
  outer() {
    // NOTE: not hoisted (!options.methods)
    (() => this)();
  }
}

class C {
  static outer() {
    // NOTE: not hoisted (!options.methods)
    console.log((() => this)());
  }
}