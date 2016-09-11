class A {
  outer () {
    // NOTE: hoisted
    (function () {})();
  }
}

class B {
  outer () {
    // NOTE: hoisted to bound method
    (() => this)();
  }
}

class C {
  static outer () {
    // NOTE: hoisted to static method
    console.log((() => this)());
  }
}
