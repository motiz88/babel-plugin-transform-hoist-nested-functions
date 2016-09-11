(function () {
  // NOTE: not hoisted
  return () => this;
})();

class A {
    method() {
      // NOTE: not hoisted
      return () => this;
    }
}

(function A () {
  // NOTE: hoisted
  return () =>
    // NOTE: hoisted
    function B () {
      return this;
    };
})();

// NOTE: not hoisted
() => this;
