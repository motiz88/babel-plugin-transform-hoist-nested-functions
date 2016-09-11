class A {
  outer () {
    // NOTE: hoisted
    (function () {})();
  }
}

class B {
  outer () {
    // NOTE: not hoisted (!options.methods)
    (() => this)();
  }
}

class C {
  static outer () {
    // NOTE: not hoisted (!options.methods)
    console.log((() => this)());
  }
}
